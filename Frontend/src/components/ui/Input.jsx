import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
  ({ className, type = "text", label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <p className="font-Inter font-semibold dark:font-medium text-sm text-zinc-950 dark:text-zinc-50">
            {label}
          </p>
        )}
        <input
          ref={ref}
          className={cn(
            "font-Inter font-medium text-base border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-800 dark:focus-visible:ring-zinc-600 px-3 py-1 flex h-9 w-full bg-transparent file:bg-transparent file:text-sm file:font-medium file:text-zinc-500 dark:file:text-zinc-300 disabled:cursor-not-allowed",
            className
          )}
          type={type}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
