import BuilderCard from '@/components/BuilderCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBF3E1] text-[#06352F]">
      <div className="max-w-5xl mx-auto px-5 py-10 sm:py-16">

        {/* HEADER */}
        <header className="text-center mb-10">

          {/* HH Goa style accent */}
          <div className="h-2 w-24 mx-auto rounded-full mb-6 bg-[#FFC23C]" />

          {/* Hacker House Goa Logo */}
          <div className="relative inline-flex items-center justify-center">

            {/* Main Hacker House logo */}
            <img
              src="/card-assets/hacker-house.png"
              alt="Hacker House"
              className="h-24 sm:h-28 md:h-32 w-auto object-contain"
            />

            {/* Larger Goa logo centered on Hacker House */}
            <img
              src="/card-assets/goa_hindi.svg"
              alt="Goa"
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                h-12
                sm:h-14
                md:h-16
                w-auto
                object-contain
              "
            />

          </div>

          {/* Original subtitle */}
          <p className="font-body text-[#06352F]/70 mt-4">
            Make your Builder ID for Goa · Oct 28–31 2026.
            Upload a photo, we do the rest.
          </p>

        </header>

        {/* BUILDER CARD */}
        <div className="relative">

          {/* Small HH Goa decorative accents */}
          <div className="absolute -top-3 -left-3 w-4 h-4 rounded-full bg-[#FF5A6E]" />

          <div className="absolute -top-2 -right-3 w-3 h-3 rounded-full bg-[#FFC23C]" />

          <BuilderCard />

        </div>

        {/* FOOTER */}
        <footer className="text-center mt-16">

          <div className="flex justify-center items-center gap-3 mb-3">

            <span className="w-2 h-2 rounded-full bg-[#FF5A6E]" />

            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#06352F]/70">
              GOA · BUILD · SHIP · REPEAT
            </span>

            <span className="w-2 h-2 rounded-full bg-[#FFC23C]" />

          </div>

          <p className="text-xs text-[#06352F]/40 font-body">
            Built for the HH Goa 2026 shortlisting task · #FrameInGoa
          </p>

        </footer>

      </div>
    </main>
  );
}