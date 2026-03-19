import React from 'react';
import { Navbar, Welcome, Dock } from '#components';
import useWindowStore from '#store/window';
import { locations } from '#constants';

// 🏢 Local Window Component (keeps the project structure clean)
const Window = ({ id, title, children }) => {
  const { windows, closeWindow, focusWindow } = useWindowStore();
  const win = windows[id];

  if (!win?.isOpen) return null;

  return (
    <section
      id={id}
      className="absolute shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
      style={{ zIndex: win.zIndex }}
      onMouseDown={() => focusWindow(id)}
    >
      <div id="window-header" className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none">
        <div id="window-controls" className="flex gap-2">
          <div 
            className="close size-3.5 rounded-full bg-[#ff6157] cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
          ></div>
          <div className="minimize size-3.5 rounded-full bg-[#ffc030]"></div>
          <div className="maximize size-3.5 rounded-full bg-[#2acb42]"></div>
        </div>
        <h2 className="font-bold text-sm flex-1 text-center text-gray-500 uppercase tracking-wider">{title}</h2>
      </div>

      <div className="bg-white overflow-auto max-h-[75vh]">
        {children}
      </div>
    </section>
  );
};

function App() {
  const { windows } = useWindowStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-cover bg-center">
      <Navbar />
      <Welcome />

      {/* 🖥️ Layer for all Windows */}
      <div className="absolute inset-0 pointer-events-none z-10">
        
        {/* Finder / Portfolio Window */}
        <Window id="finder" title="Portfolio">
           <div className="p-10 text-center text-gray-400 font-georama">
             <h3 className="text-xl mb-4 italic text-gray-600">Project Directory</h3>
             <p>Select a project from the sidebar to view details.</p>
           </div>
        </Window>

        {/* Safari / Articles Window */}
        <Window id="safari" title="Articles">
          <div className="p-10 text-center text-gray-400 font-georama">
            <h3 className="text-xl mb-4 italic text-gray-600">Latest Blog Posts</h3>
            <p>Read about technology and design.</p>
          </div>
        </Window>

        {/* Terminal / Skills Window */}
        <Window id="terminal" title="Skills">
          <div className="p-8 bg-black text-[#00A154] font-mono text-sm min-h-[350px]">
            <p className="mb-2">Last login: {new Date().toLocaleDateString()} on ttys001</p>
            <p>tushar@macos:~$ list-skills</p>
            <ul className="mt-4 space-y-1 ml-4 opacity-80">
              <li>• JavaScript (ES6+)</li>
              <li>• React.js & hooks</li>
              <li>• GSAP & Frame Motion</li>
              <li>• Tailwind CSS v4</li>
            </ul>
            <p className="mt-4">tushar@macos:~$ _</p>
          </div>
        </Window>

        {/* Photos / Gallery Window */}
        <Window id="photos" title="Gallery">
          <div className="p-5 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden">
                <img src={`/images/gal${i}.png`} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </Window>

        {/* Contact Window */}
        <Window id="contact" title="Get in touch">
          <div className="p-10 text-center text-gray-400">
             <p className="text-lg mb-2">tusharsingla@gmail.com</p>
             <p className="text-xs italic uppercase">Available for new opportunities</p>
          </div>
        </Window>

        {/* Resume Window */}
        <Window id="resume" title="Resume">
           <div className="p-10 flex flex-col items-center">
             <img src="/images/pdf.png" className="w-20 mb-4 opacity-50" alt="" />
             <p className="text-gray-400 italic">Click to view/download Tushar_Resume.pdf</p>
           </div>
        </Window>

      </div>

      <Dock />
    </main>
  );
}

export default App;
