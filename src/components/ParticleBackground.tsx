'use client';

import React, { useEffect, useRef } from 'react';
import { Theme } from '@/utils/constants';

interface ParticleBackgroundProps {
  theme: Theme;
}

export default function ParticleBackground({ theme }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle object model
    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      color: string = '';
      alpha: number = 0;
      fadeSpeed: number = 0;

      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial distribution
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
        this.color = Math.random() > 0.5 ? theme.from : theme.to;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.fadeSpeed;

        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowBlur = this.size * 3;
        context.shadowColor = this.color;
        context.fill();
        context.restore();
      }
    }

    const particles: Particle[] = [];
    const maxParticles = 40;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Shifting neon ambient light gradients
      const grad1 = ctx.createRadialGradient(0, 0, 100, 0, 0, width * 0.6);
      grad1.addColorStop(0, `${theme.from}1c`); // ~11% opacity
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width, height, 100, width, height, width * 0.6);
      grad2.addColorStop(0, `${theme.to}18`); // ~9% opacity
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Update and draw floating embers
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
