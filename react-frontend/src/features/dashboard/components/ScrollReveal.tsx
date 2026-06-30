import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fade-in-up"
    | "fade-in-left"
    | "fade-in-right"
    | "scale-in"
    | "fade-in";
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  duration = 600,
  triggerOnce = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Find the nearest scrollable parent element to use as the root
    let parent = currentRef.parentElement;
    let scrollParent: HTMLElement | undefined = undefined;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        scrollParent = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(currentRef);
          }
        } else {
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      {
        root: scrollParent || null, // Fallback to viewport if no scrollable parent found
        threshold: 0.02, // Lower threshold for more reliable triggering
        rootMargin: "0px 0px -20px 0px",
      },
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnce]);

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case "fade-in-up":
          return "opacity-0 translate-y-8 pointer-events-none";
        case "fade-in-left":
          return "opacity-0 -translate-x-8 pointer-events-none";
        case "fade-in-right":
          return "opacity-0 translate-x-8 pointer-events-none";
        case "scale-in":
          return "opacity-0 scale-95 pointer-events-none";
        case "fade-in":
        default:
          return "opacity-0 pointer-events-none";
      }
    } else {
      switch (animation) {
        case "fade-in-up":
          return "opacity-100 translate-y-0";
        case "fade-in-left":
          return "opacity-100 translate-x-0";
        case "fade-in-right":
          return "opacity-100 translate-x-0";
        case "scale-in":
          return "opacity-100 scale-100";
        case "fade-in":
        default:
          return "opacity-100";
      }
    }
  };

  const style = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${getAnimationClass()} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
export { ScrollReveal };
