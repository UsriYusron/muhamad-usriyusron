// Footer.js
import { StickyFooter } from "./StickyFooter";
import BubbleMenu from "./BubbleMenu";
import { Target } from "lucide-react";

import PixelTrail from "./PixelTrail";

export function Footer() {
    return (
        <div className="w-full relative">
            {/* Konten utama */}
            <div className="h-[150dvh] w-full">
                <div className="bg-neutral-200 dark:bg-neutral-800 rounded-3xl h-full flex flex-col items-center justify-center">
                    <p className="text-xl uppercase text-neutral-950 dark:text-neutral-200 font-medium">
                        some content
                    </p>
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
<section className="bg-white dark:bg-gray-800 min-h-screen relative overflow-hidden">
  
  {/* 1. LAYER BACKGROUND (PixelTrail) - Paling Bawah */}
  <div className="absolute inset-0 z-0 pointer-events-auto">
    <PixelTrail
      gridSize={50}
      trailSize={0.1}
      maxAge={250}
      interpolate={5}
      color="#5227FF"
      gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
      gooeyEnabled
      gooStrength={2}
      // Pastikan props di bawah ini ada jika komponen mendukungnya:
      backgroundColor="transparent" 
    />
  </div>

  {/* 2. LAYER KONTEN (Teks & Menu) - Paling Atas */}
  <div className="relative z-10 h-full w-full flex flex-col justify-between min-h-screen pointer-events-none">
    
    {/* Bagian Atas/Tengah: H1 */}
    <div className="flex flex-1 justify-center items-center p-10 md:p-20">
      <h1  className="text-[14vw] leading-[0.8] ">
        Thanks for Visiting
      </h1>
    </div>

    {/* Bagian Bawah: Menu & Copyright */}
    <div className="py-8 px-12 flex justify-between items-end w-full">
      <div className="pointer-events-auto">
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
      </div>
      
      <p className="select-none text-gray-600 dark:text-gray-400 font-medium pointer-events-none">
        ©{tahun} copyright
      </p>
    </div>

  </div>
</section>
    );
}
