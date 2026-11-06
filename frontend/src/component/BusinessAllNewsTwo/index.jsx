import React from "react";
import { Link } from "react-router-dom";
// images
import business21 from "../../assets/img/business-post/business-post-1.jpg";
import arrow3 from "../../assets/img/icon/arrow3.png";
import business22 from "../../assets/img/business-post/business-post-2.jpg";
import business23 from "../../assets/img/business-post/business-post-3.jpg";
import business24 from "../../assets/img/business-post/business-post-4.jpg";
import business25 from "../../assets/img/business-post/business-post-5.jpg";
import business26 from "../../assets/img/business-post/business-post-6.jpg";
import FontAwesome from "../uiStyle/FontAwesome";

const business = [
  {
    photo: business21,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business22,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business23,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business24,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business25,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business26,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business26,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business26,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
  {
    photo: business26,
    date: "April 26, 2020",
    title: "She tried for many years pregnant & happy and thing..",
    description:
      "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
  },
];
const BusinessAllNewsTwo = () => {
  return (
    <>
      {business.map((item, i) => (
        <div key={i} className="single_post post_type12 type20">
          <div className="post_img border-radious5">
            <div className="img_wrap">
              <Link to="/business">
                <img src={item.photo} alt="thumb" />
              </Link>
            </div>
            <span className="tranding border_tranding">
              <FontAwesome name="bolt" />
            </span>
          </div>
          <div className="single_post_text">
            <h4>
              <Link to="/post1">{item.title}</Link>
            </h4>
            <div className="row">
              <div className="col-6 align-self-center">
                <div className="meta_col">
                  <p>{item.date}</p>
                </div>
              </div>
              <div className="col-6 text-right align-self-center">
                <ul className="meta_share inline">
                  <li>
                    <Link to="/">
                      <FontAwesome name="bookmark" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      <FontAwesome name="share" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="post-p">{item.description}</p>
            <div className="space-10" />
            <Link to="/business" className="readmore3">
              Read more <img src={arrow3} alt="arrow3" />
            </Link>
            {i + 1 < business.length ? (
              <>
                <div className="space-10" />
                <div className="border_black" />
                <div className="space-15" />
              </>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
};

export default BusinessAllNewsTwo;
