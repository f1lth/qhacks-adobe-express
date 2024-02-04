import React, { useState, useEffect } from "react";
import { Button } from "@swc-react/button";
import ReactLoading from 'react-loading';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import Typography from '@mui/material/Typography';
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

export function DownloadButton({ addOnUISdk, sandboxProxy }) {
    const [loading, setLoading] = useState(false);
    const [filterImage, setFilterImage] = useState("");
    const [filterImageBlob, setFilterImageBlob] = useState(new Blob());
    const [previewImage, setPreviewImage] = useState("");
    const [imageBlob, setImageBlob] = useState(new Blob());

    useEffect(() => {
        setLoading(true);
        handleDownload();
        setLoading(false);
    }, []);


    const handleDownload = async () => {
        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: "image/jpeg",
        });

        const url = URL.createObjectURL(response[0].blob);
        setPreviewImage(url);
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
        setPreviewImage(URL.createObjectURL(newBlob));
        setFilterImageBlob(newBlob);
    }

    async function fattycatty(imageBlob) {

        function slambamboozle (data) {
            const min = Math.min;
          
            // ??? what the fuck
            for (let i = 0; i < data.length; i += 4) {
              data[i + 0] = min(data[i + 0] * 1.4, 280);
              data[i + 1] = min(data[i + 1] * 1.4, 280);
              data[i + 2] = min(data[i + 2] * 1.4, 280);
            }
          
            for (let i = 0; i < data.length; i += 4) {
              data[i + 0] = min(data[i + 0] * 1.4, 280);
              data[i + 1] = min(data[i + 1] * 1.4, 280);
              data[i + 2] = min(data[i + 2] * 1.4, 280);
            }
          
            for (let i = 0; i < data.length; i += 4) {
              data[i + 0] = min(data[i + 0] * 1.4, getRandomInt(0, 256));
              data[i + 1] = min(data[i + 1] * 1.4, getRandomInt(0, 256));
              data[i + 2] = min(data[i + 2] * 1.4, getRandomInt(0, 256));
            }
          
            // ヾ(⌐■_■)ノ♪
            for (let i = 0; i < data.length; i += 4) {
              data[i + 0] = min(data[i + 0] * 1.4, 255);
              data[i + 1] = min(data[i + 1] * 1.4, 1);
              data[i + 2] = min(data[i + 2] * 1.4, 255);
            }
          
            return data;
          };

          return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(imageBlob);
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              slambamboozle(imageData.data); // Process the image data
              ctx.putImageData(imageData, 0, 0);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  setFilterImage(URL.createObjectURL(blob));
                  setFilterImageBlob(blob);
                  setPreviewImage(URL.createObjectURL(blob));
                  resolve();
                } else {
                  reject(new Error('Canvas to Blob conversion failed'));
                }
              }, imageBlob.type);
              URL.revokeObjectURL(url);
            };
            img.onerror = () => reject(new Error('Image loading failed'));
            img.src = url;
  
          });
    }
    
    async function vaporwave(imageBlob) {
        function manipulate (data) {
            const COLORS = [
              [0, 184, 255],
              [255, 0, 193],
              [150, 0, 255],
              [0, 255, 249],
            ];
          
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] <= 15 && data[i + 1] <= 15 && data[i + 2] <= 15) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
              } else if (
                data[i] > 15 &&
                data[i] <= 60 &&
                data[i + 1] > 15 &&
                data[i + 1] <= 60 &&
                data[i + 2] > 15 &&
                data[i + 2] <= 60
              ) {
                data[i] = COLORS[0][0];
                data[i + 1] = COLORS[0][1];
                data[i + 2] = COLORS[0][2];
              } else if (
                data[i] > 60 &&
                data[i] <= 120 &&
                data[i + 1] > 60 &&
                data[i + 1] <= 120 &&
                data[i + 2] > 60 &&
                data[i + 2] <= 120
              ) {
                data[i] = COLORS[1][0];
                data[i + 1] = COLORS[1][1];
                data[i + 2] = COLORS[1][2];
              } else if (
                data[i] > 120 &&
                data[i] <= 180 &&
                data[i + 1] > 120 &&
                data[i + 1] <= 180 &&
                data[i + 2] > 120 &&
                data[i + 2] <= 180
              ) {
                data[i] = COLORS[2][0];
                data[i + 1] = COLORS[2][1];
                data[i + 2] = COLORS[2][2];
              } else if (
                data[i] > 180 &&
                data[i] <= 234 &&
                data[i + 1] > 180 &&
                data[i + 1] <= 234 &&
                data[i + 2] > 180 &&
                data[i + 2] <= 234
              ) {
                data[i] = COLORS[3][0];
                data[i + 1] = COLORS[3][1];
                data[i + 2] = COLORS[3][2];
              } else if (data[i] >= 235 && data[i + 1] >= 235 && data[i + 2] >= 235) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
              }
            }
          
            return data;
          };

        return new Promise((resolve, reject) => {
          const img = new Image();
          const url = URL.createObjectURL(imageBlob);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            manipulate(imageData.data); // Process the image data
            ctx.putImageData(imageData, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                setFilterImage(URL.createObjectURL(blob));
                setFilterImageBlob(blob);
                setPreviewImage(URL.createObjectURL(blob));
                resolve();
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            }, imageBlob.type);
            URL.revokeObjectURL(url);
          };
          img.onerror = () => reject(new Error('Image loading failed'));
          img.src = url;

        });
      }

    async function handleInsertImage() {
        console.log("Inserting sticker..");
        const result = await sandboxProxy.createImage(filterImageBlob);
    };

    return (
        // make it so its either loading or displaying the image
        loading ? <ReactLoading type={"spin"} color={"#000000"} height={667} width={375} /> :
        <div className="container">

            
        <div className="container" style={{display: "flex",}}>
                <img src={previewImage} style={{paddingBottom: '10px'}}/> 

                
                <IconButton aria-label="checkbox" style={{ color: "#242424",borderRadius: '40px', marginTop: "3px"}}
                        onClick={() => handleDownload()}>
                            <CachedIcon />
                            <Typography variant="body2" style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace'}}> reload canvas</Typography>
                  </IconButton>
            
            
            
                <Button id="prompt-submit" size="m" onClick={() => processImageBlob(imageBlob, {})}
                    style={{width: "90%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228', margin: "5px", 
                    transition: 'background-color 0.3s', // Add a smooth transition for background color
                '   &:hover': {
                      backgroundColor: '#FFFFFF', // Use a lighter font weight
                    }}}>
                    Crush
                </Button>

                <Button id="prompt-submit" size="m" onClick={() => vaporwave(imageBlob, {})}
                    style={{width: "90%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228', margin: "5px", 
                    transition: 'background-color 0.3s', // Add a smooth transition for background color
                '   &:hover': {
                      backgroundColor: '#FFFFFF', // Use a lighter font weight
                    }}}>
                    Vaporwave
                </Button>
            
            
                <Button id="prompt-submit" size="m"  onClick={() => fattycatty(imageBlob)}
                    style={{width: "90%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228', margin: "5px", 
                    transition: 'background-color 0.3s', // Add a smooth transition for background color
                '   &:hover': {
                      backgroundColor: '#FFFFFF', // Use a lighter font weight
                    }}}>
                    Microwave
                </Button>
            </div>
            {filterImage && 
                
                    
                    <Button id="prompt-submit" size="m"  onClick={() => handleInsertImage()}>
                    style={{width: "100%", fontFamily: 'JetBrains Mono, monospace', fontWeight: 'lighter', fontSize: '13px', backgroundColor: '#28A228', 
                    transition: 'background-color 0.3s', // Add a smooth transition for background color
                '   &:hover': {
                      backgroundColor: '#FFFFFF', // Use a lighter font weight
                    }}}>
                    Insert
                </Button>
    }
        </div>     
        
    );
}