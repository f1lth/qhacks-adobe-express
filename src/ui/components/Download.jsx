import React, { useState } from "react";
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import { useEffect } from "react";31
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();


export function DownloadButton({ addOnUISdk }) {
    const [downloadUrl, setDownloadUrl] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');
    const [processedVideoUrl, setProcessedVideoUrl] = useState('');
    const [logMessage, setLogMessage] = useState('');


    
  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    console.log('awaiting load')
    
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    /**
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
     */
    await ffmpeg.load();
    console.log('loaded')
    setLoaded(true);
  };

    const datamoshVideo = async () => {

        // Write the video file to FFmpeg's virtual file system
        await ffmpeg.writeFile('input.mp4', await fetchFile(downloadUrl));

        // Example FFmpeg command to manipulate the video for datamoshing
        // Note: This is a placeholder and may need specific adjustments
        await ffmpeg.run('-i', 'input.mp4', '-filter_complex', '[0:v]...', 'output.mp4');

        // Read the processed file and create a URL for it
        const data = await ffmpeg.readFile('output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        // Set the processed video URL for display or download
        setProcessedVideoUrl(url);
    };


    const handleDownload = async () => {
        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: "video/mp4",
        });

        const url = URL.createObjectURL(response[0].blob);
        setDownloadUrl(url);
        


    };

    return (
        <>
            <div className="container" >
                <a href={downloadUrl} download="download" style={{ display: "flex", width: "100%", height: "100%", textDecoration: "none" }}>
                    <Button onClick={handleDownload}>
                        Download
                    </Button>
                </a>
            </div>
            {downloadUrl && (
                <div className="container">
                    <video width="320" height="240" controls>
                        <source src={downloadUrl} type="video/mp4" />
                    </video>

                    
                    <Button onClick={() => load()}>load ffmpeg</Button>
                </div>
            )}
            {loaded && (
                <div className="container">
                    <Button onClick={datamoshVideo}>Datamosh</Button>
                </div>
            )}
            {processedVideoUrl && loaded && (
                <div className="container">
                    <video width="320" height="240" controls>
                        <source src={processedVideoUrl} type="video/mp4" />
                        </video>
                </div>  
            )}
        </>
    );
}

