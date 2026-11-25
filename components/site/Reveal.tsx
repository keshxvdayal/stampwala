"use client";
import { useEffect, useRef } from "react";

/** Content is visible by default (SSR / no-JS safe). On mount, anything below the fold is hidden and revealed on scroll. */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as "div";
  return <T ref={ref} className={className} style={{ transitionDelay: `${delay}ms` }}>{children}</T>;
}
