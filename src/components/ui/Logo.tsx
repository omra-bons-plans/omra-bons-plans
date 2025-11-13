import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export default function Logo({ size = 48, className, alt = "Omra Bons Plans", style, ...props }: LogoProps) {
  return (
    <img
      src="/favicon.png"
      alt={alt}
      width={size}
      height={size}
      loading="eager"
      fetchPriority="high"
      className={`object-contain ${className}`}
      style={style}
      {...props}
    />
  );
}