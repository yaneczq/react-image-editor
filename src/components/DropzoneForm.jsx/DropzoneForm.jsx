import { useDropzone } from "react-dropzone";
import { useState } from "react";

const DropzoneForm = () => {
    const [acceptedFiles, setAcceptedFiles] = useState([]);

    const onDrop = (files) => {
        setAcceptedFiles((prevFiles) => [
            ...prevFiles,
            ...files
        ]);
        alert("succes")
    };
    
    const {getInputProps, getRootProps} = useDropzone({
        noKeyboard: true,
        multiple: true,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg']
        },
        onDrop
    });

   

    const truncateFileName = (filename) => filename.length <= 12 ? filename : `${filename.substring(0, 9)}...`;
    /* 
    const truncateFileName = (filename) => {
        let maxLength = 12;
        if (filename.length <= maxLength)
            return filename;
            return `${filename.substring(0, maxLength - 3)}...`;
    }
    */

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
          {truncateFileName(file.path)} - {file.size} bytes
        </li>
      ));
    return (
        <div className="dropzone__container">

            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag n drop some files here, or click to select files</p>
                <em>Avaiable formats: jpg, png, bpm..</em>
            </div>
        
            <div>
                <p>{acceptedFileItems}</p>
            </div>
        
        </div>
    )
}

export default DropzoneForm;