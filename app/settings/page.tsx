"use client"

import React, { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"

export default function SettingsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const items: { title: string; content: React.ReactNode }[] = [
    {
      title: "Mastering XP & Ranking",
      content: (
        <div className="space-y-4 text-[14px] font-normal text-[#9CA3AF] leading-relaxed">
          <section>
            <p className="font-bold text-[#FFFFFF] mb-2 uppercase text-[11px] tracking-wider">How our XP works</p>
            <p className="mb-2">XP (Experience Points) is the heartbeat of Flotter. It tracks your focus and consistency.</p>
            <ul className="list-disc pl-5 space-y-2 text-[13px]">
              <li><span className="text-[#3B82F6] font-bold">+10 XP</span>: Perfect Review (Flip, wait <span className="text-white">1.5s</span> for focus, then swipe).</li>
              <li><span className="text-[#FACC15] font-bold">+5 XP</span>: Audio Context (Listen to the <span className="text-white">full AI sentence</span> audio).</li>
              <li><span className="text-[#10B981] font-bold">+50 XP</span>: Builder Bonus (Add a <span className="text-white">new card</span> to your deck).</li>
              <li className="italic text-[#6B7280]">Note: Swiping before 1.5s results in 0 XP. Quality focus matters.</li>
            </ul>
          </section>

          <section className="pt-2 border-t border-[#262626]">
            <p className="font-bold text-[#FFFFFF] mb-2 uppercase text-[11px] tracking-wider">Climbing the Ranking</p>
            <p className="mb-2">Your <span className="text-white">Monthly Ranking</span> is derived from the XP you accumulate in a calendar month.</p>
            <ul className="space-y-2 text-[13px]">
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">1.</span>
                <span><span className="text-white font-semibold">Maximize Each Card:</span> Instead of rushing cards, always listen to the AI audio to grab that extra <span className="text-[#FACC15] font-bold">+5 XP</span> per card.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">2.</span>
                <span><span className="text-white font-semibold">Consistency is Key:</span> Maintain a daily streak to elevate your visibility to other learners.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">3.</span>
                <span><span className="text-white font-semibold">Monthly Resets:</span> The leaderboard resets at the start of every month. If you're behind, use the first day of the month to sprint ahead!</span>
              </li>
            </ul>
          </section>
        </div>
      ),
    },
    {
      title: "App guide",
      content: (
        <div className="space-y-3 text-[14px] font-normal text-[#9CA3AF] leading-relaxed">
          <p>
            Flotter is a mobile-first active-recall flashcard app that masks a
            target word in context so you practise retrieval. It's built for
            short, repeatable reviews using a Leitner-style SRS.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Tap anywhere on a card to flip it (front ↔ back).</li>
            <li>Masked target words help trigger active recall.</li>
            <li>Browser TTS reads sentences automatically on the back.</li>
            <li>Swipe right to promote, swipe left to relearn.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Support",
      content: (
        <div className="space-y-3 text-[14px] font-normal text-[#9CA3AF]">
          <p>For bugs or feature requests, reach out to our team.</p>
          <div className="p-4 rounded-[12px] bg-[#121212] border border-[#2D2D2F]">
            <p className="text-[11px] font-bold uppercase text-[#6B7280] mb-1">Email</p>
            <a className="text-[#3B82F6] font-semibold flex items-center gap-2" href="mailto:support@flotter.app">
              support@flotter.app <ExternalLink size={14} />
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "Terms of use",
      content: (
        <div className="text-[14px] font-normal text-[#9CA3AF]">
          <p>The service is provided "as-is". By using Flotter you agree to respect intellectual property and provide accurate account info.</p>
        </div>
      ),
    },
    {
      title: "Privacy policy",
      content: (
        <div className="text-[14px] font-normal text-[#9CA3AF]">
          <p>Flotter collects minimum data: email, hashed password, and progress metadata. We do not sell personal data.</p>
        </div>
      ),
    },
  ]

  return (
    // Added 'w-full' and 'items-stretch' to ensure the layout doesn't snap width
    <main className="min-h-screen bg-[#121212] flex flex-col items-center p-4 antialiased">
      <div className="w-full max-w-md">
        <h1 className="text-[22px] font-bold text-[#FFFFFF] mb-8 mt-6">Settings</h1>
        
        <div className="flex flex-col gap-3">
          {items.map((it, i) => {
            const isOpen = openIndex === i
            return (
              <section 
                key={it.title} 
                className="bg-[#1C1C1E] border border-[#2D2D2F] rounded-[12px] transition-all duration-200 ease-in-out"
              >
                <button
                  onClick={() => toggle(i)}
                  className={`w-full h-[48px] flex items-center justify-between px-6 text-left focus:outline-none ${
                    isOpen ? "bg-[#222222]/50" : ""
                  }`}
                >
                  <span className="text-[16px] font-semibold text-[#FFFFFF]">{it.title}</span>
                  <ChevronDown
                    size={20}
                    className={`text-[#6B7280] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#3B82F6]" : "rotate-0"
                    }`}
                  />
                </button>
                
                {/* Fixed height transition container to prevent layout jumping */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 border-t border-[#262626]">
                      {it.content}
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <footer className="mt-16 text-center">
          <p className="text-[11px] font-bold text-[#48484A] uppercase tracking-[0.2em]">
            Flotter Engine V1.0
          </p>
        </footer>
      </div>
    </main>
  )
}