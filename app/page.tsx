import BuilderCard from '@/components/BuilderCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#005B3F] text-[#FFC23C]">
      <div className="max-w-5xl mx-auto px-5 py-10 sm:py-16">

        {/* HEADER */}
        <header className="text-center mb-10">

          {/* HH Goa style accent */}
          <div className="h-2 w-24 mx-auto rounded-full mb-6 bg-[#FFC23C]" />

          {/* Hacker House Goa Logo */}
          <div className="relative inline-flex items-center justify-center">

            {/* Subtle warm glow behind logo */}
            <div
              className="
                absolute
                inset-[-45px]
                rounded-full
                bg-[radial-gradient(circle,rgba(255,242,180,0.22)_0%,rgba(255,194,60,0.10)_35%,transparent_70%)]
                blur-2xl
                pointer-events-none
              "
            />

            {/* Main Hacker House logo */}
            <img
              src="/card-assets/hacker-house.png"
              alt="Hacker House"
              className="
                relative
                z-10
                h-24
                sm:h-28
                md:h-32
                w-auto
                object-contain
              "
            />

            {/* Goa logo */}
           <img 
  src="/card-assets/goa_hindi.svg" 
  alt="Goa" 
  className=" 
    absolute 
    z-20 
    left-[51%] 
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

          {/* Subtitle */}
          <p className="font-body text-[#FBF3E1]/85 mt-4">
            Make your Builder ID for Goa · Oct 28–31 2026.
            Upload a photo, we do the rest.
          </p>

        </header>

        {/* BUILDER CARD */}
        <div className="relative">

          <BuilderCard />

        </div>

        {/* FOOTER */}
        <footer className="text-center mt-16">

          <div className="flex justify-center items-center gap-3 mb-3">

            <span className="w-2 h-2 rounded-full bg-[#FF5A6E]" />

            <span className="
              text-xs
              font-bold
              tracking-[0.16em]
              uppercase
              text-[#FBF3E1]/80
            ">
              GOA · BUILD · SHIP · REPEAT
            </span>

            <span className="w-2 h-2 rounded-full bg-[#FFC23C]" />

          </div>

          <p className="text-xs text-[#FBF3E1]/50 font-body">
            Built for the HH Goa 2026 shortlisting task · #FrameInGoa
          </p>

        </footer>

      </div>
    </main>
  );
}