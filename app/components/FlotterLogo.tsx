"use client";

import { motion } from "framer-motion";

interface FlotterLogoProps {
    isDark: boolean;
    height?: number;
}

export default function FlotterLogo({ isDark, height = 32 }: FlotterLogoProps) {
    const accentBlue = isDark ? "#60A5FA" : "#3B82F6";
    const accentRed = isDark ? "#F87171" : "#EF4444";

    // Animation Configuration
    // Total loop: 10s (Extended rest phase for professional cadence)
    // 0-0.8s: Simultaneous spread (Explosion Phase)
    // 0.8-3.5s: Smooth orbit around logo (Orbit Phase)
    // 3.5-4.5s: Sequential stacked return (Return Phase)
    // 4.5-10s: Rest Phase

    const orbitVariants = {
            initial: ({ layer }: { i: number; layer: "front" | "back" }) => ({
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: layer === "front" ? 0 : 1,
            visibility:
                layer === "front" ? ("hidden" as const) : ("visible" as const),
        }),
        animate: ({ i, layer }: { i: number; layer: "front" | "back" }) => {
            const times: number[] = [];
            const x: number[] = [];
            const y: number[] = [];
            const rotate: number[] = [];
            const scale: number[] = [];
            
            const opacity: number[] = [];
            const visibility: any[] = [];
            const easings: any[] = [];

            // 1. Calculate the full rendered width of the entire wordmark (viewBox width)
            const wordmarkWidth = 532;
            const wordmarkCenterX = wordmarkWidth / 2; // 266

            // Base center coordinate of the initial card stack
            const cardBaseX = 176;

            // Orbit parameters
            // cx centers the orbit exactly on the wordmark horizontally
            const cx = wordmarkCenterX - cardBaseX; // 90
            const cy = -5; // Subtle tilt offset for realistic 3D feel

            // Dynamically compute orbit radius to span wider than the entire wordmark.
            // 55px clearance ensures cards fully pass the extreme left/right bounds 
            // BEFORE cleanly swapping z-index, preventing ugly mid-letter clipping.
            const rx = (wordmarkWidth / 2) + 55; // 321
            const ry = 55; // Wider vertical breadth to accentuate depth

            const startAngle = -i * ((2 * Math.PI) / 5) - Math.PI / 2;
            const orbitSpeed = (2 * Math.PI) / 2.7; // Professional, smoother pacing
            const depthScaleFactor = 0.25; // Scales cards up/down as they orbit

            // Tier-1 UI Easings
            const spreadEase = [0.34, 1.56, 0.64, 1]; // Organic 'spring' & overshoot
            const returnEase = [0.6, 0.05, 0.15, 0.95]; // Swift, intentional snap-back

            // 1. Start (0s)
            times.push(0);
            x.push(0);
            y.push(0);
            rotate.push(0);
            scale.push(1);
            
            opacity.push(layer === "front" ? 0 : 1);
            visibility.push(layer === "front" ? "hidden" : "visible");

            // 2. Spread Phase (0s -> 0.8s) t=0.08
            times.push(0.08);
            x.push(cx + rx * Math.cos(startAngle));
            y.push(cy + ry * Math.sin(startAngle));
            rotate.push(12 * Math.sin(startAngle)); // subtle tilt

            const startPhase = Math.sin(startAngle);
            const isFrontSpread = startPhase >= 0;
            const layerScaleSpread = 1 + startPhase * depthScaleFactor;
            const layerOpacitySpread = 0.6 + ((startPhase + 1) / 2) * 0.4;

            scale.push(layerScaleSpread);

            if (layer === "front") {
                opacity.push(isFrontSpread ? layerOpacitySpread : 0);
                visibility.push(isFrontSpread ? "visible" : "hidden");
            } else {
                opacity.push(isFrontSpread ? 0 : layerOpacitySpread);
                visibility.push(isFrontSpread ? "hidden" : "visible");
            }
            easings.push(spreadEase);

            // 3. Orbit Phase (0.8s -> t_return_start)
            const t_return_start = 3.5 + i * 0.15;
            const t_return_end = t_return_start + 0.6;

            const orbitDuration = t_return_start - 0.8;
            const stepsPerSecond = 30; // higher frequency for smooth layering
            const orbitSteps = Math.ceil(orbitDuration * stepsPerSecond);

            for (let step = 1; step <= orbitSteps; step++) {
                const t = 0.8 + (step / orbitSteps) * orbitDuration;
                times.push(t / 10);

                const currentAngle = startAngle + (t - 0.8) * orbitSpeed;
                const phase = Math.sin(currentAngle);
                const isFrontPhase = phase > 0; // Toggles exactly at horizontal midpoint edges

                x.push(cx + rx * Math.cos(currentAngle));
                y.push(cy + ry * Math.sin(currentAngle));
                rotate.push(12 * Math.sin(currentAngle));

                // Continuous 3D scaling
                scale.push(1 + phase * depthScaleFactor);

                // Continuous Opacity transition
                const baseOpacity = 0.6 + ((phase + 1) / 2) * 0.4;
                if (layer === "front") {
                    opacity.push(isFrontPhase ? baseOpacity : 0);
                    visibility.push(isFrontPhase ? "visible" : "hidden");
                } else {
                    opacity.push(isFrontPhase ? 0 : baseOpacity);
                    visibility.push(isFrontPhase ? "hidden" : "visible");
                }

                easings.push("linear");
            }

            // 4. Return Phase (t_return_start -> t_return_end)
            times.push(t_return_end / 10);
            x.push(0);
            y.push(0);
            rotate.push(0);
            scale.push(1);
            opacity.push(layer === "front" ? 0 : 1);
            visibility.push(layer === "front" ? "hidden" : "visible");
            easings.push(returnEase);

            // 5. Rest Phase (t_return_end -> 10s)
            times.push(1);
            x.push(0);
            y.push(0);
            rotate.push(0);
            scale.push(1);
            opacity.push(layer === "front" ? 0 : 1);
            visibility.push(layer === "front" ? "hidden" : "visible");
            easings.push("linear");

            return {
                x,
                y,
                rotate,
                scale,
                
                opacity,
                visibility,
                transition: {
                    duration: 10,
                    times,
                    ease: easings,
                    repeat: Infinity,
                    repeatDelay: 0,
                },
            };
        },
    };

    // Mobile Performance Helper: forces hardware acceleration using willChange
    const originStyle = {
        transformOrigin: "176px 121px",
        willChange: "transform, opacity",
    };

    // Function to render card layers safely across standard SVG rendering context
    const renderCards = (layer: "front" | "back") => (
        <g>
            {/* Card 1: Bottom Left Base */}
            <motion.g
                custom={{ i: 0, layer }}
                variants={orbitVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.1 }}
                style={originStyle}
            >
                <rect
                    x="149"
                    y="84"
                    width="54"
                    height="74"
                    rx="8"
                    fill="url(#fl-purple)"
                    filter="url(#fl-shadow)"
                />
            </motion.g>

            {/* Card 2: Bottom Right Base */}
            <motion.g
                custom={{ i: 1, layer }}
                variants={orbitVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.1 }}
                style={originStyle}
            >
                <rect
                    x="149"
                    y="84"
                    width="54"
                    height="74"
                    rx="8"
                    fill="url(#fl-yellow)"
                    filter="url(#fl-shadow)"
                />
            </motion.g>

            {/* Card 3: Middle Base */}
            <motion.g
                custom={{ i: 2, layer }}
                variants={orbitVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.1 }}
                style={originStyle}
            >
                <rect
                    x="149"
                    y="84"
                    width="54"
                    height="74"
                    rx="8"
                    fill="url(#fl-green)"
                    filter="url(#fl-shadow)"
                />
            </motion.g>

            {/* Card 4: Small Top Left */}
            <motion.g
                custom={{ i: 3, layer }}
                variants={orbitVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.1 }}
                style={originStyle}
            >
                {/* Note: Original was x=162, y=107. Offset applied to keep it grouped with stack logic if needed, 
              but keeping original inner coords ensures it scales correctly. */}
                <rect
                    x="162"
                    y="107"
                    width="28"
                    height="28"
                    rx="6"
                    fill="url(#fl-blue)"
                    filter="url(#fl-shadow)"
                />
            </motion.g>

            {/* Card 5: Top Right (With Brain) - The "Caboose" of the train */}
            <motion.g
                custom={{ i: 4, layer }}
                variants={orbitVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.1 }}
                style={originStyle}
            >
                <rect
                    x="159"
                    y="104"
                    width="34"
                    height="34"
                    rx="8"
                    fill={accentRed}
                    opacity="0.3"
                    filter="url(#fl-glass)"
                />
                <rect
                    x="159"
                    y="104"
                    width="34"
                    height="34"
                    rx="8"
                    fill="url(#fl-red)"
                    filter="url(#fl-shadow)"
                />

                {/* Brain / Mascot Path */}
                <g>
                    <path
                        d="M188.866 120.889C188.866 118.834 188.149 116.128 186.501 113.968C184.897 111.866 182.386 110.239 178.611 110.239C175.978 110.239 174.103 110.847 172.813 111.876C171.542 112.89 170.65 114.462 170.254 116.797C170.168 117.299 169.859 117.73 169.420 117.961C168.145 118.631 167.120 119.185 166.341 119.628C166.596 119.847 166.853 120.114 167.063 120.437C167.531 121.157 167.720 122.097 167.337 123.1C167.137 123.626 166.848 124.232 166.597 124.773C166.331 125.347 166.082 125.9 165.890 126.431C165.695 126.971 165.592 127.402 165.573 127.729C165.555 128.041 165.617 128.145 165.637 128.174C165.672 128.224 165.755 128.318 166.054 128.420C166.383 128.532 166.804 128.598 167.421 128.682C168.497 128.828 170.263 129.004 171.662 130.152L171.738 130.215C173.342 131.563 174.454 133.512 175.164 135.905C175.418 136.760 174.953 137.666 174.125 137.928C173.298 138.191 172.421 137.710 172.168 136.855C171.582 134.881 170.750 133.559 169.760 132.728L169.713 132.688C169.121 132.203 168.309 132.069 167.013 131.893C166.443 131.816 165.729 131.719 165.074 131.496C164.389 131.263 163.639 130.853 163.089 130.061L163.089 130.061C162.525 129.247 162.397 128.332 162.444 127.532C162.491 126.747 162.710 125.973 162.953 125.299C163.199 124.617 163.504 123.948 163.771 123.373C164.003 122.871 164.195 122.465 164.338 122.120C164.259 122.053 164.156 121.978 164.024 121.893C163.885 121.803 163.737 121.717 163.570 121.621C163.421 121.536 163.223 121.423 163.054 121.313C162.923 121.229 162.612 121.025 162.374 120.707C162.242 120.530 162.046 120.207 162.007 119.755C161.964 119.253 162.133 118.821 162.366 118.514L162.366 118.514C162.611 118.190 162.981 117.931 163.201 117.780C163.490 117.583 163.861 117.353 164.301 117.096C165.053 116.654 166.064 116.098 167.324 115.430C167.896 112.869 169.058 110.779 170.897 109.312C172.907 107.709 175.537 107 178.611 107C183.396 107 186.796 109.123 188.963 111.963C191.086 114.745 192 118.174 192 120.889C192 126.067 188.126 131.373 182.568 133.134C182.872 133.665 183.395 134.380 184.195 135.292C184.777 135.955 184.729 136.979 184.088 137.580C183.446 138.181 182.455 138.131 181.874 137.468C180.865 136.318 180.083 135.261 179.625 134.319C179.216 133.480 178.792 132.153 179.566 130.989L179.588 130.956C179.822 130.622 180.171 130.392 180.565 130.315C185.510 129.341 188.866 124.821 188.866 120.889Z"
                        fill="#1A1C20"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M174.245 115.802C173.821 117.538 173.947 118.757 174.624 119.459C175.301 120.161 176.455 120.620 178.086 120.836C177.716 123.076 178.168 124.126 179.440 123.988C180.712 123.850 181.477 123.292 181.733 122.316C183.722 122.905 184.799 122.412 184.966 120.836C185.217 118.473 184.008 116.588 183.513 116.588C183.017 116.588 181.733 116.524 181.733 115.802C181.733 115.079 180.234 114.671 178.880 114.671C177.527 114.671 178.341 113.709 176.483 114.089C175.244 114.342 174.498 114.913 174.245 115.802Z"
                        fill="url(#fl-gold)"
                    />
                    <path
                        d="M175.638 113.107C176.177 113.006 176.668 112.964 177.113 113.036C177.643 113.123 177.989 113.351 178.231 113.567C178.259 113.592 178.283 113.613 178.302 113.631C178.319 113.631 178.339 113.632 178.361 113.632C179.163 113.632 180.047 113.740 180.778 113.976C181.137 114.092 181.543 114.266 181.884 114.536C182.122 114.725 182.388 115.012 182.531 115.398C182.596 115.407 182.667 115.416 182.744 115.422C182.890 115.434 183.028 115.437 183.131 115.437C183.571 115.437 183.910 115.616 184.094 115.734C184.300 115.867 184.475 116.029 184.619 116.186C184.907 116.501 185.170 116.906 185.384 117.357C185.814 118.263 186.116 119.498 185.957 120.873C185.835 121.926 185.319 122.906 184.199 123.375C183.530 123.655 182.779 123.690 182.015 123.588C181.810 123.846 181.562 124.074 181.271 124.268C180.636 124.692 179.873 124.903 179.075 124.982C178.574 125.032 178.026 124.988 177.513 124.739C176.981 124.482 176.612 124.064 176.388 123.586C176.140 123.058 176.060 122.442 176.080 121.792C174.852 121.520 173.798 121.070 173.042 120.352L173.042 120.353C171.801 119.175 171.832 117.393 172.294 115.665C172.298 115.649 172.303 115.633 172.308 115.617C172.769 114.132 174.114 113.393 175.638 113.107ZM176.545 115.585C176.463 115.591 176.335 115.606 176.148 115.641H176.148C175.155 115.827 174.943 116.147 174.877 116.339C174.489 117.811 174.748 118.335 174.903 118.497L174.918 118.512L174.918 118.512C175.301 118.876 176.132 119.258 177.711 119.449C178.074 119.493 178.402 119.679 178.620 119.962C178.837 120.246 178.925 120.603 178.862 120.951C178.777 121.424 178.747 121.791 178.754 122.068C178.759 122.229 178.775 122.341 178.792 122.415C178.795 122.415 178.798 122.415 178.800 122.414C179.311 122.364 179.598 122.246 179.749 122.145C179.876 122.061 179.958 121.958 180.009 121.778C180.104 121.448 180.332 121.167 180.642 120.999C180.952 120.830 181.318 120.788 181.661 120.881C182.590 121.132 183.007 121.060 183.134 121.007C183.168 120.993 183.178 120.983 183.193 120.960C183.217 120.923 183.271 120.818 183.298 120.586V120.586C183.396 119.735 183.206 118.969 182.950 118.431C182.863 118.247 182.776 118.106 182.704 118.007C182.409 117.990 182.039 117.951 181.683 117.861C181.404 117.790 181.019 117.661 180.680 117.400C180.399 117.184 180.141 116.867 180.025 116.457C179.997 116.447 179.964 116.435 179.927 116.423C179.537 116.297 178.953 116.213 178.361 116.213C177.863 116.213 177.410 116.131 177.004 115.913C176.809 115.808 176.665 115.692 176.565 115.603C176.558 115.597 176.552 115.591 176.545 115.585Z"
                        fill="#1A1C20"
                    />
                    <path
                        d="M180.845 123.19C181.507 122.823 182.377 123.005 182.788 123.596C183.199 124.187 182.995 124.964 182.333 125.331C182.020 125.505 181.642 125.740 181.303 125.984C180.944 126.243 180.713 126.452 180.619 126.570L180.619 126.570C180.348 126.908 180.090 127.212 179.864 127.479C179.632 127.752 179.441 127.978 179.277 128.187C178.936 128.620 178.827 128.843 178.795 128.985C178.643 129.668 177.900 130.111 177.136 129.976C176.372 129.840 175.875 129.176 176.027 128.494C176.180 127.810 176.583 127.227 176.967 126.738C177.166 126.485 177.391 126.221 177.614 125.957C177.842 125.688 178.078 125.409 178.325 125.102L178.325 125.102C178.646 124.703 179.115 124.323 179.530 124.023C179.967 123.708 180.440 123.414 180.845 123.19Z"
                        fill="#1A1C20"
                    />
                </g>
            </motion.g>
        </g>
    );

    return (
        <svg
            className="overflow-visible"
            height={height}
            viewBox="0 0 532 164"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="fl-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#93C5FD" : "#60A5FA"} />
                    <stop offset="100%" stopColor={isDark ? "#3B82F6" : "#2563EB"} />
                </linearGradient>

                <linearGradient id="fl-red" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#FCA5A5" : "#F87171"} />
                    <stop offset="100%" stopColor={isDark ? "#EF4444" : "#DC2626"} />
                </linearGradient>

                <linearGradient id="fl-green" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#86EFAC" : "#4ADE80"} />
                    <stop offset="100%" stopColor={isDark ? "#22C55E" : "#16A34A"} />
                </linearGradient>

                <linearGradient id="fl-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#FDE047" : "#FACC15"} />
                    <stop offset="100%" stopColor={isDark ? "#EAB308" : "#CA8A04"} />
                </linearGradient>

                <linearGradient id="fl-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#D8B4FE" : "#C084FC"} />
                    <stop offset="100%" stopColor={isDark ? "#A855F7" : "#9333EA"} />
                </linearGradient>

                <linearGradient id="fl-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#D1D5DB" : "#374151"} />
                    <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#111827"} />
                </linearGradient>

                <linearGradient id="fl-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                <filter id="fl-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="0" dy="3" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="fl-glass" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Base Letter "O" path - Reused */}
                <path
                    id="fl-letterO"
                    d="M175.938 79.3942C182.008 79.3942 187.648 80.4501 192.852 82.567C198.05 84.6812 202.592 87.6347 206.472 91.4274C210.353 95.2198 213.352 99.6739 215.468 104.785C217.674 109.904 218.775 115.461 218.775 121.447C218.775 134.694 215.132 145.07 207.785 152.505L207.783 152.508C200.434 159.857 190.1 163.5 176.853 163.5C169.831 163.5 163.662 162.359 158.36 160.061L158.358 160.06C153.157 157.768 148.825 154.633 145.376 150.653L145.372 150.648V150.647C141.931 146.589 139.374 141.958 137.699 136.758C136.027 131.567 135.192 126.114 135.192 120.402C135.192 114.593 136.205 109.214 138.235 104.27L138.237 104.266C140.351 99.2462 143.216 94.8804 146.834 91.1744L146.838 91.1705C150.544 87.4642 154.868 84.5962 159.806 82.568C164.75 80.4504 170.129 79.3942 175.938 79.3942ZM176.461 101.563C172.984 101.563 169.812 102.494 166.932 104.357L166.924 104.363C164.035 106.147 161.696 108.569 159.906 111.637C158.211 114.605 157.361 117.914 157.361 121.578C157.361 124.819 158 127.976 159.281 131.052C160.634 134.093 162.745 136.586 165.626 138.537C168.485 140.387 172.173 141.332 176.722 141.332C182.987 141.332 187.671 139.575 190.86 136.134L190.864 136.13C194.145 132.68 195.823 127.682 195.823 121.055C195.823 115.154 194.031 110.454 190.481 106.904C186.93 103.353 182.273 101.563 176.461 101.563Z"
                />
            </defs>

            {/* Sparks & Details */}
            <motion.g
                filter="url(#fl-shadow)"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
            >
                <path
                    d="M495 65 C495 65, 502 66.5, 502 73.5 C502 66.5, 509 65, 509 65 C509 65, 502 63.5, 502 56.5 C502 63.5, 495 65, 495 65 Z"
                    fill="url(#fl-gold)"
                />
                <path
                    d="M480 80 C480 80, 484 81, 484 85 C484 81, 488 80, 488 80 C488 80, 484 79, 484 75 C484 79, 480 80, 480 80 Z"
                    fill="url(#fl-blue)"
                />
                <path
                    d="M85 35 C85 35, 90 36, 90 41 C90 36, 95 35, 95 35 C95 35, 90 34, 90 29 C90 34, 85 35, 85 35 Z"
                    fill="url(#fl-gold)"
                />
                <rect
                    x="250"
                    y="166"
                    width="60"
                    height="3"
                    rx="1.5"
                    fill="url(#fl-blue)"
                />
                <rect
                    x="315"
                    y="166"
                    width="15"
                    height="3"
                    rx="1.5"
                    fill="url(#fl-gold)"
                />
            </motion.g>

            {/* Floating Particles - Added subtle continuous pulse for rest phases */}
            <motion.g
                initial={{ opacity: 0.5, y: 0 }}
                animate={{ y: [0, -3, 0], opacity: [0.5, 0.9, 0.5] }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
            >
                <line
                    x1="124"
                    y1="13.5"
                    x2="144"
                    y2="13.5"
                    stroke={accentBlue}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                    vectorEffect="non-scaling-stroke"
                />
                <line
                    x1="134"
                    y1="24.5"
                    x2="150"
                    y2="24.5"
                    stroke={accentBlue}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.8"
                    vectorEffect="non-scaling-stroke"
                />
            </motion.g>

            {/* THE 5 ANIMATED CARDS (Back Layer) */}
            {renderCards("back")}

            {/* The Letter "f" */}
            <motion.g
                filter="url(#fl-shadow)"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }}
            >
                <path
                    d="M22.7365 161.693C22.6494 156.815 22.6058 151.85 22.6058 146.797C22.6058 141.657 22.6058 136.692 22.6058 131.901V100.932C18.9471 101.193 15.419 101.585 12.0216 102.108C8.7113 102.631 5.61879 103.284 2.74406 104.068L0 83.1609C3.13607 82.464 6.7077 81.8542 10.7149 81.3315C14.8092 80.8089 19.0342 80.4168 23.3898 80.1555C23.9125 75.3643 24.7837 70.7037 26.0032 66.1739C27.3099 61.644 29.1393 57.5932 31.4914 54.0216C33.8434 50.3629 36.9359 47.4446 40.7689 45.2667C44.6019 43.0889 49.3495 42 55.0119 42C62.2423 42 69.2113 43.4809 75.919 46.4428L71.4762 67.2192C65.7268 64.6058 60.9791 63.2991 57.2333 63.2991C53.2261 63.2991 50.4384 64.7365 48.8704 67.6112C47.3024 70.3988 46.3006 74.3625 45.865 79.5022C50.5691 79.5893 55.0119 79.8071 59.1933 80.1555C63.4618 80.4168 67.1642 80.7653 70.3002 81.2009L68.2095 101.716C65.1606 101.193 61.5889 100.801 57.4946 100.54C53.4874 100.191 49.2624 100.017 44.8197 100.017C44.6454 104.46 44.5148 108.816 44.4277 113.084C44.3405 117.266 44.297 121.447 44.297 125.629C44.297 131.204 44.3405 136.953 44.4277 142.877C44.6019 148.713 44.7761 154.986 44.9503 161.693H22.7365Z"
                    fill="url(#fl-blue)"
                />
            </motion.g>

            {/* Main "O" Layering (Drawn in front to hide the stacked cards by default) */}
            <g id="fl-oStack">
                <use href="#fl-letterO" filter="url(#fl-shadow)" fill="url(#fl-dark)" />
            </g>

            {/* The Rest of the Wordmark (l, t, t, e, r) */}
            <motion.g
                fill="url(#fl-dark)"
                filter="url(#fl-shadow)"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
            >
                <path d="M471.341 162.477C471.69 155.247 471.951 148.017 472.125 140.786C472.3 133.556 472.387 126.413 472.387 119.356C472.3 112.91 472.169 106.551 471.995 100.279C471.908 93.9194 471.69 87.7779 471.341 81.8542L493.294 81.2009C493.381 84.4241 493.512 87.7343 493.686 91.1318C496.474 87.6472 499.697 84.8596 503.355 82.7689C507.101 80.5911 511.37 79.5022 516.161 79.5022C517.99 79.5022 520.342 79.7635 523.217 80.2862C526.092 80.8089 529.01 81.8107 531.972 83.2916L529.489 105.375C527.312 104.068 524.959 103.153 522.433 102.631C519.994 102.021 517.947 101.716 516.292 101.716C510.716 101.716 505.969 104.242 502.049 109.295C498.216 114.26 495.602 121.186 494.209 130.071C494.209 136.169 494.121 142.006 493.947 147.581C493.86 153.069 493.642 158.035 493.294 162.477H471.341Z" />
                <path d="M421.363 162.739C413.001 162.739 405.639 161.084 399.28 157.773C393.008 154.55 388.086 150.02 384.515 144.184C381.03 138.347 379.288 131.596 379.288 123.93C379.288 119.313 380.072 114.478 381.64 109.425C383.208 104.286 385.734 99.4946 389.219 95.0518C392.703 90.6091 397.277 86.9939 402.939 84.2063C408.688 81.4186 415.657 80.0248 423.846 80.0248C429.77 80.0248 434.735 80.6782 438.742 81.9849C442.837 83.2916 446.147 84.9903 448.673 87.081C451.287 89.1717 453.247 91.3931 454.553 93.7451C455.947 96.0972 456.862 98.3621 457.297 100.54C457.82 102.631 458.081 104.373 458.081 105.767C458.081 114.217 454.51 120.75 447.367 125.367C440.31 129.897 430.292 132.162 417.313 132.162C414.351 132.162 411.52 132.031 408.819 131.77C406.206 131.509 403.767 131.204 401.502 130.855C403.157 135.211 405.901 138.434 409.734 140.525C413.567 142.528 417.53 143.53 421.625 143.53C427.548 143.53 432.775 142.485 437.305 140.394C441.835 138.216 446.103 134.906 450.111 130.463L461.74 147.189C458.953 149.454 455.817 151.806 452.332 154.245C448.935 156.684 444.753 158.688 439.788 160.256C434.822 161.911 428.681 162.739 421.363 162.739ZM424.238 99.6253C419.098 99.6253 414.569 100.932 410.648 103.545C406.728 106.159 403.854 109.6 402.024 113.868C404.202 114.217 406.336 114.522 408.427 114.783C410.605 114.957 412.739 115.044 414.83 115.044C416.746 115.044 418.924 114.87 421.363 114.522C423.89 114.173 426.329 113.65 428.681 112.954C431.12 112.257 433.124 111.386 434.692 110.34C436.26 109.208 437.044 107.901 437.044 106.42C437.044 105.723 436.695 104.852 435.998 103.807C435.301 102.761 434.038 101.803 432.209 100.932C430.38 100.061 427.723 99.6253 424.238 99.6253Z" />
                <path d="M344.41 162.608C339.183 162.608 335.046 161.476 331.997 159.211C328.948 157.033 326.726 153.984 325.332 150.064C323.939 146.144 323.024 141.657 322.588 136.605C322.24 131.552 322.066 126.238 322.066 120.663C322.066 114.914 322.284 108.946 322.719 102.761C316.883 103.545 311.264 104.547 305.863 105.767L301.812 85.2516C309.042 83.3351 316.752 81.9413 324.94 81.0702C325.55 76.6274 326.204 71.9669 326.901 67.0886C327.597 62.1231 328.381 56.8963 329.253 51.4082L351.728 53.3682C350.682 57.8981 349.768 62.428 348.984 66.9579C348.2 71.4006 347.503 75.7127 346.893 79.8942C351.771 79.8942 356.345 80.0248 360.613 80.2862C364.969 80.4604 368.976 80.8089 372.635 81.3315L370.021 101.847C366.973 101.498 363.793 101.28 360.483 101.193C357.259 101.019 353.993 100.932 350.682 100.932C348.679 100.932 346.675 100.976 344.672 101.063C344.149 107.422 343.8 112.866 343.626 117.396C343.539 121.926 343.496 125.149 343.496 127.066C343.496 131.857 343.757 135.298 344.28 137.389C344.889 139.479 345.848 140.525 347.154 140.525C348.635 140.525 350.29 140.046 352.12 139.087C353.949 138.042 355.735 136.648 357.477 134.906C359.307 133.164 360.831 131.291 362.051 129.287L372.112 150.325C363.488 158.514 354.254 162.608 344.41 162.608Z" />
                <path d="M267.718 162.608C262.492 162.608 258.354 161.476 255.305 159.211C252.256 157.033 250.034 153.984 248.641 150.064C247.247 146.144 246.332 141.657 245.897 136.605C245.548 131.552 245.374 126.238 245.374 120.663C245.374 114.914 245.592 108.946 246.027 102.761C240.191 103.545 234.572 104.547 229.171 105.767L225.12 85.2516C232.351 83.3351 240.06 81.9413 248.249 81.0702C248.858 76.6274 249.512 71.9669 250.209 67.0886C250.906 62.1231 251.69 56.8963 252.561 51.4082L275.036 53.3682C273.991 57.8981 273.076 62.428 272.292 66.9579C271.508 71.4006 270.811 75.7127 270.201 79.8942C275.079 79.8942 279.653 80.0248 283.921 80.2862C288.277 80.4604 292.284 80.8089 295.943 81.3315L293.33 101.847C290.281 101.498 287.101 101.28 283.791 101.193C280.568 101.019 277.301 100.932 273.991 100.932C271.987 100.932 269.983 100.976 267.98 101.063C267.457 107.422 267.109 112.866 266.934 117.396C266.847 121.926 266.804 125.149 266.804 127.066C266.804 131.857 267.065 135.298 267.588 137.389C268.198 139.479 269.156 140.525 270.462 140.525C271.943 140.525 273.599 140.046 275.428 139.087C277.257 138.042 279.043 136.648 280.785 134.906C282.615 133.164 284.139 131.291 285.359 129.287L295.42 150.325C286.796 158.514 277.562 162.608 267.718 162.608Z" />
                <path d="M103.167 162.608C98.3755 162.608 94.4118 161.563 91.2758 159.472C88.2268 157.468 85.7876 154.681 83.9583 151.109C82.216 147.537 80.9093 143.443 80.0382 138.826C79.2542 134.209 78.7315 129.287 78.4701 124.06C78.2959 118.747 78.2088 113.433 78.2088 108.119C78.2088 103.502 78.3395 98.4492 78.6008 92.9611C78.8621 87.3859 79.167 81.7671 79.5155 76.1048C79.9511 70.3553 80.3866 64.9543 80.8222 59.9017C81.3449 54.8492 81.824 50.45 82.2596 46.7041L105.911 46.9654C105.214 51.4082 104.56 56.4608 103.951 62.1231C103.341 67.6983 102.818 73.3607 102.383 79.1102C102.034 84.8596 101.729 90.1735 101.468 95.0518C101.294 99.9302 101.207 103.807 101.207 106.681C101.207 114.609 101.337 120.837 101.599 125.367C101.947 129.897 102.426 133.12 103.036 135.037C103.733 136.866 104.648 137.781 105.78 137.781C107.261 137.781 108.873 136.866 110.615 135.037C112.357 133.12 114.056 130.986 115.711 128.634L126.818 150.717C124.117 153.679 120.894 156.379 117.148 158.819C113.402 161.345 108.742 162.608 103.167 162.608Z" />
            </motion.g>

            {/* THE 5 ANIMATED CARDS (Front Layer) - Rendered last so it appears IN FRONT of all letters! */}
            {renderCards("front")}
        </svg>
    );
}
