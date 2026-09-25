import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isListening, audioLevel = 0 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;
    const barCount = 32;

    const renderWave = () => {
      animRef.current = requestAnimationFrame(renderWave);
      phase += 0.08;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount - 2;
      const midY = height / 2;

      for (let i = 0; i < barCount; i++) {
        // Calculate dynamic height based on audio level and sine wave
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const falloff = 1 - distFromCenter * 0.6;
        
        let amplitude = 4; // Idle baseline
        if (isListening) {
          const wave = Math.sin(phase + i * 0.4) * 0.5 + 0.5;
          amplitude = (4 + wave * 18 + audioLevel * 30) * falloff;
        }

        const barHeight = Math.max(amplitude, 3);
        const x = i * (barWidth + 2);
        const y = midY - barHeight / 2;

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          grad.addColorStop(0, '#00ff88');
          grad.addColorStop(0.5, '#00f7ff');
          grad.addColorStop(1, '#0088ff');
        } else {
          grad.addColorStop(0, 'rgba(0, 247, 255, 0.4)');
          grad.addColorStop(1, 'rgba(0, 119, 255, 0.15)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [isListening, audioLevel]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      <canvas
        ref={canvasRef}
        width={360}
        height={40}
        className="w-full max-w-[360px] h-[40px]"
      />
    </div>
  );
}
