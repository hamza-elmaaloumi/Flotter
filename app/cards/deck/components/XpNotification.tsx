"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface XpNotificationProps {
  amount: number | null
}

/**
 * Golden XP toast notification with SVG lightning bolt,
 * smooth framer-motion entrance/exit, and subtle glow effect.
 */
export default function XpNotification({ amount }: XpNotificationProps) {
  return (
    <AnimatePresence mode="wait">
      {amount !== null && (
        <motion.div
          key={amount + "-" + Date.now()}
          className="fixed top-16 left-1/2 z-[200] pointer-events-none"
          initial={{ x: "-50%", y: -24, opacity: 0, scale: 0.7 }}
          animate={{ x: "-50%", y: 0, opacity: 1, scale: 1 }}
          exit={{ x: "-50%", y: -18, opacity: 0, scale: 0.85 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 28,
            mass: 0.8,
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Pill badge */}
          <motion.div
            className="relative flex items-center gap-2.5 px-5 py-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)",
              boxShadow:
                "0 4px 24px rgba(250,204,21,0.35), 0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            {/* SVG Lightning bolt */}
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 18,
                delay: 0.08,
              }}
            >
              <path
                d="M13 2L4.093 12.688c-.348.418-.522.627-.525.804a.5.5 0 0 0 .185.399c.138.109.41.109.955.109H12l-1 8 8.907-10.688c.348-.418.522-.627.525-.804a.5.5 0 0 0-.185-.399c-.138-.109-.41-.109-.955-.109H12l1-8Z"
                fill="#422006"
                stroke="#422006"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>

            {/* XP text */}
            <span
              className="font-black text-sm tracking-wide select-none"
              style={{ color: "#422006" }}
            >
              +{amount} XP
            </span>

            {/* Sparkle dots (decorative) */}
            <motion.span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/70"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            />
            <motion.span
              className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-white/50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
