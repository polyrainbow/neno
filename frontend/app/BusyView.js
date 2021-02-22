import React from "react";
import HeaderContainer from "./HeaderContainer.js";
import { ICON_PATH } from "./lib/config.js";

const BusyView = () => {
  return <>
    <HeaderContainer
      rightContent={null}
    />
    <section
      id="section_busy"
      style={{
        "display": "flex",
        "justifyContent": "center",
        "padding": "15px",
      }}
    >
      <div style={{
        "textAlign": "center",
      }}>
        <img
          style={{
            width: "120px",
          }}
          src={ICON_PATH + "pending-24px.svg"}
          alt={"Loading ..."}
          className="svg-icon"
        />
        <p>Loading ...</p>
      </div>
    </section>
  </>;
};

export default BusyView;
