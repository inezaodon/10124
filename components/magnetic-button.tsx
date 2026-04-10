"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
};

export function MagneticButton({ children, href }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 15 });
  const springY = useSpring(y, { stiffness: 220, damping: 15 });

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const deltaX = event.clientX - (rect.left + rect.width / 2);
        const deltaY = event.clientY - (rect.top + rect.height / 2);
        x.set(deltaX * 0.15);
        y.set(deltaY * 0.15);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="pop-btn-primary px-5 py-2.5 text-sm"
    >
      {children}
    </motion.a>
  );
}
