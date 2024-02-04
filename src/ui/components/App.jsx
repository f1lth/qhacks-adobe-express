// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React from "react";
import "./App.css";
import { DownloadButton } from "./Download";

const App = ({ addOnUISdk, sandboxProxy }) => {

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme theme="express" scale="medium" color="light">
            <div className="container">
            <h1 style={{fontFamily: 'JetBrains Mono, monospace'}}>moshfilters</h1>
                
                <p style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    Canvas Loaded! Click the buttons below to edit and filter your image. 
                </p>
                <DownloadButton addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy}/>
            </div>
        </Theme>
    );
};

export default App;