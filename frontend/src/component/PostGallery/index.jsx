import React, { Component } from "react";
import ProtoTypes from "prop-types";
import WidgetTab from "../WidgetTab";
// import Slider from "react-slick";
// import "../../../node_modules/slick-carousel/slick/slick.css";
import ModalVideo from "react-modal-video";
import "./style.scss";

import ThumbsSwiper from "../thumbsSwiper";

class PostGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vModal: false,
      videoId: "0r6C3z3TEKw",
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    });
  }

  modalHandler = (value) => {
    this.setState({
      vModal: value,
    });
  };

  render() {
    const { className } = this.props;
    const { vModal, videoId } = this.state;

    return (
      <div className={`post_gallary_area mb40 ${className}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-xl-8">
                  <ThumbsSwiper />
                </div>
                <div className="col-xl-4">
                  <WidgetTab dark={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalVideo
          channel="youtube"
          isOpen={vModal}
          videoId={videoId}
          onClose={() => this.modalHandler(false)}
        />
      </div>
    );
  }
}

export default PostGallery;

PostGallery.propTypes = {
  className: ProtoTypes.string,
};
