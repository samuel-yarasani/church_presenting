import React, {useEffect, useState} from "react";
import {Textfit} from "react-textfit";
import {useRecoilValue} from "recoil";
import {prevState} from "./recoilatoms";


const Pre = () => {
    const prev = useRecoilValue(prevState);

    const [s, setS] = useState();

    useEffect(() => {
        setS(JSON.parse(localStorage.getItem("s")));
    }, [prev]); // Trigger state update when prev changes

    return (
        <div style={{position: "relative", width: "100%", height: "100%"}}>
            {s && (
                <img
                    alt={""}
                    onerror="this.style.display='none'" src={s.bi}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundAttachment: "fixed",
                        zIndex: -1,
                    }}
                />
            )}
            <Textfit
                className="main cc"
                style={
                    s && {
                        color: s.tc,
                        width: "100%",
                        height: "100%",
                    }
                }
                scroll="no"
            >
                <div dangerouslySetInnerHTML={{__html: prev}}/>
            </Textfit>
        </div>
    );
};

export default Pre;
