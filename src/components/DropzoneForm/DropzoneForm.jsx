import { useDropzone } from "react-dropzone";
import { useState } from "react";
import ImageCanvas from "../ImageCanvas/ImageCanvas";
import { BarLoader } from "react-spinners";

const DropzoneForm = () => {
    // State to hold the list of accepted files
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    // State to hold the URL of the currently displayed image
    const [imageSrc, setImageSrc] = useState(null);

    const [loading, setLoading] = useState(false);

    // Function to handle files dropped by the user
    const onDrop = (files) => {
        setLoading(true); // Start loading
        new Promise((resolve) => {
            setTimeout(() => {
                // Update the list of accepted files
                setAcceptedFiles((prevFiles) => [...prevFiles, ...files]);
                
                // If there are files, set the first one as the initial image to display
                if (files[0]) {
                    const url = URL.createObjectURL(files[0]);
                    setImageSrc(url);
                }

                resolve(); // Promise resolves after 2s
            }, 1000);
        }).then(() => {
            setLoading(false);
            console.log('Succes');
            
        })

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

    // Function to truncate filenames longer than 12 characters
    const truncateFileName = (filename) => filename.length <= 12 ? filename : `${filename.substring(0, 9)}...`;

    // Generate a list of uploaded files with clickable items to select an image
    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path} onClick={() => handleImageSelect(file)} style={{ cursor: 'pointer' }}>
            {truncateFileName(file.path)} - {file.size} bytes
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
                    <h3>Image Browser</h3>
                    {/* Display the list of accepted files */}
                    <ul>{acceptedFileItems}</ul>
                </div>
            <div className="image-canvas">
                {loading ? (
                    <BarLoader color="#fff" loading={loading} size={50}/>
                ) : (
                    imageSrc && <ImageCanvas imageSrc={imageSrc} />
                )};
            </div>
        </>
    );
};

export default DropzoneForm;
