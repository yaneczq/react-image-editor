import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import ImageCanvas from "../ImageCanvas/ImageCanvas";
import { BarLoader } from "react-spinners";

import { saveImagesToLocalStorage, loadImagesFromLocalStorage, resetStorageAndReload } from "../../utils/utils";

const DropzoneForm = () => {
    // State to hold the list of accepted files
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    // State to hold the URL of the currently displayed image
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load saved images from local storage on component mount
    useEffect(() => {
        loadImagesFromLocalStorage().then(filesArray => {
            setAcceptedFiles(filesArray);
            if (filesArray[0]) {
                const url = URL.createObjectURL(filesArray[0]);
                setImageSrc(url);
            }
        }).catch(error => {
            console.error('Error loading saved images:', error);
        });
    }, []);

    // Function to handle files dropped by the user
    const onDrop = (files) => {
        setLoading(true); // Start loading
        new Promise((resolve) => {
            setTimeout(() => {
                // Update the list of accepted files
                setAcceptedFiles(prevFiles => {
                    const updatedFiles = [...prevFiles, ...files];
                    saveImagesToLocalStorage(updatedFiles);
                    return updatedFiles;
                });
                
                if (files[0]) {
                    const url = URL.createObjectURL(files[0]);
                    setImageSrc(url);
                }

                resolve();
            }, 1000);
        }).then(() => {
            setLoading(false);
            alert("Succes")
        });
    };

    // Configuration for react-dropzone
    const { getInputProps, getRootProps } = useDropzone({
        noKeyboard: true, // Disable keyboard interactions
        multiple: true, // Allow multiple files
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg']
        },
        onDrop // Assign the onDrop function to handle file drops
    });

    // Function to handle selecting an image from the list
    const handleImageSelect = (file) => {
        const url = URL.createObjectURL(file);
        setImageSrc(url);
    };

    // // const truncateFileName = (fileName) => {
    // //     // Ensure fileName is a string
    // //     if (typeof fileName !== 'string') return '';


    // //     const maxLength = 12;
    // //     if (fileName.length <= maxLength) return fileName;

    // //     return `${fileName.substring(0, maxLength - 3)}...`;
    // //   };

    // // const truncateFileName = (fileName) => 
    //     typeof fileName === 'string' && fileName.length > 12 
    //     ? `${fileName.slice(0, 9)}...` 
    //     : fileName || '';
    
        


    // Generate a list of uploaded files with clickable items to select an image
    
    
    
    const acceptedFileItems = acceptedFiles.map((file, index) => (

        /* key={file.path || index} 

        Unique Key: Using file.path as a key is ideal if it's guaranteed to be unique. 
        If {file.path} isn't unique, using the index of the item in the array can be a 
        fallback, though it’s less ideal since it can lead to issues if the list changes 
        order.Fallback to Index: If you use the index as a key, be aware that it can cause
        problems if the list is reordered or items are added/removed. It’s generally better
        to use a unique identifier from the data itself. */
        
        <li key={file.path || index} onClick={() => handleImageSelect(file)} style={{ cursor: 'pointer' }}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <>
            <div className="dropzone__container">
                {/* Dropzone area for file upload */}
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag and drop some files here, or click to select files</p>
                    <em>Available formats: jpg, png, bpm..</em>
                </div>
            </div>

            <div className="image-browser">
                    <h2>Image Browser</h2>
                    {/* Display the list of accepted files */}
                    <ul>{acceptedFileItems}</ul>
            </div>

            <>
                {loading ? (
                    <BarLoader color="#fff" loading={loading} size={50}/>
                ) : (
                    imageSrc && <ImageCanvas imageSrc={imageSrc} />
                )}
            </>

            <button onClick={resetStorageAndReload}>
                Reset Storage
            </button>
        </>
    );
};

export default DropzoneForm;
