"use client"

import dynamic from "next/dynamic"
import React from "react"


const MarqueeLib = dynamic(() => import("react-fast-marquee"), { ssr: false });

type MarqueeProps = {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
};

const Marquee: React.FC<MarqueeProps> = ({ children, direction = "left", speed = 50, pauseOnHover = true, className }) => {
  return (
    <MarqueeLib direction={direction} speed={speed} pauseOnHover={pauseOnHover} className={className}>
      {children}
    </MarqueeLib>
  );
};

export default Marquee;
