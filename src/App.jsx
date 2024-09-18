// import { useState } from 'react';
// import Form from './components/Form/Form';
// import Panel from './components/Form/Panel'

// const App = () => {
//     const [setUploadedFiles] = useState([]);

//     const handleFilesAccepted = (files) => {
//         // Debugging: log the files when accepted
//         console.log('Files accepted in DropzoneForm:', files);

//         setUploadedFiles(files);
//     };

//     return (
//             <Panel />
//             // <Form onFilesAccepted={handleFilesAccepted} />
//     )
// };

// export default App;

import ImageCanvas from "./components/ImageCanvas/ImageCanvas";

import { useDropzone } from "react-dropzone";
import { useState, useEffect, useRef } from "react";
import { BarLoader } from "react-spinners";
import { FiAlertCircle, FiDownload, FiTrash2, FiPlusCircle, FiRefreshCcw } from "react-icons/fi";
import {
  cleanupObjectURL,
  downloadFilteredImage,
  saveImagesToLocalStorage,
  loadImagesFromLocalStorage,
  resetStorageAndReload,
} from "./utils/utils";

const defStyle = [
  { id: 0, name: "Grayscale", value: 0 },
  { id: 1, name: "Sepia", value: 0 },
  { id: 2, name: "Opacity", value: 100 },
  { id: 3, name: "Invert", value: 0 },
  { id: 4, name: "Hue-Rotate", value: 0 },
  { id: 5, name: "Brightness", value: 100 },
  { id: 6, name: "Contrast", value: 100 },
  { id: 7, name: "Saturate", value: 25 },
  { id: 8, name: "Blur", value: 0 },
];

const App = () => {
  const [filter, setFilter] = useState(defStyle);
  const canvasRef = useRef(null);

  const [savedPresets, setSavedPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const saveCurrentPreset = () => {
    const currentSetup = { id: savedPresets.length + 1, filters: filter };
    const updatedPresets = [...savedPresets, currentSetup];
    setSavedPresets(updatedPresets);
    localStorage.setItem("savedPresets", JSON.stringify(updatedPresets));
  };

  // Function to delete a preset
  const deletePreset = (presetId) => {
    const updatedPresets = savedPresets.filter(
      (preset) => preset.id !== presetId,
    );
    setSavedPresets(updatedPresets);
    localStorage.setItem("savedPresets", JSON.stringify(updatedPresets));
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
      const presets = JSON.parse(localStorage.getItem("savedPresets")) || [];
      setSavedPresets(presets);
    };

    loadImagesFromLocalStorage()
      .then((filesArray) => {
        setAcceptedFiles(filesArray);
        if (filesArray[0]) {
          const url = URL.createObjectURL(filesArray[0]);
          setImageSrc(url);
        }
      })
      .catch((error) => {
        console.error("Error loading saved images:", error);
      });

    loadPresets();
    cleanupObjectURL();
  }, []);

  const onDrop = (files) => {
    setLoading(true); // Start loading

    new Promise((resolve) => {
      setTimeout(() => {
        const newFiles = files.filter((file) => {
          // Check for duplicates based on file name or size
          const isDuplicate = acceptedFiles.some(
            (existingFile) =>
              existingFile.name === file.name &&
              existingFile.size === file.size,
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
      navigator.storage.estimate().then(estimate => {
        console.log(`Quota: ${estimate.quota}`);
        console.log(`Usage: ${estimate.usage}`);
      });
      alert("Success!");
    });
  };

  const onDropRejected = (rejectedFiles) => {
    rejectedFiles.forEach((rejected) => {
      const { file, errors } = rejected;

      errors.forEach((err) => {
        if (err.code === "file-invalid-type") {
          alert(
            `Error: File "${file.name}" is not a valid format. Please upload a .jpg or .png file.`,
          );
        }
        // Handle other errors here (if any)
      });
    });
  };

  // Configuration for react-dropzone
  const { getInputProps, getRootProps } = useDropzone({
    noKeyboard: true,
    multiple: 2,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
    },
    onDropRejected,
    onDrop,
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
      newFilter[filterId] = {
        ...newFilter[filterId],
        value: Number(e.target.value),
      };
      setFilter(newFilter);
    }
  };

  const resetFilter = () => {
    setFilter(defStyle);
  };

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li
      className="list__item"
      key={file.name}
      onClick={() => handleImageSelect(file)}
      style={{ cursor: "pointer" }}
    >
      {file.name} | {file.size} bytes
    </li>
  ));
 
  return (
    <div className="app">
        
      <div className="panel">

        <div className="panel__uploader">

          <div className="app__header">
            <h1>Drag & Drop an image</h1>
            <p>Available formats: jpg, jpeg, png...</p>
          </div>
    
          <div {...getRootProps({ className: "dropzone" })}>
            {/* Probably will need a name change soon! */}
            <input {...getInputProps()} />
            <img
              width="36"
              height="44"
              src="public/icons/app__icon.svg"
              alt="file-icon"
            />
            <div className="status__message">
              <p>
                Drag and Drop your file(s) or <strong>browse</strong>
              </p>
              <em>Max 5MB - total upload limit</em>
            </div>

          </div>

          <div className="app__info">
            <FiAlertCircle size={12}/>
            <p>Remove files and clear local storage</p>
          </div>
        </div>

        <div className="panel__browser">
          <div className="app__header">
            <h1>Browse your files</h1>
            <p>Please select an image...</p>
          </div>

          <div className="list__container">{acceptedFileItems}</div>
        </div>

        <div className="clean__storage">
          <button onClick={resetStorageAndReload}>Clean Storage</button>
          <div className="app__info">
          <FiAlertCircle size={12}/>
            <p>Remove files and clear local storage</p>
          </div>
        </div>
      </div>

      {loading ? (
        <BarLoader color="#ff0000" loading={loading} size={50} />
      ) : (
        <div className="canvas__editor">

        <div className="canvas">
                    {imageSrc && (
                    <ImageCanvas
                    filter={filter}
                    imageSrc={imageSrc}
                    canvasRef={canvasRef}
                    />
                    )}
        </div>

        <div className="canvas__controls">

              <div className="app__header" onClick={resetFilter}>
                <h1>Edit image</h1>
                <p>You can reset styles on the right.</p>
              </div>

            <div className="tools">
                <button className="preset__btn" onClick={resetFilter}><FiRefreshCcw /></button>
                <select
                value={selectedPreset?.id || ""}
                onChange={(e) => {
                    const selectedId = parseInt(e.target.value, 10);
                    const preset = savedPresets.find((p) => p.id === selectedId);
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
                <button className="preset__btn" onClick={saveCurrentPreset}>
                    <FiPlusCircle size={16}/>
                </button>
                <button className="preset__btn" onClick={() => deletePreset(selectedPreset?.id)}>
                    <FiTrash2 size={16}/>
                </button>
            </div>

            <div className="slider__container">
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
                    <p>{x.value}</p>
                </div>
                ))}
            </div>

            <div className="user-actions">
                <button onClick={() => downloadFilteredImage(canvasRef)}>
                Download <FiDownload size={20}/>
                </button>
            </div>
        </div>

        </div>
      )}
    </div>
  );
};

export default App;
