import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { NavLink } from "react-router-dom";
import SidebarMenu from "../SidebarMenu";
import { useTranslation } from "react-i18next";


const mainMenuResponsiveCSS = `
  @media (max-width: 767px) {
    .main-menu > .main-nav {
      width: 100%;
    }

    .main-menu .main-nav > .row {
      display: flex;
      align-items: center;
      margin: 0;
    }

    .main-menu .main-nav nav.navbar {
      width: 75%;
      flex: 0 0 75%;
      max-width: 75%;
      padding: 8px 10px !important;
    }

    .main-menu .site-nav-inner {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
    }

    .main-menu .navbar-toggler {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 42px;
      padding: 8px;
      margin: 0;
    }

    .main-menu .main-nav > .row > .col-lg-1 {
      width: 25%;
      flex: 0 0 25%;
      max-width: 25%;
      padding: 0 10px;
    }

    .main-menu .date3 {
      justify-content: center !important;
      gap: 0 !important;
    }

    .main-menu .date3 a {
      width: 42px !important;
      height: 42px !important;
    }

    .main-menu .navbar-responsive-collapse {
      display: none !important;
    }
  }
`;

const MainMenuTwo = () => {
  const API = "https://api.bharat19express.com";

  const { t, i18n } = useTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const [sideShow, setSideShow] = useState(false);

  const getCategoryName = (category) => {
    const lang = i18n.resolvedLanguage || "en";

    return (
      category?.translations?.[lang]?.name ||
      category?.translations?.en?.name ||
      category?.name ||
      ""
    );
  };

  useEffect(() => {
    getMenu();
  }, [i18n.resolvedLanguage]);

  const getMenu = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(`${API}/api/categories/menu?lang=${language}`);
      const data = await res.json();

      if (data.success) {
        setMenuItems(data.data || []);
      }
    } catch (error) {
      console.error("Menu Error:", error);
    }
  };

  const parentMenus = menuItems.filter((item) => item.parentCategory === null);

  const getChildren = (parentId) => {
    return menuItems.filter((item) => item.parentCategory?._id === parentId);
  };

  const visibleMenus = parentMenus.slice(0, 8);
  const moreMenus = parentMenus.slice(10);

return (
  <>
    <style>{mainMenuResponsiveCSS}</style>

    <div className="container">
      <div className="main-menu">
        <div className="main-nav clearfix is-ts-sticky">
          <div className="row justify-content-between">
            <nav
              className="navbar navbar-expand-lg col-lg-11 align-self-center"
              style={{ paddingTop: "4px", paddingBottom: "4px" }}
            >
              <div className="site-nav-inner">
                <button
                  className="navbar-toggler"
                  onClick={() => setSideShow(true)}
                >
                  <FontAwesome name="bars" />
                </button>

                <div
                  id="navbarSupportedContent"
                  className="collapse navbar-collapse navbar-responsive-collapse"
                >
                  <ul
                    className="nav navbar-nav"
                    id="scroll"
                    style={{ alignItems: "center", minHeight: "42px" }}
                  >
                    <li
                      className="nav-item"
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                      }}
                    >
                      <NavLink
                        to="/"
                        end
                        style={({ isActive }) => ({
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                          padding: "5px 10px",
                          backgroundColor: isActive ? "#e31e24" : "transparent",
                          color: "#fff",
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        })}
                      >
                        <FontAwesome name="home" />
                        <span>{t("home")}</span>
                      </NavLink>
                    </li>

                    {visibleMenus.map((parent) => {
                      const children = getChildren(parent._id);

                      return (
                        <li
                          key={parent._id}
                          className={`nav-item ${
                            children.length > 0 ? "dropdown" : ""
                          }`}
                        >
                          {children.length > 0 ? (
                            <>
                              <NavLink
                                to={`/category/${parent._id}`}
                                className="menu-dropdown"
                              >
                                {/* {parent.name} */}
                                {getCategoryName(parent)}
                                <FontAwesome name="angle-down" />
                              </NavLink>

                              {/* Child Categories */}
                              <ul className="dropdown-menu" role="menu">
                                {children.map((child) => (
                                  <li key={child._id}>
                                    <NavLink to={`/category/${child._id}`}>
                                      {/* {child.name} */}
                                      {getCategoryName(child)}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <NavLink
                              to={`/category/${parent._id}`}
                              className="menu-dropdown"
                            >
                              {/* {parent.name} */}
                              {getCategoryName(parent)}
                            </NavLink>
                          )}
                        </li>
                      );
                    })}

                    {/* MORE */}
                    {moreMenus.length > 0 && (
                      <li className="nav-item dropdown">
                        <NavLink
                          to="#"
                          onClick={(e) => e.preventDefault()}
                          className="menu-dropdown"
                        >
                          {t("more")}
                          <FontAwesome name="angle-down" />
                        </NavLink>

                        <ul className="dropdown-menu" role="menu">
                          {moreMenus.map((parent) => {
                            const children = getChildren(parent._id);

                            return (
                              <li
                                key={parent._id}
                                className={
                                  children.length > 0 ? "dropdown-submenu" : ""
                                }
                              >
                                <NavLink to={`/category/${parent._id}`}>
                                  {parent.name}
                                </NavLink>

                                {/* Children inside More */}
                                {children.length > 0 && (
                                  <ul className="dropdown-menu">
                                    {children.map((child) => (
                                      <li key={child._id}>
                                        <NavLink to={`/category/${child._id}`}>
                                          {/* {child.name} */}
                                          {getCategoryName(child)}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    )}
                    <li
                      className="nav-item"
                      style={{
                        marginLeft: "10px",
                      }}
                    ></li>
                  </ul>
                </div>

                <SidebarMenu
                  className="themeBlue"
                  sideShow={sideShow}
                  setSideShow={setSideShow}
                  menus={menuItems}
                />
              </div>
            </nav>
            <div
              className="col-lg-1 text-right align-self-center"
              style={{
                background: "transparent",
              }}
            >
              <div
                className="date3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "12px",
                  background: "transparent",
                }}
              >
                <NavLink
                  to="/search"
                  aria-label="Search news"
                  title="Search"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "34px",
                    color: "#fff",
                    fontSize: "17px",
                    textDecoration: "none",
                  }}
                >
                  <FontAwesome name="search" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default MainMenuTwo;
