import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export default function Logo({ size = 48, className, alt = "Omra Bons Plans - Comparateur Pèlerinage Mecque Hajj", style, ...props }: LogoProps) {
  return (
    <img
      src="/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png"
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={style}
      {...props}
    />
  );
}