
"use client"
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { trpc } from './_trpc/client';
import HomePageContent from './_components/HomePageContent';

export default function HomePage() {
  const { user, error, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const { data: chatData, isLoading: isChatLoading } = trpc.chat.getOrCreateChat.useQuery(undefined, {
    enabled: !isUserLoading && !!user,
  });

  useEffect(() => {
    if (user && chatData) {
      router.push(`/chat/${chatData.chatId}`);
    }
  }, [user, chatData, router]);

  if (isUserLoading || (user && isChatLoading)) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted fw-medium mt-3">Setting up your workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error: {error.message}
        </div>
      </div>
    );
  }

  if (!user) {
    return <HomePageContent />;
  }

  return null;
}
