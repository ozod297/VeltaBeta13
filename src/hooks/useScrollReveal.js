import { useEffect, useRef } from "react";

/**
 * useScrollReveal — elementlar ko'rinish sohasiga kirganida
 * animatsiya klassini qo'shadi. Dizaynni o'zgartirmaydi.
 *
 * @param {string} hiddenClass  — dastlabki yashirin holat klassi
 * @param {string} visibleClass — ko'ringanda qo'shiladigan klass
 * @param {object} options      — IntersectionObserver opsiyalari
 */
export function useScrollReveal(
  hiddenClass = "v-hidden",
  visibleClass = "v-visible",
  options = { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add(hiddenClass);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.remove(hiddenClass);
        el.classList.add(visibleClass);
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [hiddenClass, visibleClass]);

  return ref;
}

/**
 * useStaggerReveal — bir nechta element uchun ketma-ket animatsiya.
 * Konteynerga ref bering, ichidagi selector bo'yicha elementlar
 * navbat bilan paydo bo'ladi.
 */
export function useStaggerReveal(
  selector = "[data-stagger]",
  options = { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll(selector);
    items.forEach((el, i) => {
      el.classList.add("v-hidden");
      el.style.transitionDelay = `${i * 0.08}s`;
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        items.forEach((el) => {
          el.classList.remove("v-hidden");
          el.classList.add("v-visible");
        });
        observer.unobserve(container);
      }
    }, options);

    observer.observe(container);
    return () => observer.disconnect();
  }, [selector]);

  return ref;
}
