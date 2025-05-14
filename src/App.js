import { useState } from "react";
import Tesseract from "tesseract.js";
import classes from "./App.module.css";

function App() {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [loader, setLoader] = useState(false);

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    if (file.type.startsWith("text/")) {
      reader.onload = (event) => {
        const text = event.target.result;
        setFileContent(text);
        setFilePreview("");
      };
      reader.readAsText(file);
    } else if (
      file.type.startsWith("image/") ||
      file.type === "application/pdf"
    ) {
      reader.onload = (event) => {
        setFilePreview(event.target.result);
        if (file.type.startsWith("image/")) {
          setLoader(true);
          performOCR(reader.result);
        }
      };
      reader.readAsDataURL(file);
      const performOCR = async (img) => {
        const {
          data: { text },
        } = await Tesseract.recognize(img, "eng");
        setFileContent(text);
        setLoader(false);
      };
    } else {
      setFileContent("Unsupported File Format");
      setFilePreview("");
    }
  };
  return (
    <div className={classes.app}>
      <h1 className=" p-3">File Upload and Preview</h1>
      <div className={classes.inputDiv}>
        <input
          className={classes.input}
          type="file"
          accept=".txt, .csv, .json, image/*, application/pdf"
          onChange={fileChangeHandler}
        />
      </div>
      {fileName && (
        <div className={classes.fileUpload}>
          <h2>Uploaded File: </h2>
          {fileName}
        </div>
      )}
      {loader && <h1 className="m-3">File Content Loading.....</h1>}
      {fileContent && (
        <div className={classes.fileContent}>
          <h2>File Content: </h2>

          <pre>{fileContent}</pre>
        </div>
      )}
      {filePreview && (
        <div className="m-3">
          <h2 className="m-3">File Preview:</h2>
          {filePreview.includes("application/pdf") ? (
            <embed className={classes.filePreviewPdf} src={filePreview} type="application/pdf" />
          ) : (
            <div>
              <img classname={classes.filePreviewImg} src={filePreview} alt="preview" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
