import React from "react";
import HeaderContainer from "./HeaderContainer.js";


const BusyView = () => {
  return <>
    <HeaderContainer
      leftContent={
        <>
          <h1 id="heading">NeNo</h1>
        </>
      }
      rightContent={null}
    />
    <main>
      <section id="section_busy">
        <img
          style={{
            width: "100px",
          }}
          src={"/assets/icons/pending-24px.svg"}
          alt={"Loading ..."}
        />
        <p>Loading ...</p>
      </section>
    </main>
  </>;
};

export default BusyView;
