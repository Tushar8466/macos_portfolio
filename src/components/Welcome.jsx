import React from 'react'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'


const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 }
}


const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}


const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll('span');
    const { min, max } = FONT_WEIGHTS[type];

    const weights = Array.from(letters).map(() => ({ value: min }));

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter, i) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const letterCenter = (l - left) + w / 2;
            const distance = Math.abs(mouseX - letterCenter);
            const intensity = Math.exp(-(distance ** 2) / 2000);
            const targetWeight = min + (max - min) * intensity;

            gsap.to(weights[i], {
                value: targetWeight,
                duration: 0.25,
                ease: 'power2.out',
                onUpdate() {
                    letter.style.fontVariationSettings = `'wght' ${Math.round(weights[i].value)}`;
                }
            });
        });
    };

    const handleMouseLeave = () => {
        letters.forEach((letter, i) => {
            gsap.to(weights[i], {
                value: min,
                duration: 0.4,
                ease: 'power2.out',
                onUpdate() {
                    letter.style.fontVariationSettings = `'wght' ${Math.round(weights[i].value)}`;
                }
            });
        });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
};


const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        setupTextHover(subtitleRef.current, 'subtitle');
        setupTextHover(titleRef.current, 'title');
    }, []);

    return (
        <section id='welcome'>
            <p ref={subtitleRef}>{renderText("Hey, I'm Tushar! Welcome to my", 'text-3xl font-georama', 100)}</p>
            <h1 ref={titleRef} className='mt-7'>{renderText("portfolio", 'text-9xl italic font-georama', 400)}</h1>

            <div className='small-screen'>
                <p>This Portfolio is designed for desktop/tablet screens only.</p>
            </div>
        </section>
    )
}

export default Welcome