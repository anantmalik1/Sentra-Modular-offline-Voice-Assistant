import React, { useEffect, useRef } from 'react';

export default function VoiceVisualizer({ state = 'IDLE', audioLevel = 0 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;
    const barCount = 28;

    const renderWave = () => {
      animRef.current = requestAnimationFrame(renderWave);
      phase += 0.07;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount - 2;
      const midY = height / 2;
      const isListening = state === 'LISTENING';
      const isSpeaking = state === 'SPEAKING';

      for (let i = 0; i < barCount; i++) {
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const falloff = 1 - distFromCenter * 0.55;

        let amplitude = 3;
        if (isListening) {
          const wave = Math.sin(phase + i * 0.45) * 0.5 + 0.5;
          amplitude = (4 + wave * 16 + audioLevel * 35) * falloff;
        } else if (isSpeaking) {
          const wave = Math.sin(phase * 1.4 + i * 0.5) * 0.5 + 0.5;
          amplitude = (5 + wave * 22) * falloff;
        } else if (state === 'PROCESSING' || state === 'THINKING') {
          const wave = Math.sin(phase * 2 + i * 0.3) * 0.5 + 0.5;
          amplitude = (3 + wave * 10) * falloff;
        }

        const barHeight = Math.max(amplitude, 2);
        const x = i * (barWidth + 2);
        const y = midY - barHeight / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          grad.addColorStop(0, '#00ff88');
          grad.addColorStop(1, '#00f7ff');
        } else if (isSpeaking) {
          grad.addColorStop(0, '#00f7ff');
          grad.addColorStop(1, '#0088ff');
        } else if (state === 'ERROR') {
          grad.addColorStop(0, '#ff3355');
          grad.addColorStop(1, '#880022');
        } else {
          grad.addColorStop(0, 'rgba(0, 247, 255, 0.35)');
          grad.addColorStop(1, 'rgba(0, 136, 255, 0.15)');
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
  }, [state, audioLevel]);

  return (
    <div className="flex items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        width={240}
        height={32}
        className="w-full max-w-[240px] h-[32px]"
      />
    </div>
  );
}
