import React, { forwardRef } from "react";
import { cn } from "../../lib/cn";

const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        `px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 focus-visible:ring-zinc-200 dark:focus-visible:ring-zinc-200 rounded-md font-inter font-normal text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500`,
        className
      )}
      {...props}
    />
  );
});

export default Input;
