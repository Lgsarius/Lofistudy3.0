import { SVGProps } from 'react';

export function StudyCat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Body */}
      <path
        d="M70 90c0-20 30-20 30 0c0 20 30 20 30 0v50c0 0 0 15-30 15s-30-15-30-15v-50z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Head */}
      <circle
        cx="100"
        cy="75"
        r="25"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Ears */}
      <path
        d="M85 55l-8-8l8-4zM115 55l8-8l-8-4z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Eyes */}
      <path
        d="M90 70c0 0 0 5 0 5s0 5 5 5s5-5 5-5s0-5 0-5s-10-5-10-5"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M110 70c0 0 0 5 0 5s0 5-5 5s-5-5-5-5s0-5 0-5s10-5 10-5"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Glasses */}
      <circle
        cx="90"
        cy="70"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="110"
        cy="70"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M98 70h4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Whiskers */}
      <path
        d="M75 75h10M75 80h8M115 75h10M117 80h8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Book */}
      <path
        d="M80 95l40-5v15l-40 5z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M85 98l30-4M85 101l30-4M85 104l30-4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      {/* Tail */}
      <path
        d="M70 140c-15-5-15-15 0-15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
} 