'use client';

import React from 'react';

interface PalmLeafSVGProps {
  className?: string;
}

export default function PalmLeafSVG({ className }: PalmLeafSVGProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Palm branch stem */}
        <path
          d="M20 180 Q 95 95 180 20"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Left-side leaflets */}
        <path d="M50 150 Q 25 105 5 95 Q 35 115 65 130" fill="currentColor" />
        <path d="M70 130 Q 45 80 25 65 Q 55 95 85 110" fill="currentColor" />
        <path d="M90 110 Q 65 55 45 40 Q 75 75 105 90" fill="currentColor" />
        <path d="M110 90 Q 90 35 75 15 Q 100 55 125 70" fill="currentColor" />
        <path d="M130 70 Q 115 25 105 5 Q 125 40 145 50" fill="currentColor" />
        
        {/* Right-side leaflets */}
        <path d="M45 155 Q 75 165 95 175 Q 70 148 55 138" fill="currentColor" />
        <path d="M65 135 Q 95 145 115 155 Q 90 128 75 118" fill="currentColor" />
        <path d="M85 115 Q 115 125 135 135 Q 110 108 95 98" fill="currentColor" />
        <path d="M105 95 Q 135 105 155 115 Q 130 88 115 78" fill="currentColor" />
        <path d="M125 75 Q 155 80 175 85 Q 145 68 135 58" fill="currentColor" />
      </g>
    </svg>
  );
}
