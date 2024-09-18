import { useDropzone } from "react-dropzone";
import { useState, useEffect, useRef } from "react";
import ImageCanvas from "../ImageCanvas/ImageCanvas";
import { BarLoader } from "react-spinners";

import { cleanupObjectURL, downloadFilteredImage, saveImagesToLocalStorage, loadImagesFromLocalStorage, resetStorageAndReload } from "../../utils/utils";

const defStyle = [
    { id: 0, name: "Grayscale", value: 0 },
    { id: 1, name: "Sepia", value: 0 },
    { id: 2, name: "Opacity", value: 100 },
    { id: 3, name: "Invert", value: 0 },
    { id: 4, name: "Hue-Rotate", value: 0 },
    { id: 5, name: "Brightness", value: 100 },
    { id: 6, name: "Contrast", value: 100 },
    { id: 7, name: "Saturate", value: 25 },
    { id: 8, name: "Blur", value: 0 }
];


const DropzoneForm = () => {
    const [filter, setFilter] = useState(defStyle);
    const canvasRef = useRef(null);
    
    const [savedPresets, setSavedPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState(null);

    const saveCurrentPreset = () => {
        const currentSetup = { id: savedPresets.length + 1, filters: filter };
        const updatedPresets = [...savedPresets, currentSetup];
        setSavedPresets(updatedPresets);
        localStorage.setItem('savedPresets', JSON.stringify(updatedPresets));
    };

    // Function to delete a preset
    const deletePreset = (presetId) => {
        const updatedPresets = savedPresets.filter(preset => preset.id !== presetId);
        setSavedPresets(updatedPresets);
        localStorage.setItem('savedPresets', JSON.stringify(updatedPresets));
        if (selectedPreset?.id === presetId) {
            setSelectedPreset(null);
        }
    };

    // Function to load a saved preset
    const loadPreset = (preset) => {
        setFilter(preset.filters);
        setSelectedPreset(preset);
    };

    

    // State to hold the list of accepted files
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    // State to hold the URL of the currently displayed image
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load saved images from local storage on component mount
    useEffect(() => {

        const loadPresets = () => {
            const presets = JSON.parse(localStorage.getItem('savedPresets')) || [];
            setSavedPresets(presets);
        };

        loadImagesFromLocalStorage().then(filesArray => {
            setAcceptedFiles(filesArray);
            if (filesArray[0]) {
                const url = URL.createObjectURL(filesArray[0]);
                setImageSrc(url);
            }
        }).catch(error => {
            console.error('Error loading saved images:', error);
        });

        loadPresets()
        cleanupObjectURL()
    }, []);

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
            const { file, errors } = rejected;
    
            errors.forEach(err => {
                if (err.code === "file-invalid-type") {
                    alert(`Error: File "${file.name}" is not a valid format. Please upload a .jpg or .png file.`);
                }
                // Handle other errors here (if any)
            });
        });
    };

    // Configuration for react-dropzone
    const { getInputProps, getRootProps } = useDropzone({
        noKeyboard: true,
        multiple: true,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg']
        },
        onDropRejected,
        onDrop
    });

    const handleImageSelect = (file) => {
        const url = URL.createObjectURL(file);
        setImageSrc(url);
    };

    const onFilterChange = (e) => {
        const filterName = e.target.name;
        const filterId = filter.findIndex((f) => f.name === filterName);

        if (filterId !== -1) {
            const newFilter = [...filter];
            newFilter[filterId] = { ...newFilter[filterId], value: Number(e.target.value) };
            setFilter(newFilter);
        }
    }

    const acceptedFileItems = acceptedFiles.map((file, index) => (
        <li key={file.path || index} onClick={() => handleImageSelect(file)} style={{ cursor: 'pointer' }}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div className="form">
            {/* Dropzone area for file upload */}
            <div {...getRootProps({ className: 'form__dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
                <em>Available formats: jpg, png, bpm..</em>
            </div>

            <div className="form__browser">
                <h1>Image Browser</h1>
                <ul>{acceptedFileItems}</ul>
            </div>

            {loading ? (
                <BarLoader color="#fff" loading={loading} size={50} />
            ) : (
                <div className="canvas__editor">
                    {imageSrc && <ImageCanvas filter={filter} imageSrc={imageSrc} canvasRef={canvasRef} />}
                    <div className="canvas__editor-slider-container">
                        {filter.map((x, index) => (
                            <div className="slider" key={index}>
                                <label htmlFor={`customRange${index}`}>{x.name}</label>
                                <input
                                    type="range"
                                    id={`customRange${index}`}
                                    value={x.value}
                                    min="0"
                                    max="100"
                                    name={x.name}
                                    onChange={onFilterChange}
                                />
                                {x.value}
                            </div>
                        ))}
                    </div>

                    <div className="canvas__editor-actions">
                        <button onClick={resetStorageAndReload}>Reset Storage</button>
                        <button onClick={() => downloadFilteredImage(canvasRef)}>
                            Download Image with Filters
                        </button>
                    </div>


                    <button onClick={saveCurrentPreset}>Save Preset</button>
                    <div className="preset-controls">
                            <select
                                value={selectedPreset?.id || ''}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value, 10);
                                    const preset = savedPresets.find(p => p.id === selectedId);
                                    if (preset) {
                                        loadPreset(preset);
                                    }
                                }}
                            >
                                <option value="">Select a Preset</option>
                                {savedPresets.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                        Preset {preset.id}
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => deletePreset(selectedPreset?.id)}>
                                Delete Selected Preset
                            </button>
                        </div>
                    
                

                </div>
            )}
        </div>
    );
};

export default DropzoneForm;
