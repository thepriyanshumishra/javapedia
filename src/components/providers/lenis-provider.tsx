"use client"; // Mark as a client component

import React, { useEffect } from "react";
import Lenis from "lenis";

const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Customize duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      touchMultiplier: 2, // Multiplier for touch devices
      wheelMultiplier: 1, // Multiplier for mouse wheel
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Clean up on unmount
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
