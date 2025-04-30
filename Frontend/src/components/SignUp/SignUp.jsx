import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link } from "react-router";

const SignUp = () => {
  return (
    <form
      className={
        "flex flex-col gap-6 p-4 bg-zinc-200 dark:bg-zinc-900 rounded-xl"
      }
    >
      <div
        className="absolute inset-0 -z-10 h-full w-full 
    bg-zinc-50
    bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] 
    [background-size:16px_16px]
    dark:hidden"
      />
      <div
        className="absolute inset-0 -z-10 h-full w-full 
    bg-black 
    bg-[radial-gradient(#18181b_1px,transparent_1px)] 
    [background-size:16px_16px]
    hidden dark:block"
      />

      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="font-Inter font-bold text-2xl text-zinc-950 dark:text-zinc-50">
          Create New Account
        </h1>
        <p className="font-Inter font-medium text-sm text-zinc-950 dark:text-zinc-50">
          Create an account and shop unlimited.
        </p>
      </div>
      <div className="grid gap-4">
        <Input
          label="Username"
          className="bg-zinc-100 dark:bg-zinc-900 text-sm"
          id="username"
          placeholder="Enter username"
          required
        />

        <Input
          label="Email"
          type="email"
          className="bg-zinc-100 dark:bg-zinc-900 text-sm"
          id="email"
          placeholder="ex@example.com"
          required
        />

        <Input
          label="Phone no"
          type="phone"
          className="bg-zinc-100 dark:bg-zinc-900 text-sm"
          id="phoneno"
          placeholder="Enter phone no."
          required
        />

        <Input
          label="Password"
          type="password"
          className="bg-zinc-100 dark:bg-zinc-900 text-sm"
          id="password"
          placeholder="Enter password"
          required
        />

        <Button
          type="submit"
          variant={"base"}
          size={"base"}
          className={"mt-3 font-bold"}
        >
          Create account
        </Button>

        <p className="text-center font-Inter font-medium text-sm text-zinc-950 dark:text-zinc-50">
          Already have account?{" "}
          <Link to={"/login"} className="font-semibold underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUp;
