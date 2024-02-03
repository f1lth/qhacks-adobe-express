import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, constants } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

async function start() {
    const sandboxApi = {
        createImage: async function(blob, size = {}) {
            console.log("entered createImage function");
            const insertionParent = editor.context.insertionParent;
            const bitmapImage = await editor.loadBitmapImage(blob);
            // Edits following an asynchronous wait need to be queued to run at a safe time
            await editor.queueAsyncEdit(() => {
                let { width, height } = size;
                if (!width || !height) {
                    width = 200;
                    height = 200;
                }
                const mediaContainerNode = editor.createImageContainer(bitmapImage, { initialSize: { width, height } });
                insertionParent.children.append(mediaContainerNode);
            });
            return "**** Image created successfully ****"
        }
    }

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
