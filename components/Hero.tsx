"use client";
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        gsap.from(textRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
        });

        gsap.to(textRef.current, {
            color: "#FFD600",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
            >
                {/* Placeholder video - using a free stock footage URL if available or local */}
                <source src="/videos/hero_video.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-transparent to-asphalt-black/50" />

            <h1 ref={textRef} className="relative z-10 text-8xl md:text-[12rem] font-heading font-bold text-transparent stroke-text tracking-tighter text-center leading-[0.8]">
                THE MAXIMUM <br /> CITY
            </h1>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/70">Scroll to Enter</span>
                <div className="w-[2px] h-12 bg-white/20 overflow-hidden">
                    <div className="w-full h-1/2 bg-taxi-yellow animate-scroll-down" />
                </div>
            </div>

            <style jsx>{`
        .stroke-text {
            -webkit-text-stroke: 2px white;
        }
      `}</style>
        </section>
    );
};
