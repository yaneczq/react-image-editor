import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import ImageCanvas from "../ImageCanvas/ImageCanvas";
import { BarLoader } from "react-spinners";

import { saveImagesToLocalStorage, loadImagesFromLocalStorage, resetStorageAndReload } from "../../utils/utils";
const defStyle = [
    { id: 0, name: "Grayscale", value: 0 },
    { id: 1, name: "Sepia", value: 0 },
    { id: 2, name: "Opacity", value: 100 },
    { id: 3, name: "Invert", value: 0 },
    { id: 4, name: "Hue-Rotate", value: 0 },
    { id: 5, name: "Brightness", value: 20 },
    { id: 6, name: "Contrast", value: 20 },
    { id: 7, name: "Saturate", value: 10 },
    { id: 8, name: "Blur", value: 0 }
  ];
const utilityFunc = (url) => {
    return () => {
        if (url) {
            URL.revokeObjectURL(url);
        }
    };
}



const DropzoneForm = () => {
    const [filter, setFilter] = useState(defStyle);



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

        utilityFunc()
    }, []);

    // // Function to handle files dropped by the user
    // const onDrop = (files) => {
    //     setLoading(true); // Start loading
    //     new Promise((resolve) => {
    //         setTimeout(() => {
    //             // Update the list of accepted files
    //             setAcceptedFiles(prevFiles => {
    //                 const updatedFiles = [...prevFiles, ...files];
    //                 saveImagesToLocalStorage(updatedFiles);
    //                 return updatedFiles;
    //             });
                
    //             if (files[0]) {
    //                 const url = URL.createObjectURL(files[0]);
    //                 setImageSrc(url);
    //             }

    //             resolve();
    //         }, 1000);
    //     }).then(() => {
    //         setLoading(false);
    //         alert("Succes")
    //     });
    // };

    const onDrop = (files) => {
        setLoading(true); // Start loading
    
        new Promise((resolve) => {
            setTimeout(() => {
                const newFiles = files.filter((file) => {
                    // Check for duplicates based on file name or size
                    const isDuplicate = acceptedFiles.some((existingFile) => 
                        existingFile.name === file.name && existingFile.size === file.size
                    );
    
                    if (isDuplicate) {
                        alert(`File "${file.name}" is a duplicate and will not be added.`);
                        return false; // Exclude duplicate files
                    }
    
                    return true; // Include non-duplicate files
                });
    
                // If no valid files, return early
                if (newFiles.length === 0) {
                    setLoading(false);
                    return;
                }
    
                // Update the list of accepted files
                setAcceptedFiles((prevFiles) => {
                    const updatedFiles = [...prevFiles, ...newFiles];
                    saveImagesToLocalStorage(updatedFiles);
                    return updatedFiles;
                });
    
                if (newFiles[0]) {
                    const url = URL.createObjectURL(newFiles[0]);
                    setImageSrc(url);
                }
    
                resolve();
            }, 1000);
        }).then(() => {
            setLoading(false);
            alert("Success!");
        });
    };
    

    const onDropRejected = (rejectedFiles) => {
        rejectedFiles.forEach(rejected => {
            const { file, errors } = rejected; // Properly access file and errors
    
            errors.forEach(err => {
                if (err.code === "file-invalid-type") {
                    alert(`Error: File "${file.name}" is not a valid format. Please upload a .jpg or .png file.`);
                }
                // Handle other errors here (if any)
            });
        });
    };
    

    // Configuration for react-dropzone
    const { getInputProps, getRootProps} = useDropzone({
        noKeyboard: true, // Disable keyboard interactions
        multiple: true, // Allow multiple files
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg']
        },
        onDropRejected,
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
    

    
    function onFilterChange(e) {
        const filterName = e.target.name;
        const filterId = filter.findIndex((f) => f.name === filterName);
    
        if (filterId !== -1) {
            const newFilter = [...filter];
            // Number(e.target.value) converts the slider value from a string to a number before updating the state.
            newFilter[filterId] = { ...newFilter[filterId], value: Number(e.target.value) }; // Convert value to a number
            setFilter(newFilter);
        }
    }
    
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


            <div className="image-editor">

                <div className="image-browser">
                        <h2>Image Browser</h2>
                        {/* Display the list of accepted files */}
                        <ul>{acceptedFileItems}</ul>
                </div>

                <div className="display">
                    {loading ? (
                        <BarLoader color="#fff" loading={loading} size={50}/>
                    ) : (
                        <div className="editor-tools">
                            {imageSrc && <ImageCanvas filters={filter} imageSrc={imageSrc} />}
                            {filter.map((x, index) => (
                            <div className="slider" key={index}>
                                <span
                                htmlFor="customRange1"
            
                                >
                                {x.name}
                                </span>
                                <input
                                type="range"
                                id="customRange1"
                                value={x.value}
                                min="0"
                                max="100"
                                name={x.name}
                                onChange={onFilterChange}
                                />
                            </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <button onClick={resetStorageAndReload}>
                Reset Storage
            </button>
        </>
    );
};

export default DropzoneForm;
