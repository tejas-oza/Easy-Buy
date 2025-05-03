import React from "react";
import SignUp from "../../components/SignUp/SignUp";
import { useLocation } from "react-router";
import SignIn from "../../components/SignIn/SignIn";

const AuthPage = () => {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="relative z-40 flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="dark:hidden absolute inset-0 -z-10 h-full w-full bg-zinc-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-zinc-900 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="w-full max-w-xs">
          {isLogin ? <SignIn /> : <SignUp />}
        </div>
      </div>

      <div className="p-10 bg-red-500 hidden lg:block"></div>
    </main>
  );
};

export default AuthPage;

{
  /* <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div> */
}
