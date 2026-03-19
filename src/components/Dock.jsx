import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { dockApps } from '#constants';
import gsap from 'gsap';
import useWindowStore from '#store/window';

function Dock() {
    const { openWindow, closeWindow, windows } = useWindowStore();
    const dockRef = useRef(null);

    // Dynamic app toggling logic
    const toggleApp = (app) => {
        if (!app.canOpen) return;
        
        // Use 'win' instead of 'window' to avoid global name clash
        const win = windows[app.id];
        
        if (win?.isOpen) {
            closeWindow(app.id);
        } else {
            console.log(`[Dock] Opening app: ${app.id}`);
            openWindow(app.id);
        }
    };

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');
        const maxDistance = 150; 

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            icons.forEach((icon) => {
                const rect = icon.getBoundingClientRect();
                const iconCenter = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - iconCenter);

                let intensity = Math.max(0, 1 - distance / maxDistance);
                intensity = Math.pow(intensity, 1.5);

                gsap.to(icon, {
                    scale: 1 + (0.5 * intensity),
                    y: -20 * intensity,
                    transformOrigin: "bottom center",
                    duration: 0.1,
                    ease: "power1.out",
                    overwrite: "auto"
                });
            });
        };

        const handleMouseLeave = () => {
            gsap.to(icons, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []); 

    return (
        <section id='dock'>
            <div className='dock-container' ref={dockRef}>
                {dockApps.map((app) => (
                    <div key={app.id} className='relative flex justify-center items-center'>
                        <button
                            type='button'
                            className='dock-icon'
                            aria-label={app.name}
                            data-tooltip-id="dock-desktop"
                            data-tooltip-content={app.name}
                            data-tooltip-delay-show={150}
                            disabled={!app.canOpen}
                            onClick={() => toggleApp(app)}
                        >
                            <img
                                src={`/images/${app.icon}`}
                                alt={app.name}
                                loading='lazy'
                                className={app.canOpen ? "w-full h-full object-contain" : "w-full h-full object-contain opacity-60"}
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