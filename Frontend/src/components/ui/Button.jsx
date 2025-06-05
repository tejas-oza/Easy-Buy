import { cn } from "../../lib/cn";

const Button = ({ children, className, variant, ...props }) => {
  const variants = {
    primary: `bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-md`,
    secondary: `bg-zinc-100 hover:bg-zinc-100/50 dark:bg-zinc-800 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 rounded-md`,
    outlined: `border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-md`,
    ghost: `hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 rounded-md`,
  };
  return (
    <button
      className={cn(
        `px-2 py-2 font-inter font-medium text-base cursor-pointer transition-all ease-in-out duration-200`,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
