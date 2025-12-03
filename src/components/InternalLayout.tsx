"use client";

import * as React from "react";

export default function InternalLayout({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`relative min-h-screen overflow-hidden internal-bg ${className || ''}`}>
      {/* Decorative animated shapes */}
      <div className="absolute -top-28 -left-32 w-96 h-96 bg-[rgba(79,70,229,0.14)] rounded-full opacity-90 blur-3xl animate-float" />
      <div className="absolute -bottom-36 -right-28 w-[28rem] h-[28rem] bg-[rgba(99,102,241,0.06)] rounded-full opacity-90 blur-3xl animate-float" />

      {/* Subtle overlay to reduce whiteness and add depth */}
      <div className="absolute inset-0 pointer-events-none bg-black/10 mix-blend-multiply" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
