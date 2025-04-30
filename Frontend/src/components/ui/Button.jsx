import React from "react";
import { cn } from "../../lib/utils.js";

const Button = ({ children, className, variant, size, ...props }) => {
  const variantProp = {
    base: "bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-200 shadow",
    destructive:
      "bg-red-600 dark:bg-red-700 text-zinc-50 hover:bg-red-700 dark:hover:bg-red-800 shadow-sm",
    outline:
      "text-zinc-950 dark:text-zinc-50 border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-800 hover:bg-zinc-100 shadow-sm",
    ghost:
      "bg-transparent text-zinc-950 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800",
    secondary:
      "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-950 dark:text-zinc-50",
  };

  const sizeProp = {
    base: "px-4 py-2 h-9",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-4",
    icon: "h-8 w-8",
  };

  return (
    <button
      className={cn(
        "font-Inter font-semibold text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        variantProp[variant],
        sizeProp[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
