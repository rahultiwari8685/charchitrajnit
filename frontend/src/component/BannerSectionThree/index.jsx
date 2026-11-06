import React from "react";
import { Link } from "react-router-dom";
import banner42 from "../../assets/img/ad/ad-1.png";

const BannerSectionThree = () => {
  return (
    <div className="padding5050 theme3_bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            <div className="banner1 border-radious5">
              <Link to="/">
                <img src={banner42} alt="banner" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSectionThree;
