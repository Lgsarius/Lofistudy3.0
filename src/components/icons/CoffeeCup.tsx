import { SVGProps } from 'react';

export function CoffeeCup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Saucer */}
      <path
        d="M15 80h70c0 0 5 0 5 5v2c0 0 0 3-5 3h-70c0 0-5 0-5-3v-2c0 0 0-5 5-5z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Cup Body */}
      <path
        d="M25 35h35c0 0 5 0 5 5v30c0 0 0 5-5 5h-35c0 0-5 0-5-5v-30c0 0 0-5 5-5z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Handle */}
      <path
        d="M65 40c8 0 12 4 12 12s-4 12-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Steam */}
      <path
        d="M35 25c0 0 3-8 10 0M50 25c0 0 3-8 10 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Coffee Surface */}
      <path
        d="M25 45h35"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="2 2"
      />
      {/* Decoration */}
      <path
        d="M30 55c0 0 5-2 12 0c7 2 13 0 13 0"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
} 