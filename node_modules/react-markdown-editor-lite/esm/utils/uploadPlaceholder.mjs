import { nanoid } from "nanoid";
import decorate from "./decorate.mjs";
import { isPromise } from "./tool.mjs";
function getUploadPlaceholder(file, onImageUpload) {
    const placeholder = decorate('', 'image', {
        target: `Uploading_${nanoid()}`,
        imageUrl: ''
    }).text;
    const uploaded = new Promise((resolve)=>{
        let isCallback = true;
        const handleUploaded = (url)=>{
            if (isCallback) console.warn('Deprecated: onImageUpload should return a Promise, callback will be removed in future');
            resolve(decorate('', 'image', {
                target: file.name,
                imageUrl: url
            }).text);
        };
        const upload = onImageUpload(file, handleUploaded);
        if (isPromise(upload)) {
            isCallback = false;
            upload.then(handleUploaded);
        }
    });
    return {
        placeholder,
        uploaded
    };
}
const uploadPlaceholder = getUploadPlaceholder;
export { uploadPlaceholder as default };
