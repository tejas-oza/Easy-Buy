/* eslint-disable no-unused-vars */
import React from "react";
import { cn } from "../../lib/utils";

const Container = ({ as: Component = "div", children, className }) => {
  return (
    <Component
      className={cn("min-h-dvh max-w-dvw relative overflow-hidden", className)}
    >
      {children}
    </Component>
  );
};

export default Container;
