import React from "react";
import ProtoTypes from "prop-types";
const Heading = ({ className, title }) => {
  return (
    <div className={`heading ${className ? className : ""}`}>
      <h2 className="widget-title">{title}</h2>
    </div>
  );
};

export default Heading;
Heading.propTypes = {
  className: ProtoTypes.string,
  title: ProtoTypes.string,
};
