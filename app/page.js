// Server Component — tidak ada 'use client' di sini
import HomeClient from '@/components/HomeClient';
import FooterWrapper from '@/components/FooterWrapper';

export default function Home() {
  return (
    <>
      <HomeClient />
      <FooterWrapper />
    </>
  );
}
