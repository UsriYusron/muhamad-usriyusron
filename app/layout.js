import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Providers from "./providers";
import AIChatButton from "@/components/AIChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// JSON-LD Structured Data untuk Rich Snippets (Schema.org)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Muhamad Usri Yusron',
  jobTitle: 'Full Stack Developer & AI Engineer',
  url: 'https://muhamad-usriyusron.site',
  image: 'https://i.imgur.com/XTrZl3g.jpeg',
  sameAs: [
    'https://github.com/UsriYusron',
    'https://www.linkedin.com/in/muhamad-usriyusron/',
    'https://wa.me/6283827406460'
  ],
  knowsAbout: [
    'Web Development',
    'Software Engineering',
    'Next.js',
    'Laravel',
    'JavaScript',
    'Python',
    'MongoDB',
    'Machine Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Large Language Models'
  ],
  description: 'Full Stack Developer & AI Engineer specializing in Web Development, Machine Learning, Computer Vision, and NLP.',
  address: {
    '@type': 'PostalAddress',
    'addressLocality': 'Jakarta',
    'addressCountry': 'Indonesia'
  }
};

export const metadata = {
  metadataBase: new URL('https://muhamad-usriyusron.site'),
  title: {
    default: 'Muhamad Usri Yusron | Full Stack Developer & AI Engineer',
    template: '%s | Muhamad Usri Yusron',
  },
  description: 'Portfolio & Blog of Muhamad Usri Yusron. Full Stack Developer specializing in Web Development, Machine Learning, Computer Vision, and Natural Language Processing. Hire me to build reliable software solutions.',
  keywords: [
    'Muhamad Usri Yusron',
    'Usri Yusron',
    'Full Stack Developer',
    'AI Engineer',
    'Next.js Developer',
    'Laravel Developer',
    'Software Engineer Indonesia',
    'Jasa Pembuatan Website',
    'Developer Jakarta',
    'Machine Learning',
    'Computer Vision',
    'NLP'
  ],
  authors: [{ name: 'Muhamad Usri Yusron', url: 'https://muhamad-usriyusron.site' }],
  creator: 'Muhamad Usri Yusron',
  publisher: 'Muhamad Usri Yusron',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://muhamad-usriyusron.site',
    title: 'Muhamad Usri Yusron | Full Stack Developer & AI Engineer',
    description: 'Portfolio & Blog of Muhamad Usri Yusron. Full Stack Developer specializing in Web Development, Machine Learning, Computer Vision, and Natural Language Processing.',
    siteName: 'Muhamad Usri Yusron Portfolio',
    images: [
      {
        url: 'https://i.imgur.com/XTrZl3g.jpeg',
        width: 1200,
        height: 630,
        alt: 'Muhamad Usri Yusron - Full Stack Developer & AI Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhamad Usri Yusron | Full Stack Developer & AI Engineer',
    description: 'Portfolio & Blog of Muhamad Usri Yusron. Full Stack Developer specializing in Web Development, Machine Learning, Computer Vision, and Natural Language Processing.',
    images: ['https://i.imgur.com/XTrZl3g.jpeg'],
    creator: '@usriyusron',
  },
  alternates: {
    canonical: 'https://muhamad-usriyusron.site',
  },
  verification: {
    google: 'ILWdl7aiqdq0Ai2R8qkZwaCBIAk1fknaQO_rv2rpFLI',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Inject JSON-LD Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
          <AIChatButton />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}