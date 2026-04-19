"use client";

import { type RefCallback, useCallback } from "react";

export function useReveal<T extends HTMLElement>(): RefCallback<T> {
  return useCallback((node: T | null) => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.setAttribute("data-visible", "true");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-visible", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
  }, []);
}
