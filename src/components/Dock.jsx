import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { dockApps } from '#constants';
import gsap from 'gsap';

function Dock() {
    const dockRef = useRef(null);

    const toggleApp = ({ id, canOpen }) => {
        console.log(`Toggling app: ${id}, canOpen: ${canOpen}`);
    };

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');
        
        // This determines how far the "wave" spreads. 
        // 150px means icons within 150px of the cursor will scale.
        const maxDistance = 150; 

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;

            icons.forEach((icon) => {
                const rect = icon.getBoundingClientRect();
                const iconCenter = rect.left + rect.width / 2;
                
                // Calculate how far the mouse is from the center of THIS specific icon
                const distance = Math.abs(mouseX - iconCenter);

                // Calculate intensity (0 to 1)
                // 1 = exact center, drops to 0 as distance reaches maxDistance
                let intensity = Math.max(0, 1 - distance / maxDistance);
                
                // Optional: square the intensity for a smoother, more "fluid" drop-off curve
                intensity = Math.pow(intensity, 1.5);

                gsap.to(icon, {
                    scale: 1 + (0.5 * intensity), // Max scale of 1.5x
                    y: -20 * intensity,           // Max jump of -20px
                    transformOrigin: "bottom center", // Keeps the bottom anchored!
                    duration: 0.1,
                    ease: "power1.out",
                    overwrite: "auto" // Crucial for smooth rapid firing on mousemove
                });
            });
        };

        const handleMouseLeave = () => {
            // Reset all icons back to normal when mouse leaves the dock
            gsap.to(icons, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        // Attach listeners
        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup listeners on unmount
        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', handleMouseLeave);
        };
    });

    return (
        <section id='dock'>
            <div className='dock-container' ref={dockRef}>
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className='relative flex justify-center items-center'>
                        <button
                            type='button'
                            className='dock-icon'
                            aria-label={name}
                            data-tooltip-id="dock-desktop"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading='lazy'
                                className={canOpen ? "" : "opacity-60"}
                            />
                        </button>
                    </div>
                ))}
                <Tooltip id='dock-desktop' place='top' className='tooltip' />
            </div>
        </section>
    );
}

export default Dock;