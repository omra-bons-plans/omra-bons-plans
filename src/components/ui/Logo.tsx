import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export default function Logo({ size = 48, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <title>Omra Bons Plans</title>
      <defs>
        <style>
          {`.ink{fill:#0B1E3A} .gold{fill:#D4AF37}`}
        </style>
      </defs>
      
      {/* Croissant */}
      <path 
        className="ink" 
        fillRule="evenodd"
        d="M64 12a44 44 0 1 0 0 104a36 36 0 1 1 0-72z"
      />
      
      {/* Kaaba stylisée */}
      <g transform="translate(36,36)">
        <rect width="56" height="56" rx="5" className="ink"/>
        <rect y="16" width="56" height="8" className="gold"/>
        <rect x="6" y="16" width="8" height="8" className="ink" opacity="0.3"/>
        <rect x="20" y="16" width="16" height="8" className="ink" opacity="0.3"/>
      </g>
    </svg>
  );
}