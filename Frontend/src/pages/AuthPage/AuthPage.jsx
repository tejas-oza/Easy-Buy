import React from "react";
import SignUp from "../../components/SignUp/SignUp";
import SignIn from "../../components/SignIn/SignIn";

const AuthPage = ({ type }) => {
  return (
    <main className={"grid min-h-svh lg:grid-cols-2"}>
      <div className="flex flex-1 items-center justify-center relative">
        <div className="w-full max-w-xs md:max-w-sm">
          {type ? <SignIn /> : <SignUp />}
        </div>
      </div>
      <div className="inset-0 w-full h-full hidden bg-zinc-950 lg:block"></div>
    </main>
  );
};

export default AuthPage;

{
  /*  */
}
