// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { green } from "@mui/material/colors";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React from "react";
import "./App.css";
import { DownloadButton } from "./Download";


import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});


const App = ({ addOnUISdk, sandboxProxy }) => {
    function handleClick() {
        sandboxProxy.createRectangle();
    }

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme theme="express" scale="medium" color="light">
            <div className="logo" style={{display:"flex", justifyContent: "center",
                                        alignItems: "center", width: "100%", height: "100%",
                                        marginTop: "10px", marginBottom: "-25px" }}>
                <h1 style={{fontFamily: 'Proxima Nova, monospace', color: green[900]}}>glyph.</h1>
            </div>
            <div className="container">
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '100'}}>begin boosting your social media presence!</p>
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                    <DownloadButton addOnUISdk={addOnUISdk} />
            </div>
        </Theme>
    );
};

export default App;
