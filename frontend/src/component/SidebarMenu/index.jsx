import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Collapse } from "reactstrap";
import FontAwesome from "../uiStyle/FontAwesome";

import "./style.scss";

const SidebarMenu = ({ menus, sideShow, setSideShow, className }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const parentMenus = menus.filter((item) => item.parentCategory === null);

  const getChildren = (parentId) => {
    return menus.filter((item) => item.parentCategory?._id === parentId);
  };

  return (
    <div
      className={`sidebarMenu ${
        sideShow ? "" : "hideSideMenu"
      } ${className || ""}`}
    >
      <span className="clox" onClick={() => setSideShow(false)}>
        Close
      </span>

      <ul className="navBar">
        <li>
          <NavLink to="/" onClick={() => setSideShow(false)}>
            Home
          </NavLink>
        </li>

        {parentMenus.map((parent) => {
          const children = getChildren(parent._id);

          return (
            <li key={parent._id} className={children.length ? "has_sub" : ""}>
              {children.length > 0 ? (
                <>
                  <p
                    onClick={() =>
                      setOpenMenu(openMenu === parent._id ? null : parent._id)
                    }
                    className={openMenu === parent._id ? "active" : ""}
                  >
                    {parent.name}

                    <FontAwesome
                      name={
                        openMenu === parent._id
                          ? "angle-down active"
                          : "angle-down"
                      }
                    />
                  </p>

                  <Collapse isOpen={openMenu === parent._id}>
                    <ul className="subMenu">
                      {children.map((child) => (
                        <li key={child._id}>
                          <NavLink
                            to={`/category/${child._id}`}
                            onClick={() => setSideShow(false)}
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </>
              ) : (
                <NavLink
                  to={`/category/${parent._id}`}
                  onClick={() => setSideShow(false)}
                >
                  {parent.name}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarMenu;
