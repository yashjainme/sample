import type { Metadata } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import TRPCProvider from './_trpc/Provider';
import BootstrapClient from './_components/BootstrapClient';

export const metadata: Metadata = {
  title: 'Apex AI',
  description: 'A mobile-only ChatGPT clone powered by Next.js and Gemini.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <TRPCProvider>
            <div className="mobile-container">
              {children}
            </div>
            <BootstrapClient />
          </TRPCProvider>
        </body>
      </UserProvider>
    </html>
  );
}