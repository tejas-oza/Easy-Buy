import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "font-Inter text-base font-medium text-zinc-950 dark:text-zinc-50 placeholder:text-sm placeholder:text-zinc-700 dark:placeholder:text-zinc-400 px-4 py-2 border border-zinc-800 dark:border-zinc-400 rounded-lg focus-visible:outline-none disabled:cursor-not-allowed",
        className
      )}
      type={type}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
