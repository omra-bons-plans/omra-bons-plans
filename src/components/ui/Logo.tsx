import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export default function Logo({ size = 48, className, alt = "Omra Bons Plans", style, ...props }: LogoProps) {
  return (
    <img
      src="/lovable-uploads/f3eee9aa-6ad2-4c1d-bda5-2dadff68a39d.png"
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={style}
      {...props}
    />
  );
}