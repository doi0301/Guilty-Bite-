import type { Metadata } from 'next';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guilty Bite — 해로운 음식 트래커',
  description: '월별 달력 위에 해로운 음식 섭취 이력을 시각적으로 기록하고 리마인드하는 웹 서비스',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-bg-primary font-sans text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
