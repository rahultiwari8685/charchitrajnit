import React, { useState } from "react";
import ProtoTypes from "prop-types";
import { TabContent, TabPane, Nav, NavItem, Fade } from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

import thumb1 from "../../assets/img/gallery-1.jpg";
import thumb2 from "../../assets/img/gallery-2.jpg";
import thumb3 from "../../assets/img/gallery-3.jpg";
import thumb4 from "../../assets/img/gallery-4.jpg";
import thumb5 from "../../assets/img/gallery-5.jpg";

const WidgetTabPane = ({ arr, a_id, id, dark }) => {
  return (
    <Fade in={id === a_id}>
      <div className="widget tab_widgets">
        {arr.map((item, i) => (
          <div key={i}>
            <div className="single_post widgets_small">
              <div className="post_img">
                <div className="img_wrap">
                  <Link to="/">
                    <img
                      src={
                        item.thumbnail
                          ? `${API}/uploads/images/${item.thumbnail}`
                          : `https://img.youtube.com/vi/${getYoutubeId(item.youtubeUrl)}/hqdefault.jpg`
                      }
                      alt="thumb"
                    />
                  </Link>
                </div>
              </div>
              <div className="single_post_text">
                <div className="meta2 meta_separator1">
                  <Link to="#">{item.categories?.[0]?.name}</Link>
                  <Link to="#">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Link>
                </div>
                <h4>
                  <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                    {item.title}
                  </Link>
                </h4>
              </div>
            </div>
            <div className="space-15" />
            {dark ? (
              <div className="border_white" />
            ) : (
              <div className="border_black" />
            )}
            <div className="space-15" />
          </div>
        ))}
      </div>
    </Fade>
  );
};

WidgetTabPane.propTypes = {
  arr: ProtoTypes.array,
  a_id: ProtoTypes.string,
  id: ProtoTypes.string,
  dark: ProtoTypes.bool,
};

const WidgetTab = ({ categoryId, className, dark }) => {
  const [activeTab, setActiveTab] = useState("1");

  const API = "https://api.bharat19express.com";

  const [related, setRelated] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    getRelated();
    getLatest();
    getPopular();
  }, [categoryId]);

  const getRelated = async () => {
    const res = await fetch(`${API}/api/news/category/${categoryId}?limit=5`);

    const data = await res.json();

    if (data.status) {
      setRelated(data.data);
    }
  };

  const getLatest = async () => {
    const res = await fetch(`${API}/api/news/getAllNews?limit=5`);

    const data = await res.json();

    if (data.status) {
      setLatest(data.data);
    }
  };

  const getPopular = async () => {
    const res = await fetch(`${API}/api/news/popular?limit=5`);

    const data = await res.json();

    if (data.status) {
      setPopular(data.data);
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className={`widget_tab md-mt-30 ${className}`}>
      <Nav tabs>
        <NavItem>
          <Link
            to="/"
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            RELATED
          </Link>
        </NavItem>
        <NavItem>
          <Link
            to="/"
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            RELATED
          </Link>
        </NavItem>
        <NavItem>
          <Link
            to="/"
            className={classnames({ active: activeTab === "3" })}
            onClick={() => {
              toggle("3");
            }}
          >
            POPULAR
          </Link>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <WidgetTabPane dark={dark} a_id={activeTab} id="1" arr={related} />
        </TabPane>
        <TabPane tabId="2">
          <WidgetTabPane dark={dark} a_id={activeTab} id="2" arr={latest} />
        </TabPane>
        <TabPane tabId="3">
          <WidgetTabPane dark={dark} a_id={activeTab} id="3" arr={popular} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default WidgetTab;

WidgetTab.propTypes = {
  categoryId: ProtoTypes.string,
  className: ProtoTypes.string,
  dark: ProtoTypes.bool,
};
