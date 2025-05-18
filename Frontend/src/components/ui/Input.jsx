import React from "react";
import { cn } from "../../lib/cn";

const Input = ({ classNames, ...props }) => {
  return (
    <input
      className={cn(
        `px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 focus-visible:ring-zinc-200 dark:focus-visible:ring-zinc-200 rounded-md font-inter font-normal text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500`,
        classNames
      )}
      {...props}
    />
  );
};

export default Input;
