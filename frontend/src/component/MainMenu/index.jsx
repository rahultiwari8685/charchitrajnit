import React, { useState, useEffect } from "react";
import ProtoTypes from "prop-types";
import FontAwesome from "../uiStyle/FontAwesome";
import tempIcon from "../../assets/img/icon/temp.png";
import { Link, NavLink } from "react-router-dom";
import SearchModal from "../SearchModal";
import SidebarMenu from "../SidebarMenu";

const MainMenu = ({ className, dark }) => {
  const API = "https://api.bharat19express.com";

  const [menuItems, setMenuItems] = useState([]);

  const [searchShow, setSearchShow] = useState(false);
  const [sideShow, setSideShow] = useState(false);

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const res = await fetch(`${API}/api/categories/menu`);
      const data = await res.json();

      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const parentMenus = menuItems.filter((item) => item.parentCategory === null);

  const arr = parentMenus;

  const visibleMenus = parentMenus.slice(0, 7);
  const moreMenus = parentMenus.slice(7);

  const getChildren = (parentId) => {
    return menuItems.filter((item) => item.parentCategory?._id === parentId);
  };

  return (
    <>
      <div className={`main-menu ${className ? className : ""}`} id="header">
        <Link to="#top" className="up_btn up_btn1">
          <FontAwesome name="chevron-double-up" />
        </Link>
        <div className="main-nav clearfix is-ts-sticky">
          <div className="container">
            <div className="row justify-content-between">
              <nav className="navbar navbar-expand-lg col-lg-8 align-self-center">
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
                    <ul className="nav navbar-nav" id="scroll">
                      <li className="nav-item">
                        <NavLink to="/">Home</NavLink>
                      </li>

                      {visibleMenus.map((parent) => {
                        const children = getChildren(parent._id);

                        return (
                          <li
                            key={parent._id}
                            className={`nav-item ${
                              children.length ? "dropdown" : ""
                            }`}
                          >
                            {children.length > 0 ? (
                              <>
                                <NavLink
                                  to={`/category/${parent._id}`}
                                  className="menu-dropdown"
                                >
                                  {parent.name}
                                  <FontAwesome name="angle-down" />
                                </NavLink>

                                <ul className="dropdown-menu">
                                  {children.map((child) => (
                                    <li key={child._id}>
                                      <NavLink to={`/category/${child._id}`}>
                                        {child.name}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <NavLink to={`/category/${parent._id}`}>
                                {parent.name}
                              </NavLink>
                            )}
                          </li>
                        );
                      })}

                      {moreMenus.length > 0 && (
                        <li className="nav-item dropdown">
                          <span className="menu-dropdown">
                            More <FontAwesome name="angle-down" />
                          </span>

                          <ul className="dropdown-menu">
                            {moreMenus.map((parent) => (
                              <li key={parent._id}>
                                <NavLink to={`/category/${parent._id}`}>
                                  {parent.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                    </ul>
                  </div>
                  {/* <SidebarMenu
                    sideShow={sideShow}
                    setSideShow={setSideShow}
                    menus={arr}
                  /> */}

                  <SidebarMenu
                    sideShow={sideShow}
                    setSideShow={setSideShow}
                    menus={menuItems}
                  />
                </div>
              </nav>
              {/* <div className="col-lg-4 align-self-center">
                <div className="menu_right">
                  <div className="users_area">
                    <ul className="inline">
                      <li
                        className="search_btn"
                        onClick={() => setSearchShow(!searchShow)}
                      >
                        <FontAwesome name="search" />
                      </li>
                      <li>
                        <FontAwesome name="user-circle" />
                      </li>
                    </ul>
                  </div>
                  <div className="lang d-none d-xl-block">
                    <ul>
                      <li>
                        <Link to="/">
                          English <FontAwesome name="angle-down" />
                        </Link>
                        <ul>
                          <li>
                            <Link to="/">Spanish</Link>
                          </li>
                          <li>
                            <Link to="/">China</Link>
                          </li>
                          <li>
                            <Link to="/">Hindi</Link>
                          </li>
                          <li>
                            <Link to="/">Corian</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className="temp d-none d-lg-block">
                    <div className="temp_wap">
                      <div className="temp_icon">
                        <img src={tempIcon} alt="temp icon" />
                      </div>
                      <h3 className="temp_count">13</h3>
                      <p>San Francisco</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {searchShow ? (
        <SearchModal setSearchShow={setSearchShow} searchShow={searchShow} />
      ) : null}
    </>
  );
};

export default MainMenu;

MainMenu.propTypes = {
  className: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
