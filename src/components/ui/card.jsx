import React from "react";

export function Card({ className = "", ...props }) {
  return <div className={"rounded-3xl border border-white/10 bg-white/5 " + className} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={"p-4 " + className} {...props} />;
}
