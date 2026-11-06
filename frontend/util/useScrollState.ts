'use client'
import { useEffect, useState } from 'react';

export function useScrollState() {
  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollCheck: boolean = window.scrollY > 100;
      setScroll(scrollCheck);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scroll;
}
