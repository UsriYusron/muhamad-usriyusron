'use client'

export default function ExperienceSection() {
    return (
        <>
              <section className="bg-white dark:bg-gray-800 min-h-screen py-12">
        <div className="container mx-auto px-4">

          {/* Header Section */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              internship, freelance and laboratory assistant experience
            </p>
          </div>

          {/* Container untuk Timeline dengan efek PixelTrail */}
          <div className="relative w-full rounded-lg overflow-hidden">

            {/* Iframe Timeline dengan atribut yang benar */}
            <div className="relative z-10">
              <iframe
                src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vR9Ww9WUkrzxxWnq-zaI9JG68wTLiV8FVTvsmjCGyioiTog8enF1afXs0W151XVskf8Y0MJETZ5K6HF&font=Default&lang=en&initial_zoom=2&width=100%25&height=650'
                width="100%"
                height="650"
                // Vendor prefixes sebagai string
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                // React camelCase untuk atribut standar
                allowFullScreen
                frameBorder="0"
                // Atribut lainnya
                title="Experience Timeline"
                className="rounded-lg shadow-lg"
                loading="lazy" // Tambahkan lazy loading untuk performa
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Sesuaikan kebutuhan
              />
            </div>
          </div>
        </div>
      </section>
        </>
    );
}