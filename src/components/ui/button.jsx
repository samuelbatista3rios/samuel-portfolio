import React from "react";

export function Button({ asChild, className = "", children, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium " +
    "bg-white/10 hover:bg-white/15 text-white border border-white/10 shadow-sm " +
    "transition focus:outline-none focus:ring-2 focus:ring-emerald-500 " +
    className;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: (children.props.className ? children.props.className + " " : "") + base,
      ...props,
    });
  }
  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}
