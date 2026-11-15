"use client";

import { stagger, useAnimate } from "framer-motion";
import { useEffect, type ReactNode } from "react";

import "./home-motion.css";

/** Motion enhances server-rendered children without importing sections or loaders. */
export function HomeMotion({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    const root = scope.current;
    if (!root || !window.matchMedia || !window.IntersectionObserver) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = new Map<HTMLElement, { group: HTMLElement; index: number }>();
    root.querySelectorAll<HTMLElement>(
      ".home-motion-heading, .home-motion-media, [data-home-motion]",
    ).forEach((element) => targets.set(element, { group: element, index: 0 }));
    root.querySelectorAll<HTMLElement>(
      "[data-home-motion-group], .home-motion-stages, .home-motion-faq",
    ).forEach((group) => {
      Array.from(group.children).forEach((element, index) => {
        if (element instanceof HTMLElement) targets.set(element, { group, index });
      });
    });

    const originalStyles = new Map(Array.from(targets.keys(), (element) => [
      element, { opacity: element.style.opacity, transform: element.style.transform },
    ]));
    const running = new Map<HTMLElement, ReturnType<typeof animate>>();
    const nextStart = new Map<HTMLElement, number>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const restore = (element: HTMLElement) => {
      const original = originalStyles.get(element);
      element.style.opacity = original?.opacity ?? "";
      element.style.transform = original?.transform ?? "";
    };
    const expose = (element: HTMLElement) => {
      observer?.unobserve(element);
      running.get(element)?.stop();
      running.delete(element);
      restore(element);
      element.dataset.homeReveal = "visible";
    };
    const reset = () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      targets.forEach((_, element) => {
        expose(element);
        delete element.dataset.homeReveal;
      });
      nextStart.clear();
    };
    const enter = (elements: HTMLElement[], group: HTMLElement, initial = false) => {
      const now = performance.now() / 1000;
      const hero = group.closest("#hero");
      const heroDelay = group.dataset.homeMotionGroup === "hero-actions" ? 0.18
        : group.dataset.homeMotionGroup === "hero-highlights" ? 0.36 : 0;
      const startDelay = initial ? heroDelay : Math.max(0, (nextStart.get(group) ?? 0) - now);
      const delay = stagger(0.18, { startDelay });
      nextStart.set(group, now + startDelay + elements.length * 0.18);

      elements.forEach((element, index) => {
        observer?.unobserve(element);
        const opacity = initial ? 0.65 : 0;
        const y = hero ? 14 : 24;
        element.dataset.homeReveal = "animating";
        element.style.opacity = String(opacity);
        element.style.transform = `translateY(${y}px)`;
        const controls = animate(element, { opacity: [opacity, 1], y: [y, 0] }, {
          duration: 1.1,
          ease: [0.22, 0.61, 0.36, 1],
          delay: delay(index, elements.length),
        });
        running.set(element, controls);
        controls.then(() => {
          if (running.get(element) !== controls) return;
          running.delete(element);
          restore(element);
          element.dataset.homeReveal = "visible";
        });
      });
    };
    const exposeTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      targets.forEach((_, element) => {
        if (element.contains(target) || target.contains(element)) expose(element);
      });
    };
    const exposeHash = () => {
      try {
        exposeTarget(document.getElementById(decodeURIComponent(location.hash.slice(1))));
      } catch {
        // Malformed fragments must not prevent access to page content.
      }
    };
    const exposeVisible = () => {
      targets.forEach((_, element) => {
        const bounds = element.getBoundingClientRect();
        if (element.dataset.homeReveal === "pending" && bounds.top < innerHeight && bounds.bottom > 0) {
          expose(element);
        }
      });
    };
    const scheduleRestoration = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(exposeVisible);
    };
    const focus = (event: FocusEvent) => exposeTarget(event.target);
    const start = () => {
      reset();
      if (preference.matches) return;
      observer = new IntersectionObserver((entries) => {
        const batches = new Map<HTMLElement, HTMLElement[]>();
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
          const target = targets.get(entry.target);
          if (!target || entry.target.dataset.homeReveal !== "pending") return;
          const items = batches.get(target.group) ?? [];
          items.push(entry.target);
          batches.set(target.group, items);
        });
        batches.forEach((items, group) => {
          items.sort((a, b) => (targets.get(a)?.index ?? 0) - (targets.get(b)?.index ?? 0));
          enter(items, group);
        });
      }, { rootMargin: "0px 0px -48px 0px", threshold: 0.1 });

      const initialGroups = new Map<HTMLElement, HTMLElement[]>();
      targets.forEach(({ group }, element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top >= innerHeight) {
          observer?.observe(element);
          element.dataset.homeReveal = "pending";
        } else if (bounds.bottom > 0 && (group !== element || element.closest("#hero"))) {
          const items = initialGroups.get(group) ?? [];
          items.push(element);
          initialGroups.set(group, items);
        }
      });
      initialGroups.forEach((items, group) => enter(items, group, true));
      exposeHash();
      scheduleRestoration();
    };

    start();
    preference.addEventListener("change", start);
    root.addEventListener("focusin", focus);
    window.addEventListener("hashchange", exposeHash);
    window.addEventListener("pageshow", scheduleRestoration);
    window.addEventListener("popstate", scheduleRestoration);
    return () => {
      reset();
      preference.removeEventListener("change", start);
      root.removeEventListener("focusin", focus);
      window.removeEventListener("hashchange", exposeHash);
      window.removeEventListener("pageshow", scheduleRestoration);
      window.removeEventListener("popstate", scheduleRestoration);
    };
  }, [animate, scope]);

  return <div ref={scope} data-home-motion-root>{children}</div>;
}
