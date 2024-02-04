import React, { useState, useEffect } from "react";
import { Button } from "@swc-react/button";
import OpenAI from "openai";
import ReactLoading from 'react-loading';
import CachedIcon from '@mui/icons-material/Cached';
import { IconButton } from "@mui/material";
import { green } from '@mui/material/colors';
import Typography from '@mui/material/Typography';


const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const IMAGE_KEY = process.env.IMAGE_KEY;
const openai = new OpenAI({apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});

export function DownloadButton({ addOnUISdk }) {
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [keyWord, setKeywords] = useState("");
    const [caption, setCaption] = useState("");
    const [buttonText, setButtonText] = useState('copy to clipboard');

    useEffect(() => {
      setLoading(true);
      handleDownload();
      setLoading(false);
    }, []);

    async function convertBlobToBase64(blobUrl) {
      // Fetch the blob from the blob URL
      const response = await fetch(blobUrl);
      const blob = await response.blob();
  
      // Convert blob to base64
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
              // Extract the base64 data from the Data URL
              const base64Data = reader.result.split(',')[1];
              resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  }

  async function uploadImage(base64Image) {
    try {
        const formData = new FormData();
        formData.append('image', base64Image);

        const response = await axios.post(`https://api.imgbb.com/1/upload?expiration=600&key=${IMAGE_KEY}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error during image upload:", error.response || error);
        throw error; // Or handle it as per your application's needs
    }
}
  
  async function callAPIWithBase64Image(blobUrl) {
      // Convert blob URL to base64
      setLoading(true);
      const base64Image = await convertBlobToBase64(blobUrl);
      
      const upload_data = await uploadImage(base64Image);
    
      // API call
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    { 
                        type: "text", 
                        text: `Create a social media caption for the attached image that is engaging, creative, and succinct. The caption should be 50-100 characters long. If relevant, incorporate these keywords: ${keyWord}. Aim for a tone that is [captivating and witty]. The caption should capture attention and convey the essence or mood of the image effectively. If you cannot describe the image, just output: "Words cannot describe this image (fire emoji) (100 emoji)."`
                    },
                    {
                        type: "image_url",
                        image_url: upload_data?.data?.url  // Use the direct URL of the uploaded image
                    }
                ],
            },
        ],
    });
      setCaption(response?.choices[0]?.message?.content)
      setLoading(false);
  }

    const handleDownload = async () => {
        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: addOnUISdk.constants.RenditionFormat.png,
        });

        const url = URL.createObjectURL(response[0].blob);
        setDownloadUrl(url);
        console.log("image has been downloaded fine")
    };

    
      const handleReset = () => {
          setDownloadUrl("");
          setCaption("");
          handleDownload();
      };
  
      const copyToClipboard = (text) => {
          navigator.clipboard.writeText(text).then(() => {
              setButtonText('copied!');
              // Optionally reset the button text after a few seconds
              setTimeout(() => setButtonText('copy to clipboard'), 3000);
          }, () => {
              setButtonText('Failed to copy!');
              // Optionally reset the button text after a few seconds
              setTimeout(() => setButtonText('copy to clipboard'), 3000);
          });
      };

    return (
      // check if loading if true, then show loading spinner
      <>
        {loading ? 
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <p> Generating your caption...</p>
            <ReactLoading type={"spin"} color={"#000000"} height={30} width={30} />
          </div> :
      
        
            <div className="container" >
                {downloadUrl && !caption && (
                    <div className="container" style={{marginTop: "-30px"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <img src={downloadUrl} width="200" height="240" style={{ border: "0px solid black", marginBottom: "30px"}}/>
                        </div>
                        <input type="text" placeholder="Insert keywords to include in your caption" value={keyWord} onChange={(e) => setKeywords(e.target.value)} 

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
                    }}/>
                        <div style={{display: "flex", justifyContent: "aligned"}}>
                        <Button id="prompt-submit" size="m" onClick={() => callAPIWithBase64Image(downloadUrl) }
                        style={{height: "50%", width: "90%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228',
                        marginTop: "10px"}}>
                            generate AI caption
                        </Button>
                        <IconButton aria-label="checkbox" style={{ color: "#242424",borderRadius: '40px', marginTop: "6px"}}
                        onClick={handleDownload}>
                            <CachedIcon />
                            <Typography variant="body2" style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace'}}> refresh</Typography>
                        </IconButton>
                        </div>
                        <p>{caption}</p>
                    </div>  
                )}
                {caption && 
                // create a text box with caption and a button which copies the caption to clipboard
                <div className="container">
                    <p>{caption}</p>
                    <Button style={{height: "50%", width: "100%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228',
                        marginBottom: "10px"}} onClick={() => copyToClipboard(caption)}>{buttonText}</Button>
                    <Button style={{height: "50%", width: "100%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228',
                        }} onClick={() => handleReset()}>regenerate</Button>
                </div>}
            </div>}
        </>
    );
}