import './globals.css';

import { ViewTransition, type PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';

import { cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/toast';
import { StarBackground } from '~/components/star-background';
import { NotificationManager } from '~/features/control-center/components/notification-manager';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Space',
  description:
    'A personal software workspace where I build and use the tools I need',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ViewTransition>
      <html lang='en' className='dark'>
        <body className={cn(geistMono.variable)}>
          {/* https://base-ui.com/react/overview/quick-start#set-up */}
          <div id='root'>{children}</div>
          <Toaster />
          <NotificationManager />
          <StarBackground />
        </body>
      </html>
    </ViewTransition>
  );
}
