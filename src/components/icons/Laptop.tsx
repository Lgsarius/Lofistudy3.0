import { SVGProps } from 'react';

export function Laptop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Screen */}
      <path
        d="M40 20h120v80h-120z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Screen Content */}
      <path
        d="M50 30h100v60h-100z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Base */}
      <path
        d="M30 100h140l20 30h-180z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Code Lines */}
      <path
        d="M60 40h80M60 50h60M60 60h70M60 70h40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
} 