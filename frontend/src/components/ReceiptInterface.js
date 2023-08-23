import { useRef, useState } from "react";
import ReceiptIcon from '@mui/icons-material/Receipt';
import Tesseract from 'tesseract.js';
import preprocessImage from '../preprocess';
import { motion } from 'framer-motion';
import EditableItems from "./EditableItems";
import { useAuthContext } from "../hooks/useAuthContext";

// const cv = require('../4.8.0_opencv.js');

const ReceiptInterface = () => {
    const { user } = useAuthContext();
    const [file, setFile] = useState("");
    const [data, setData] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const imageTypes = ['image/png', 'image/jpeg'];

    // // numpy shape function
    // const shape = (arr) => {
    //     var dim = [];
    //     for(;;) {
    //         dim.push(arr.length);
            
    //         if (Array.isArray(arr[0])) {
    //             arr = arr[0];
    //         } else {
    //             break;
    //         }
    //     }
    //     return dim;
    // }

    // imutils.order_points()
    // const order_points = (pts) => {

    // }

    // imutils.four_point_transform
    // const four_point_transform = (image, pts) => {
    //     rect = order_points(pts)
    //     (tl, tr, br, bl) = rect

    //     // compute the width of the new image, which will be the
    //     // maximum distance between bottom-right and bottom-left
    //     // x-coordiates or the top-right and top-left x-coordinates
    //     widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    //     widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    //     maxWidth = max(int(widthA), int(widthB))

    //     // compute the height of the new image, which will be the
    //     // maximum distance between the top-right and bottom-right
    //     // y-coordinates or the top-left and bottom-left y-coordinates
    //     heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    //     heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    //     maxHeight = max(int(heightA), int(heightB))

    //     // now that we have the dimensions of the new image, construct
    //     // the set of destination points to obtain a "birds eye view",
    //     // (i.e. top-down view) of the image, again specifying points
    //     // in the top-left, top-right, bottom-right, and bottom-left
    //     // order
    //     dst = np.array([
    //         [0, 0],
    //         [maxWidth - 1, 0],
    //         [maxWidth - 1, maxHeight - 1],
    //         [0, maxHeight - 1]], dtype="float32")

    //     // compute the perspective transform matrix and then apply it
    //     M = cv2.getPerspectiveTransform(rect, dst)
    //     warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    //     // return the warped image
    //     return warped;
    // }

    const convertToText = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(imageRef.current, 0, 0);
        ctx.putImageData(preprocessImage(canvas), 0, 0);

        const dataUrl = canvas.toDataURL(type);

        Tesseract.recognize(
            file, 'eng',
            {
                logger: m => setProgress(m.progress * 100)
            }
        )
        .catch (err => {
            console.error(err);
            setError(err);
        })
        .then (result => {
            console.log(result);
            let confidence = result.confidence;

            let data = result;
            setData(data);
            setFile(null);
            setProgress(0);
        });
        
        // const original = cv.imread(inputFile);
        // console.log("og", original);
        // console.log("shape of original", shape(original));
        // var image = JSON.parse(JSON.stringify(original));
        // const width = 500;
        // let {h, w} = shape(image).slice(0, 2);
        
        // // image = imutils.resize(image, width=500)
        // var r = width / w;
        // var dim = [width, h * r];
        // image = cv.resize(image, dim, 'inter');
        // var ratio = shape(original)[1] / shape(image)[1];

        // // Convert the image to grayscale, blur slightly, then apply edge detection
        // var grayScale = cv.cvtColor(image, cv.COLOR_BGR2GRAY);
        // var blurred = cv.GaussianBlur(grayScale, (5, 5), 0);
        // var edged = cv.Canny(blurred, 75, 180);

        // // Find contours in the edge map and sort them by size in descending order
        // var contours = cv.findContours(JSON.parse(JSON.stringify(edged)), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        // contours = (contours.length === 2) ? contours[0] : (contours.length === 3) ? contours[1] : contours;
        // contours.sort(cv.contourArea).reverse();

        // // Iniitialize a contour that corresponds to the receipt outline
        // var receiptContour = [];

        // // Loop over contours
        // for (var i = 0; i < contours.length; i++){
        //     let perimeter = cv.arcLength(contours[i], true);
        //     let approx = cv.approxPolyDP(contours[i], 0.02 * perimeter, true);

        //     // If approximated contour has four points, then we can assume we have found the outline of the receipt
        //     if (approx.length === 4) {
        //         receiptContour = approx;
        //         break;
        //     }
        // }

        // if (receiptContour.length === 0) {
        //     setError('Could not find receipt outline. Try taking a different picture');
        //     return;
        // }

        // var receipt = four_point_transform(original, receiptContour.reshape())
    }

    const changeHandler = (e) => {
        console.log('changed');

        let selected = e.target.files[0];

        if (selected && imageTypes.includes(selected.type)) {
            setFile(URL.createObjectURL(selected));
            setType(selected.type);
            setError('');
            // processImage(file);
            // Load the input image from disk, revise it, compute the ratio of the new width to the old width

            
            // const resizeRatio = width / (float) w; 
            // const dim = (width, (int) h * r);
            // image = cv.resize(image, dim, interpolation = inter);
            
            // const ratio = original.shape[1] / (float)(image.shape[1]);
            
            // // Convert the image to grayscale, blur slightly, then apply edge detection
            // var grayScale = cv.cvtColor(image, cv.COLOR_BGR2GRAY);
            // var blurred = cv.GaussianBlur(grayScale, (5, 5, null), 0);
            // var edged = cv.Canny(blurred, 75, 180);

            // // Add cv.imshow to display the image on frontend for debugging purposes

            // var contours = cv.findContours(edged.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            // //contours = imutils.grab_contours(contours);
            // //contours = sorted(contours, key=cv.contourArea, reverse=True)
            
            // // Initialize a contour that corresponds to the receipt outline
            // var receiptContour = null;

            // // Loop over contours
        } else {
            setFile(null);
            setError('Please select an image file (png or jpeg)');
        }
    }

    return (
        <div>
            <form className="receipt-interface" onSubmit={convertToText}>
                <div className="receipt-input">
                    <label>Import Items from Receipt <ReceiptIcon /></label>
                    <input type="file" onChange={changeHandler} />
                    <div className="output">
                        { file && <img className="receipt-image" src={file} alt="receipt input" ref={imageRef} /> }
                        { file && <canvas ref={canvasRef} width={500} height={800}></canvas> }
                        { error && <div className="error">{ error }</div> }
                        { file && <div>{ file.name }</div> }
                    </div>
                </div>
                <button type="submit"> Process </button>
                { file && <motion.div className="progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: progress + '%'}}
                ></motion.div> }
                {error && <div className='error'>{error}</div>}
            </form>
            { data && <EditableItems extractedData={data} /> }
        </div>
    )
}

export default ReceiptInterface;