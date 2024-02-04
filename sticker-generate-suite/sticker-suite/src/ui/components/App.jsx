// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import glyphlogo from '../assets/glyph-logos_black.png'

const axios = require('axios');

const API_KEY=process.env.API_KEY;

import { indigo, red, lightGreen, green } from '@mui/material/colors';



import { Button } from "@swc-react/button";
import IconButton from '@mui/material/IconButton';
import { Theme } from "@swc-react/theme";
import React from "react";
import "./App.css";
import logo from '../assets/asset.png';

const url = "https://api.segmind.com/v1/segmind-vega";

const App = ({ addOnUISdk, sandboxProxy }) => {
    const [prompt, setPrompt] = React.useState('');
    const [sticker, setSticker] = React.useState('');
    const [loading, setLoading] = React.useState(false); // Track loading state

    const imageData = null;
        

    const data = {
        "prompt": `RETURN TRANSPARENT PNG ONLY. TRANSPARENT PNG. Create a playful and fun sticker featuring a cartoon-style ${prompt}. The sticker should have a transparent background, vibrant colors, and a cheerful theme. The ${prompt} should be depicted in a cute and whimsical manner, suitable for a wide range of ages. Emphasize a friendly and engaging appearance, with exaggerated features typical of cartoon art. The sticker should be appealing for use in casual and light-hearted contexts, such as messaging apps or personal decoration.`,
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
    setPrompt('');
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


            <div className="container"  style={{ position: 'relative', height: '100vh' }}>
            <img src={glyphlogo} style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    margin: '0px', // Adjust as needed
                    width: '70px', // Adjust as needed
                    height: '75px' // Adjust as needed
                }} />
            <h1 style={{fontFamily: 'JetBrains Mono, monospace'}}>ai sticker</h1>
                <h1 style={{fontFamily: 'JetBrains Mono, monospace'}}>sticker</h1>
                <h1 style={{fontFamily: 'JetBrains Mono, monospace', color: lightGreen[700], marginTop: '-10px' }}>generator</h1>
                <input
                    id="prompt-input"
                    type="text"
                    value={prompt}
                    placeholder="Enter a prompt to generate a sticker.."
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f0f0f0',
                        fontSize: '10px',
                        color: '#333',
                        outline: 'none', // Remove the default outline on focus
                        fontFamily: 'JetBrains Mono, monospace', // Change the font
                        borderRadius: '4px', // Add rounded corners
                        transition: '0.3s', // Add a smooth transition for focus
                    }}
                />
                <Button id="prompt-submit" size="m" onClick={handleGenerateButtonClick}
                style={{width: "60%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228',
                transition: 'background-color 0.3s', // Add a smooth transition for background color
                '&:hover': {
                    backgroundColor: '#FFFFFF', // Use a lighter font weight
            }}}>
                    create sticker
                </Button>
                {/* Load the Circular Progress here. */}
                <div style={{display:"flex", justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "25px" }}>
                    {loading && <CircularProgress style={{color:green[200]}}/>}
                </div>
                {sticker && (
                <><h3>Previewed Image</h3><div className="preview-container">
                    <div className="image-container">
                        <img src={sticker} alt="sticker"/>
                    </div>
                    <div className="icon-buttons">
                        <IconButton aria-label="checkbox" style={{ color: green[700],borderRadius: '40px'}}
                        onClick={handleInsertImage}>
                            <CheckBoxIcon />
                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>Insert</Typography>
                        </IconButton>
                        <IconButton aria-label="close" style={{ color: red[500], borderRadius: '40px' }}>
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
