import { useDropzone } from "react-dropzone";
import { useState } from "react";


import { CgDanger } from "react-icons/cg";


const Panel = () => {

    const [acceptedFiles, setAcceptedFiles] = useState([]);

    const onDrop = (files) => {
        setAcceptedFiles(prevFiles => [...prevFiles, ...files]);
        alert("succes");
    }

    // set dropzone
    const {getRootProps, getInputProps} = useDropzone({
        noKeyboard: true,
        multiple: true,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg']
        },
        onDrop,
    })

    const acceptedFileItems = acceptedFiles.map((file) => (

        <li className="list__item" key={file.path} >
            <p>{file.path}</p> | <em>{file.size}kb</em>
        </li>
    ))

    return (
        <div className="panel">

            <div className="panel__uploader">

                <div className="app__header">
                    <h1>Drag & Drop an image</h1>
                    <p>Available formats: jpg, jpeg, png...</p>
                </div>

                <div {...getRootProps({ className: 'dropzone' })}>
                    {/* Probably will need a name change soon! */}
                        <input {...getInputProps()} />
                        <img width="36" height="44" src="public/icons/app__icon.svg" alt="file-icon" />
                        <div className="status__message">
                            <p>Drag and Drop your file(s) or <strong>browse</strong></p>
                            <em>Max 5MB - total upload limit</em>
                        </div>
                </div>

            </div>

            <div className="panel__browser">

                <div className="app__header">
                    <h1>Browse your files</h1>
                    <p>Please select an image...</p>
                </div>

                <div className="list__container">
                    {acceptedFileItems}
                </div>
            </div>

            <div className="clean__storage">
                <div className="app__info">
                    <CgDanger />
                    <p>Remove files and clear local storage</p>
                </div>
                <button>Clean Storage</button>
            </div>

        </div>
    )
}

export default Panel;



