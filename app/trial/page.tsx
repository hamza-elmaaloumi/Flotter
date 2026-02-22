'use client';

import React, { useState } from 'react';
import StreakCelebration from "../cards/deck/components/StreakCelebration";

export default function TrialPage() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            {/* Button to bring it back if you dismiss it */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold"
                >
                    Show Streak Modal
                </button>
            )}

            <StreakCelebration 
                visible={isOpen} 
                onDismiss={() => setIsOpen(false)} 
                streak={4} 
                swipeCount={15} 
                sessionXp={120} 
                isPro={false} 
            />




            
        </div>
    )
}