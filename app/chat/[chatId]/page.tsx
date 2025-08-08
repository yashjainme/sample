'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Header from '../../_components/Header';
import ChatView from '../../_components/ChatView';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { user, isLoading } = useUser();
  const { chatId } = params;

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Although protected by the layout, this is an extra check.
  if (!user) {
     // Redirect logic or a login prompt can go here. For now, just a message.
     return <div className="text-center p-5">Please log in to view chats.</div>
  }

  return (
    <>
      <Header />
      <ChatView chatId={chatId} />
    </>
  );
}