import React, { useState, useRef, useEffect } from 'react';

const GlassPanel = ({ children }) => {
  // const [style, setStyle] = useState({});
  // const cardRef = useRef(null);

  // useEffect(() => {
  //   const card = cardRef.current;
  //   if (!card) return;

  //   const handleMouseMove = (e) => {
  //     const { width, height, left, top } = card.getBoundingClientRect();
  //     const x = e.clientX - left;
  //     const y = e.clientY - top;

  //     const rotateX = ((y / height) - 0.5) * -20; // -10 to 10 degrees
  //     const rotateY = ((x / width) - 0.5) * 20; // -10 to 10 degrees

  //     setStyle({
  //       transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
  //     });
  //   };

  //   const handleMouseLeave = () => {
  //     setStyle({
  //       transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
  //     });
  //   };

  //   card.addEventListener('mousemove', handleMouseMove);
  //   card.addEventListener('mouseleave', handleMouseLeave);

  //   return () => {
  //     card.removeEventListener('mousemove', handleMouseMove);
  //     card.removeEventListener('mouseleave', handleMouseLeave);
  //   };
  // }, []);

  return (
    <div
      // ref={cardRef}
      // style={style}
      className="
        relative p-6 rounded-2xl shadow-xl
        bg-gradient-to-br from-white/20 to-white/5
        border border-t-white/40 border-l-white/40 border-b-white/20 border-r-white/20
        backdrop-blur-xs
        /* Add transition for a smooth effect */
        transition-transform duration-300 ease-out
      "
    >
      {children}
    </div>
  );
};

export default GlassPanel;