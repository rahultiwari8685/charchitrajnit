"use client";

import { useState, useEffect } from "react";
import { useScrollPosition, useScrollToTop } from "./useWindowEvents";

export function useBackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { scrollY, scrollHeight, clientHeight } = useScrollPosition();
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    const calculatedProgress = (scrollY / (scrollHeight - clientHeight)) * 139.988;
    setProgress(calculatedProgress);
    setIsVisible(scrollY > 100);
  }, [scrollY, scrollHeight, clientHeight]);

  return { isVisible, progress, scrollToTop };
}
