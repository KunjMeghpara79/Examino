'use client';
import { useEffect, useRef, useCallback } from 'react';

const InteractiveDots = ({
  children,
  backgroundColor = '#000000',
  dotColor = '#d9ff00',
  gridSpacing = 30,
  animationSpeed = 0.005,
}) => {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const dotsRef = useRef([]);

  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dots = [];

    for (let x = 0; x < w; x += gridSpacing) {
      for (let y = 0; y < h; y += gridSpacing) {
        dots.push({
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    dotsRef.current = dots;
  }, [gridSpacing]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    initializeDots();
  }, [initializeDots]);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += animationSpeed;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const maxDistance = 220;
    const minOpacity = 0.05;
    const maxOpacity = 0.9;

    const r = parseInt(dotColor.slice(1, 3), 16);
    const g = parseInt(dotColor.slice(3, 5), 16);
    const b = parseInt(dotColor.slice(5, 7), 16);

    dotsRef.current.forEach((dot) => {
      const dx = dot.originalX - mouseRef.current.x;
      const dy = dot.originalY - mouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Smooth influence (0 to 1)
      let influence = 1 - Math.min(distance / maxDistance, 1);

      // Smooth falloff curve (so fading looks natural)
      influence = influence * influence;

      const opacity = minOpacity + influence * (maxOpacity - minOpacity);

      const baseDotSize = 1.8;
      const dotSize =
        baseDotSize +
        influence * 2.5 +
        Math.sin(timeRef.current + dot.phase) * 0.2;

      ctx.beginPath();
      ctx.arc(dot.originalX, dot.originalY, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [backgroundColor, dotColor, animationSpeed]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [animate, resizeCanvas, handleMouseMove]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default InteractiveDots;
