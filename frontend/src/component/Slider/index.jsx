import React from "react";
import ProtoTypes from "prop-types";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
  Grid,
  Thumbs,
  FreeMode,
} from "swiper/modules";

function Slider({ children, ...props }) {
  return (
    <Swiper
      {...props}
      modules={[
        Autoplay,
        Pagination,
        Navigation,
        EffectFade,
        Grid,
        Thumbs,
        FreeMode,
      ]}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index + "swiper"}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}

Slider.propTypes = {
  children: ProtoTypes.node,
};

export default Slider;
