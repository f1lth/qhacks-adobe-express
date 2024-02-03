import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";



// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

function start() {
    // APIs to be exposed to the UI runtime
    // i.e., to the `index.html` file of this add-on.
    const sandboxApi = {
       makeSticker: () => {
            function fetchImage() {
                console.log('fetching image');
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
                fetch(url, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    // turn it into a blob
                    setSticker(URL.createObjectURL(response.blob()));
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                console.log('Success:', data);
            
            }
        }
        
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
