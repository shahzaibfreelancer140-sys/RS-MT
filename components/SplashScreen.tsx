"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        
        {/* Glow */}
        <div className="absolute w-32 h-32 rounded-full bg-red-600/20 blur-3xl animate-pulse" />

        {/* R Logo */}
        <div className="relative">
          <div className="r-logo">
            R
          </div>

          {/* Ring */}
          <div className="absolute inset-[-18px] rounded-full border border-red-600/30 animate-spin-slow" />
        </div>

      </div>
    </div>
  );
}