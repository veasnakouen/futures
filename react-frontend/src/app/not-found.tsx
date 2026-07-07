"use client";
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        
        {/* Left Side: Unplugged Wire Illustration */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
          {/* Light grey circle background */}
          <div className="absolute inset-0 bg-[#f4f5f9] rounded-full scale-90" />
          
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-[#2c3e66]" fill="none" stroke="currentColor">
            {/* Top Wire */}
            <path d="M 200 30 L 110 30 Q 100 30 100 40 L 100 70" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Top Plug Socket */}
            <path d="M 90 70 L 110 70 A 5 5 0 0 1 115 75 L 115 90 L 85 90 L 85 75 A 5 5 0 0 1 90 70 Z" fill="currentColor" strokeWidth="0" />
            <rect x="80" y="90" width="40" height="4" fill="currentColor" />

            {/* Bottom Wire */}
            <path d="M 0 170 L 90 170 Q 100 170 100 160 L 100 130" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Bottom Plug Head */}
            <path d="M 90 130 L 110 130 A 5 5 0 0 0 115 125 L 115 110 L 85 110 L 85 125 A 5 5 0 0 0 90 130 Z" fill="currentColor" strokeWidth="0" />
            <rect x="80" y="106" width="40" height="4" fill="currentColor" />
            
            {/* Prongs */}
            <rect x="90" y="94" width="4" height="12" fill="currentColor" />
            <rect x="106" y="94" width="4" height="12" fill="currentColor" />

            {/* Sparks / Action lines (Top Left) */}
            <line x1="75" y1="75" x2="65" y2="65" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="80" x2="50" y2="80" strokeWidth="3" strokeLinecap="round" />
            
            {/* Sparks / Action lines (Bottom Right) */}
            <line x1="125" y1="125" x2="135" y2="135" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="120" x2="150" y2="120" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right Side: Text Content */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[120px] leading-none font-bold text-[#2c3e66] tracking-tighter mb-2">
            404
          </h1>
          <h2 className="text-3xl font-bold text-[#2c3e66] mb-6">
            Page Not Found
          </h2>
          
          <div className="text-[#aeb6c6] text-sm md:text-base font-medium max-w-xs mb-8">
            <p>We're sorry, the page you requested could not be found.</p>
            <p>Please go back to the homepage</p>
          </div>

          <Link 
            href="/" 
            className="px-10 py-3.5 bg-[#2c3e66] hover:bg-[#1e2a48] text-white font-bold rounded-full transition-colors tracking-wide text-sm shadow-md"
          >
            GO HOME
          </Link>
        </div>

      </div>
    </div>
  );
}
