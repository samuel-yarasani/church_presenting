import React, {useEffect, useState} from "react";
import {Textfit} from "react-textfit";

const mc = new BroadcastChannel("mc");

const Live = () => {
  const [v, setV] = useState();
  const [s, setS] = useState();

  function r() {
    setS(JSON.parse(localStorage.getItem("s")));
  }

  useEffect(() => {
    r();
    mc.onmessage = (message) => {
      if (message.data === 1) {
        r();
        console.log(message.data);
        window.location.reload(false);
      } else {
        setV(message.data);
      }
    };
  }, []);

  return (
      <Textfit
          className="main"
          style={
              s && {
                color: s.tc,
                background: `url(${s.bi}) no-repeat center center fixed`,
                backgroundSize: "100% 100%",
              }
          }
          scroll="no"
      >
        <div dangerouslySetInnerHTML={{__html: v}}/>
      </Textfit>
  );
};

export default Live;
