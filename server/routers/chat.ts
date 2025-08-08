import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { getApiResponse, type ChatHistory } from '@/lib/gemini';
import { TRPCError } from '@trpc/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const chatRouter = router({
  getOrCreateChat: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    // Use the admin client to find or create the user, bypassing RLS
    let { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth0_id', user.sub)
      .single();

    if (!dbUser) {
      // Use the admin client for the insert operation
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({ auth0_id: user.sub, email: user.email })
        .select('id')
        .single();
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      dbUser = data;
    }

    // Creating the chat itself can still use the admin client
    let { data: chat } = await supabaseAdmin
      .from('chats')
      .select('id')
      .eq('user_id', dbUser.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!chat) {
      const { data, error } = await supabaseAdmin
        .from('chats')
        .insert({ user_id: dbUser.id })
        .select('id')
        .single();
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      chat = data;
    }

    return { chatId: chat.id };
  }),

  getMessages: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Use the authenticated client from the context
      const { supabase } = ctx;
      if (!supabase) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not available.' });
      }

      const { chatId } = input;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        // The error from Supabase might be "JWT expired"
        if (error.code === 'PGRST301') {
           throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
      return data;
    }),

   sendMessage: protectedProcedure
    .input(z.object({
      chatId: z.string().uuid(),
      content: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      if (!supabase) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not available.' });
      }

      const { chatId, content } = input;

      const { data: historyData, error: historyError } = await supabase
        .from('messages')
        .select('role, content')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (historyError) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: historyError.message });
      }
      
      const formattedHistory: ChatHistory = historyData.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Insert user's text message
      await supabase
        .from('messages')
        .insert({ chat_id: chatId, role: 'user', content, type: 'text' });

      // CORRECTED: Call getApiResponse instead of getGeminiResponse
      const apiResponse = await getApiResponse(content, formattedHistory);

      // Insert assistant's message, now including the type
      const { data: assistantMessage, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          role: 'assistant',
          content: apiResponse.content,
          type: apiResponse.type, // Save the message type
        })
        .select()
        .single();
      
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      return assistantMessage;
    }),
});