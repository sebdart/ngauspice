import React from "react";
import { width } from "../../util/globals";

//* Modified by S.D. June 2020, see also spinner static.css in src/css
const nextstrainLogo = require("../../images/Big_NGA_Seal.png");
// const nextstrainLogo = require("../../images/nextstrain-logo-small.png");

const Spinner = ({availableHeight=false}) => {
  if (!availableHeight) {
    availableHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight; // eslint-disable-line
  }
  const style = {
    marginTop: `${availableHeight / 2 - 100}px`,
    width: "250px",
    height: "250px"
  };
  return (<img className={"spinner"} src={nextstrainLogo} alt="loading" style={style}/>);
};

export default Spinner;
