'use client';

export function LofiLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M256 512c141.385 0 256-114.615 256-256S397.385 0 256 0 0 114.615 0 256s114.615 256 256 256z"
        fill="currentColor"
        fillOpacity={0.9}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 472c119.293 0 216-96.707 216-216S375.293 40 256 40 40 136.707 40 256s96.707 216 216 216zm0-48c92.784 0 168-75.216 168-168S348.784 88 256 88 88 163.216 88 256s75.216 168 168 168z"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <circle
        cx="256"
        cy="256"
        r="128"
        fill="currentColor"
        fillOpacity={0.9}
      />
    </svg>
  );
} 