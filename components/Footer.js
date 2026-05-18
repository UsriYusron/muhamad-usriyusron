// Footer.js
import { StickyFooter } from "./StickyFooter";
import BubbleMenu from "./BubbleMenu";
import Link from "next/link";
import ArticlePreview from "@/components/blog/ArticlePreview";

export function Footer({ articles = [] }) {
    return (
        <div className="w-full relative">
            {/* Konten utama */}
            <div className="min-h-[100dvh] md:h-[150dvh] w-full">
                <div className="bg-neutral-200 dark:bg-neutral-800 rounded-3xl min-h-[100dvh] md:h-full flex flex-col items-center justify-center px-4 sm:px-8 py-12 md:py-0">
                    {/* Article Preview Section */}
                    <section className="w-full max-w-6xl mx-auto px-4" aria-label="Artikel terbaru">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Article</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                            read or write your own articles here by joining as a contributor
                            </p>
                        </div>
                        <ArticlePreview articles={articles} />
                        <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-block text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white underline underline-offset-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
                            >
                                Kontribusi penulisan artikel
                            </Link>
                            <span className="inline-block text-sm font-medium text-neutral-700 dark:text-neutral-300">atau</span>
                            <Link
                                href="/blog"
                                className="inline-block text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white underline underline-offset-4 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
                            >
                                Lihat Semua Artikel
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            {/* Container untuk sticky footer */}
            <div className="relative h-[100dvh]">
                <StickyFooter
                    heightValue="100dvh"
                    className="text-neutral-900 dark:text-neutral-100 absolute bottom-0"
                >
                    <Content />
                </StickyFooter>
            </div>
        </div>
    );
}

export default Footer;

export function Content() {
    const tahun = new Date().getFullYear();

    const items = [
        {
            label: 'Whatsapp',
            href: 'https://wa.me/6283827406460',
            Target: '_blank',
            ariaLabel: 'Whatsapp',
            rotation: -8,
            hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
        },
        {
            label: 'Linkedin',
            href: 'https://www.linkedin.com/in/muhamad-usriyusron/',
            Target: '_blank',
            ariaLabel: 'LinkedIn',
            rotation: 8,
            hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
        },
        {
            label: 'Github',
            href: 'https://github.com/UsriYusron',
            Target: '_blank',
            ariaLabel: 'Github',
            rotation: 8,
            hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
        },
        {
            label: 'Youtube',
            href: '#',
            ariaLabel: 'Youtube',
            rotation: 8,
            hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
        },
        {
            label: 'Instagram',
            href: '#',
            ariaLabel: 'Instagram',
            rotation: -8,
            hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
        }
    ];

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">

            <div className="py-8 px-12 h-full w-full flex flex-col justify-between">
                <div className="flex justify-between flex-col  sm:flex-row items-end p-20">
                    <h1 className="text-[14vw] leading-[0.8] ">Thanks for Visiting</h1>
                </div>

                <div className="flex justify-between flex-col gap-4 sm:flex-row items-end shrink-0 gap-20">
                    {/* <div className="flex flex-col gap-2"> */}
                    <BubbleMenu
                        logo={<span style={{ fontWeight: 700 }}>RB</span>}
                        items={items}
                        menuAriaLabel="Toggle navigation"
                        menuBg="#00FFFF"
                        menuContentColor="#111111"
                        useFixedPosition={false}
                        animationEase="back.out(1.5)"
                        animationDuration={0.5}
                        staggerDelay={0.12}
                    />
                    {/* </div> */}

                    <p>©{tahun} copyright</p>
                </div>
            </div>
        </div>
    );
}
