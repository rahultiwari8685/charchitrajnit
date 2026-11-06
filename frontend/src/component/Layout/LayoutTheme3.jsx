import React from "react";
import ProtoTypes from "prop-types";
import { Outlet } from "react-router-dom";
import LogoAreaThree from "../../component/LogoAreaThree";
import FooterAreaThree from "../../component/FooterAreaThree";
import ScrollTopButton from "../ScrollTopButton";

const LayoutTheme3 = ({ children }) => {
  return (
    <div className="theme-4 bg4">
      <ScrollTopButton />
      <LogoAreaThree />
      <Outlet />
      {children}
      <FooterAreaThree />
    </div>
  );
};
export default LayoutTheme3;

LayoutTheme3.propTypes = {
  children: ProtoTypes.node,
};
