import React from "react";
import ProtoTypes from "prop-types";
import { Outlet } from "react-router-dom";
import TopBar from "../../component/TopBar";
import LogoArea from "../../component/LogoArea";
import MainMenu from "../../component/MainMenu";
import FooterArea from "../../component/FooterArea";
import ScrollTopButton from "../ScrollTopButton";

const LayoutThemeDark = ({ children }) => {
  return (
    <div className="dark-theme primay_bg">
      <ScrollTopButton />
      <TopBar dark={true} />
      <div className="border_white" />
      <LogoArea dark={true} className="dark-2" />
      <MainMenu dark={true} className="dark-2" />
      <Outlet />
      {children}
      <FooterArea className="dark-2" />
    </div>
  );
};
export default LayoutThemeDark;

LayoutThemeDark.propTypes = {
  children: ProtoTypes.node,
};
