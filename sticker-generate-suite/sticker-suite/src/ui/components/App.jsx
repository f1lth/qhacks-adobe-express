// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


const axios = require('axios');

const API_KEY=process.env.API_KEY;

import { blue, red } from '@mui/material/colors';



// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import IconButton from '@mui/material/IconButton';
import { Theme } from "@swc-react/theme";
import React from "react";
import "./App.css";

const url = "https://api.segmind.com/v1/segmind-vega";

const App = ({ addOnUISdk, sandboxProxy }) => {
    const [prompt, setPrompt] = React.useState('');
    const [sticker, setSticker] = React.useState('');
    const [loading, setLoading] = React.useState(false); // Track loading state

    const imageData = null;
        

    const data = {
        "prompt": `Create a playful and fun sticker featuring a cartoon-style ${prompt}. The sticker should have a transparent background, vibrant colors, and a cheerful theme. The ${prompt} should be depicted in a cute and whimsical manner, suitable for a wide range of ages. Emphasize a friendly and engaging appearance, with exaggerated features typical of cartoon art. The sticker should be appealing for use in casual and light-hearted contexts, such as messaging apps or personal decoration.`,
        "negative_prompt": "(worst quality, low quality)",
        "samples": 1,
        "scheduler": "UniPC",
        "num_inference_steps": 30,
        "guidance_scale": 9,
        "seed": 696969694444,
        "img_width": 512,
        "img_height": 512,
        "base64": false
    };

    async function makeSticker() {
        setLoading(true);
        try {
            const response = await axios.post(url, data, {headers: {'x-api-key': API_KEY}, responseType: 'blob'});
            const savedImageUrl = URL.createObjectURL(response.data);
            setSticker(savedImageUrl);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                console.error('ERROR: ', error.response.data);
            } else {
                console.error('Error occurred while making the request:', error.message);
            }
        }
    }

    function handleGenerateButtonClick() {
        console.log("Generating sticker..");
        makeSticker();
    }

    async function handleInsertImage() {
        setLoading(true);
        console.log("Inserting sticker..");
        let blobSticker = await getObjectFromURL(sticker);
        const result = await sandboxProxy.createImage(blobSticker);
        setLoading(false);
    }
    
    async function handleRemoveImage() {
    console.log("Removing sticker..");
    setSticker('');
    }

    async function getObjectFromURL (objectURL) {
        const response = await fetch(objectURL);
        const blob = await response.blob();
        return blob;
    }
    

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme theme="express" scale="medium" color="light">

            <div className="container">
                <h1>Sticker Generator</h1>
                <input
                    id="prompt-input"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button id="prompt-submit" size="m" onClick={handleGenerateButtonClick}>
                    Create Image
                </Button>
                {/* Load the Circular Progress here. */}
                {loading && <CircularProgress/>}
                {sticker && (
                <><h3>Previewed Image</h3><div className="preview-container">
                    <div className="image-container">
                        <img src={sticker} alt="sticker"/>
                    </div>
                    <div className="icon-buttons">
                        <IconButton aria-label="checkbox" style={{ color: blue[500] }} onClick={handleInsertImage}>
                            <CheckBoxIcon />
                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>Insert</Typography>
                        </IconButton>
                        <IconButton aria-label="close" style={{ color: red[500] }}>
                            <CloseIcon />
                            <Typography variant="body2" style={{ fontSize: '0.8rem' }} onClick={handleRemoveImage}>Retry</Typography>
                        </IconButton>     
                    </div>           
                </div></>
            )}
            </div>
        </Theme>
    );
};

export default App;
