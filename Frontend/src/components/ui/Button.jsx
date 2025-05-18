import { cn } from "../../lib/cn";

const Button = ({ children, className, variant, ...props }) => {
  const variants = {
    primary: `bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-md`,
    secondary: `bg-zinc-200 hover:bg-zinc-100 dark:bg-zinc-600 dark:hover:bg-zinc-400 text-zinc-900 dark:text-zinc-50 rounded-md`,
    outlined: `border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-md`,
  };
  return (
    <button
      className={cn(
        `px-3 py-1.5 font-inter font-medium text-base cursor-pointer transition`,
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
