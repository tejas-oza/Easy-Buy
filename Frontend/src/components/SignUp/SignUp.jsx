import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link } from "react-router";

const SignUp = () => {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 items-center text-center">
        <h1 className="font-Inter font-bold text-2xl text-zinc-950 dark:text-zinc-50">
          Create New Account
        </h1>
        <p className="font-Inter font-medium text-sm text-balance text-zinc-950 dark:text-zinc-100">
          Create an account and start shopping!
        </p>
      </div>

      <div className="grid gap-6">
        <Input
          type="email"
          id="email"
          placeholder="Enter email"
          className={
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900 bg-zinc-50 dark:bg-zinc-900"
          }
        />

        <Input
          type="password"
          id="password"
          placeholder="Enter password"
          className={
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900 bg-zinc-50 dark:bg-zinc-900"
          }
        />

        <Button
          variant={"base"}
          size={"lg"}
          className={"font-Inter font-semibold text-sm"}
        >
          Sign up
        </Button>
      </div>

      <div className="relative after:absolute after:w-full after:border after:border-zinc-300 dark:after:border-zinc-800 ">
        <span className="absolute -top-3 left-[29%] z-50 bg-zinc-50 dark:bg-zinc-900 px-2 font-Inter font-medium text-sm text-zinc-950 dark:text-zinc-50">
          Or continue with
        </span>
      </div>

      <Button
        variant={"secondary"}
        size={"base"}
        className="flex-1 bg-zinc-100"
      >
        Google
      </Button>

      <p className="text-center font-Inter font-medium text-sm text-zinc-950 dark:text-zinc-50">
        Already have account?{" "}
        <Link
          to={"/login"}
          className="underline hover:text-blue-800 dark:hover:text-blue-300"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
