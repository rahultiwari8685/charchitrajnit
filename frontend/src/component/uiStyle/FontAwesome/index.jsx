import React from "react";
import ProtoTypes from "prop-types";

const FontAwesome = ({ name = "", ...rest }) => {
  return <i {...rest} className={`fa fa-${name}`} />;
};

export default FontAwesome;
FontAwesome.propTypes = {
  name: ProtoTypes.string,
};
