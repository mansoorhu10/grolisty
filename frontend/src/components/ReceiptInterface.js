import { useRef, useState } from "react";
import ReceiptIcon from '@mui/icons-material/Receipt';
import Tesseract from 'tesseract.js';
import preprocessImage from '../preprocess';
import { motion } from 'framer-motion';
import EditableItems from "./EditableItems";
import { useAuthContext } from "../hooks/useAuthContext";

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
            let confidence = result.data.confidence;

            let data = result;
            console.log("text", data.data.text);
            console.log("confidence", confidence);
            setData(data);
            setFile(null);
            setProgress(0);
        });
    }

    const changeHandler = (e) => {
        console.log('changed');

        let selected = e.target.files[0];

        if (selected && imageTypes.includes(selected.type)) {
            setFile(URL.createObjectURL(selected));
            setType(selected.type);
            setError('');
            
        } else {
            setFile(null);
            setError('Please select an image file (png or jpeg)');
        }
    }

    return (
        <div>
            <form className="receipt-interface" onSubmit={convertToText}>
                <div className="receipt-input">
                    <h3><label>Import Items from Receipt  <i className="material-icon"><ReceiptIcon /></i></label></h3>
                    <input type="file" onChange={changeHandler} multiple={false} />
                    <div className="output">
                        { file && <img className="receipt-image" src={file} alt="receipt input" ref={imageRef} /> }
                        { file && <canvas className="receipt-image" ref={canvasRef} width={500} height={800}></canvas> }
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