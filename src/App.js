import { useState } from "react";
import "./App.css";
import Tesseract from "tesseract.js";

function App() {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [text, setText] = useState('')

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];

    if(!file) return

    setFileName(file.name);

    const reader = new FileReader();

    if(file.type.startsWith('text/')){
      reader.onload = (event) => {
        const text = event.target.result;
        setFileContent(text)
        setFilePreview('')
      }
      reader.readAsText(file)
    }
    else if(file.type.startsWith('image/') || file.type === 'application/pdf'){
      reader.onload = (event) => {
        setFilePreview(event.target.result);
        performOCR(reader.result)
      }
      reader.readAsDataURL(file)
      const performOCR = async(img) => {
        const {data: {text} } = await Tesseract.recognize(img, 'eng')
        setFileContent(text)
      }
    }
    else{
      setFileContent('Unsupported File Format');
      setFilePreview('')
    }
  }
  console.log(text)
  return (
    <div className="App">
      <h1>File Upload and Preview</h1>
      <div>
        <input
          type="file"
          accept=".txt, .csv, .json, image/*, application/pdf"
          onChange={fileChangeHandler}
        />
      </div>
      {fileName && (
        <div>
          <h2>Uploaded File: {fileName}</h2>
        </div>
      )}
      {fileContent && (
        <div>
        <h2>File Content: </h2>
        <pre>{fileContent}</pre>
        </div>
      )}
      {filePreview && (
        <div>
        <h2>File Preview:</h2>
        {filePreview.includes('application/pdf') ? (
          <embed src={filePreview} type="application/pdf"/>
        ) : (
          <div>
          <img src={filePreview} alt="preview"/>
          <h5>{fileContent}</h5>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default App;
