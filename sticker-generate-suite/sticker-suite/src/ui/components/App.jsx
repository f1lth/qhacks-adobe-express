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


const App = ({ addOnUISdk, sandboxProxy }) => {
    const [prompt, setPrompt] = React.useState("");
    const [sticker, setSticker] = React.useState(null);

    function handleGenerateButtonClick() {
        console.log("Generating sticker..")
        sandboxProxy.makeSticker();
    }

    

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme theme="express" scale="medium" color="light">

            <div className="container">
                <h1>Sticker Generator</h1>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button size="m" onClick={handleGenerateButtonClick}>
                    Create Image
                </Button>
            </div>
            {sticker && (
                <div className="container">
                    <img src={sticker} alt="sticker" />
                </div>
            )}
        </Theme>
    );
};

export default App;
