import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export default function Logo({ size = 48, className, alt = "Omra Bons Plans", ...props }: LogoProps) {
  return (
    <img
      src="/lovable-uploads/3c50d8af-60ac-440c-8d0e-00a3fa82d43e.png"
      alt={alt}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}