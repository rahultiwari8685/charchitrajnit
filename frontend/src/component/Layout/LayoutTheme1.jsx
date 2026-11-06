import React from "react";
import ProtoTypes from "prop-types";
import TopBar from "../../component/TopBar";
import LogoArea from "../../component/LogoArea";
import MainMenu from "../../component/MainMenu";
import FooterArea from "../../component/FooterArea";
import { Outlet } from "react-router-dom";
import ScrollTopButton from "../ScrollTopButton";

const LayoutTheme1 = ({ children }) => {
  return (
    <div className="theme-1">
      <ScrollTopButton />
      <TopBar className="white_bg" />
      <div className="border_black" />
      <LogoArea className="white_bg" />
      <MainMenu />
      <Outlet />
      {children}
      <FooterArea className="primay_bg" />
    </div>
  );
};
export default LayoutTheme1;

LayoutTheme1.propTypes = {
  children: ProtoTypes.node,
};
