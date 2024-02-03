import React, { useState } from "react";
import { Button } from "@swc-react/button";



import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});



export function DownloadButton({ addOnUISdk }) {
    const [downloadUrl, setDownloadUrl] = useState("");
    const [keyWord, setKeywords] = useState("");
    const [caption, setCaption] = useState("");

    async function annotateApi() {
        console.log(downloadUrl);
        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: `Generate a captivating instagram caption for the following image. Make sure to include themes of the following: ${downloadUrl}` },
                {
                  type: "image_url",
                  image_url: {
                    "url": downloadUrl,
                    "detail": "low",
                  },
                },
              ],
            },
          ],
        });
        console.log(response.choices[0]);
        setCaption(response.choices[0].message.content[0].text.content[0].text);
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

    return (
        <>
            <div className="container" >
                <a href={downloadUrl} download="download" style={{ display: "flex", width: "100%", height: "100%", textDecoration: "none" }}>
                    <Button onClick={handleDownload}>
                        Download Poster
                    </Button>
                </a>
                {downloadUrl && (
                    <div className="container">
                        <img src={downloadUrl} width="200" height="240" style={{ border: "1px solid black", marginBottom: "10px"}}/>
                        <input type="text" placeholder="Insert keywords." value={keyWord} onChange={(e) => setKeywords(e.target.value)} 
                        style={{marginBottom: "5px"}}/>
                        <div style={{display: "flex", justifyContent: "aligned"}}>
                        <Button onClick={annotateApi}>Generate AI Caption</Button>
                        <Button style={{marginLeft: "3px"}}>Undo</Button>
                        </div>
                        <p>${caption}</p>
                    </div>
                )}
            </div>
        </>
    );
}