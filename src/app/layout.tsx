import './globals.css';

import { ViewTransition, type PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';

import { cn } from '~/lib/utils';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Space',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ViewTransition>
      <html lang='en' className='dark'>
        <body className={cn(geistMono.variable)}>
          {/* https://base-ui.com/react/overview/quick-start#set-up */}
          <div id='root'>{children}</div>
        </body>
      </html>
    </ViewTransition>
  );
}
