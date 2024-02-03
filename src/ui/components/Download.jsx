import React, { useState } from "react";
import { Button } from "@swc-react/button";


export function DownloadButton({ addOnUISdk }) {
    const [downloadUrl, setDownloadUrl] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [filterImage, setFilterImage] = useState("");
    const [filterImageBlob, setFilterImageBlob] = useState(new Blob());
    const [image, setImage] = useState("");
    const [imageBlob, setImageBlob] = useState(new Blob());


    const handleDownload = async () => {
        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: "image/jpeg",
        });

        const url = URL.createObjectURL(response[0].blob);
        setImage(url);
        setImageBlob(response[0].blob);

    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    async function processImageBlob(imageBlob, options) {

        console.log(typeof imageBlob); // Should be 'object'
        console.log(imageBlob instanceof Blob); // Should be true

        // Options destructuring (default values can be set here)
        const { 
            continuous = true, 
            continuousChance = 0.6, 
            times = 50, 
            minRatio = 0.1, 
            maxRatio = 0.9 
        } = options;
    
        console.log('Continuous mode:', continuous);
        console.log('Continuous chance:', continuousChance);
    
        // Convert blob to ArrayBuffer
        const arrayBuffer = await imageBlob.arrayBuffer();
        const buf = new Uint8Array(arrayBuffer);
    
        const len = buf.length;
        const min = Math.floor(len * minRatio);
        const max = Math.floor(len * maxRatio);
        console.log("Buffer length: " + len);
        console.log("Randomly assigning values within bytes " + min + " and " + max);
    
        let offset = getRandomInt(min, max);
        for (let i = 0; i < times; i++) {
            buf[offset] = getRandomInt(0, 255);
            if (continuous) {
                if (continuousChance > Math.random() && (offset + 1 <= max)) {
                    offset++;
                } else {
                    offset = getRandomInt(min, max);
                }
            } else {
                offset = getRandomInt(min, max);
            }
        }
    
        // Convert the modified buffer back to a blob
        const newBlob = new Blob([buf], { type: imageBlob.type });
        setFilterImage(URL.createObjectURL(newBlob));
    }
    
    // Example usage
    // processImageBlob(yourImageBlob, {}).then(newBlob => {
    //     const newBlobUrl = URL.createObjectURL(newBlob);
    //     // You can use newBlobUrl as the src for an image or for download
    // });
    



    return (
        <>
            <div className="container" >
                <a href={downloadUrl} download="download" style={{ display: "flex", width: "100%", height: "100%", textDecoration: "none" }}>
                    <Button onClick={handleDownload}>
                        Download
                    </Button>
                </a>
            </div>
            
            {image && <img src={image} alt="rendition" />}
            {loaded && (
                <div className="container">
                    <Button onClick={datamoshVideo}>Datamosh</Button>
                </div>
            )}
            <div className="container">
                <Button onClick={() => processImageBlob(imageBlob, {})}>do effects</Button>
            </div>
            {filterImage && <img src={filterImage} alt="rendition" />}
|
        </>
    );
}

