'use client';

import { useEffect, useRef, useState } from 'react';
import { trpc } from '../_trpc/client';
import ChatInput from './ChatInput';
import { type inferRouterOutputs } from '@trpc/server';
import { type AppRouter } from '@/server/routers/_app';
import Image from 'next/image';

// The Message type now includes the 'type' property from your DB
type Message = inferRouterOutputs<AppRouter>['chat']['getMessages'][0] & { type: string | null };

export default function ChatView({ chatId }: { chatId: string }) {
  const utils = trpc.useContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch initial messages
  const { data: initialMessages, isLoading: isMessagesLoading } = trpc.chat.getMessages.useQuery(
    { chatId },
    {
      onSuccess: (data) => {
        setMessages(data as Message[]);
      },
    }
  );

  // Mutation for sending a message
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (newAssistantMessage) => {
      // Find the optimistic message and replace it
      setMessages((prev) =>
        prev.map((msg) =>
          msg.content === '...' && msg.role === 'assistant'
            ? (newAssistantMessage as Message)
            : msg
        )
      );
       utils.chat.getMessages.invalidate({ chatId });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      // Remove the optimistic user and assistant message on error
      setMessages(prev => prev.filter(msg => msg.content !== '...').slice(0, -1));
    }
  });

  const handleSendMessage = (content: string) => {
    const optimisticUserMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: chatId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
      type: 'text',
    };

    const optimisticAssistantMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: chatId,
      role: 'assistant',
      content: '...', // Placeholder for loading state
      created_at: new Date().toISOString(),
      type: 'text',
    };
    
    setMessages((prev) => [...prev, optimisticUserMessage, optimisticAssistantMessage]);
    sendMessageMutation.mutate({ chatId, content });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Messages Container */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{
          backgroundColor: '#fafafa',
          padding: '1.5rem 1rem 12rem 1rem', // Generous bottom padding for the floating input
        }}
      >
        <div className="container-fluid" style={{ maxWidth: '800px' }}>
          {isMessagesLoading ? (
             <div className="d-flex align-items-center justify-content-center h-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center py-5">
                 <div 
                   className="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                   style={{ 
                     width: '60px', 
                     height: '60px',
                     background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                     color: 'white',
                     fontSize: '1.5rem'
                   }}
                 > A </div>
                 <h5 className="text-dark fw-bold mb-1">How can I help you today?</h5>
                 <p className="text-muted small">Ask me anything to get started.</p>
               </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const showAvatar = msg.role === 'assistant' && (index === 0 || messages[index - 1].role !== 'assistant');
              const isConsecutive = msg.role === 'assistant' && !showAvatar;

              return (
                <div key={msg.id} className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
                  <div className="d-flex gap-2 align-items-end" style={{ maxWidth: '85%' }}>
                    {/* Assistant Avatar */}
                    {showAvatar && (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{
                          width: '32px', height: '32px',
                          background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                          fontSize: '0.85rem'
                        }}
                      > A </div>
                    )}
                    
                    {/* Message Content */}
                    <div className={`${msg.role === 'user' ? 'order-last' : ''}`} style={{ marginLeft: isConsecutive ? '40px' : '0' }}>
                      <div
                        className={`px-3 py-2 ${ msg.role === 'user' ? 'bg-black text-white' : 'bg-white border'}`}
                        style={{
                          borderRadius: '1.25rem',
                          borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1.25rem',
                          borderBottomLeftRadius: msg.role === 'assistant' ? '0.25rem' : '1.25rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          wordBreak: 'break-word',
                          lineHeight: '1.6'
                        }}
                      >
                        {msg.type === 'image' ? (
                          <Image src={msg.content} alt="Generated image" width={280} height={200} className="rounded-3" style={{ objectFit: 'cover' }} />
                        ) : msg.content === '...' ? (
                           <div className="d-flex align-items-center gap-2 py-1">
                              <div className="rounded-circle" style={{width: '6px', height: '6px', backgroundColor: '#94a3b8', animation: 'pulse 1.4s ease-in-out infinite'}}></div>
                              <div className="rounded-circle" style={{width: '6px', height: '6px', backgroundColor: '#94a3b8', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '0.2s'}}></div>
                              <div className="rounded-circle" style={{width: '6px', height: '6px', backgroundColor: '#94a3b8', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '0.4s'}}></div>
                           </div>
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={sendMessageMutation.isLoading} />
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}