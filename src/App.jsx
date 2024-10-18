import ImageCanvas from "./components/ImageCanvas";
import { useDropzone } from "react-dropzone";
import { useState, useEffect, useRef } from "react";
import { FiList, FiSliders, FiCornerDownLeft, FiUpload } from "react-icons/fi";
import {
  cleanupObjectURL,
  saveImagesToLocalStorage,
  loadImagesFromLocalStorage,
  defStyle,
} from "./utils/utils";

const App = () => {
  const [filter, setFilter] = useState(
    defStyle.light.concat(defStyle.color, defStyle.blur),
  );
  const canvasRef = useRef(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFileListOpen, setIsFileListOpen] = useState(false);

  useEffect(() => {
    loadImagesFromLocalStorage()
      .then((filesArray) => {
        setAcceptedFiles(filesArray);
        if (filesArray[0]) setImageSrc(URL.createObjectURL(filesArray[0]));
      })
      .catch((error) => console.error("Error loading saved images:", error));

    cleanupObjectURL();
  }, []);

  const onDrop = (files) => {
    const newFiles = files.filter(
      (file) =>
        !acceptedFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size,
        ),
    );
  
    if (newFiles.length === 0) {
      alert("No new files to add. Please check for duplicates.");
      return;
    }
  
    setAcceptedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      saveImagesToLocalStorage(updatedFiles);
      return updatedFiles;
    });
  
    if (newFiles[0]) {
      setImageSrc(URL.createObjectURL(newFiles[0]));
    }
  
    alert("Success!");
  };

  const onDropRejected = (rejectedFiles) => {
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((err) => {
        if (err.code === "file-invalid-type") {
          alert(
            `Error: File "${file.name}" is not a valid format. Please upload a .jpg or .png file.`,
          );
        }
      });
    });
  };

  const { getInputProps, getRootProps } = useDropzone({
    noKeyboard: true,
    multiple: 2,
    accept: { "image/png": [".png"], "image/jpg": [".jpg"] },
    onDropRejected,
    onDrop,
  });

  const onFilterChange = (e) => {
    const filterId = filter.findIndex((f) => f.name === e.target.name);
    if (filterId !== -1) {
      setFilter((prev) => {
        const newFilter = [...prev];
        newFilter[filterId].value = Number(e.target.value);
        return newFilter;
      });
    }
  };

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li
      className="list__item"
      key={`${file.name}-${file.size}-${file.lastModified}`} // Unique key
      onClick={() => setImageSrc(URL.createObjectURL(file))}
      style={{ cursor: "pointer" }}
    >
      <p>{file.name}</p>
      <p>{file.size} bytes</p>
    </li>
  ));

  const togglePanel = (setPanelState) => () => setPanelState((prev) => !prev);

  return (
    <div className="app">
      <nav className="navbar">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <FiUpload size={24} />
        </div>
        <div className="menu-icon" onClick={togglePanel(setIsFiltersOpen)}>
          {isFiltersOpen ? <FiCornerDownLeft /> : <FiSliders />}
        </div>
        <div className="menu-icon" onClick={togglePanel(setIsFileListOpen)}>
          {isFileListOpen ? <FiCornerDownLeft /> : <FiList />}
        </div>
      </nav>
  
      {imageSrc ? (
        <>
          <ImageCanvas
            filter={filter}
            imageSrc={imageSrc}
            canvasRef={canvasRef}
          />

          {/* Display filters only after image is loaded */}
          {isFiltersOpen && (
            <div className="filters-overlay">
              <div className="app__header">
                <h1>CSS Filters</h1>
                <p>Use sliders below to edit your image...</p>
              </div>

              <div className="slider__container">
                <h3>Light</h3>
                {defStyle.light.map((x, index) => (
                  <div className="slider" key={index}>
                    <div className="slider-header">
                      <label htmlFor={`customRange${index}`}>{x.name}</label>
                      <p>{x.value}%</p>
                    </div>
                    <input
                      type="range"
                      id={`customRange${index}`}
                      value={x.value}
                      min="0"
                      max="100"
                      name={x.name}
                      onChange={onFilterChange}
                    />
                  </div>
                ))}
              </div>
              <div className="slider__container">
                <h3>Color</h3>
                {defStyle.color.map((x, index) => (
                  <div className="slider" key={index}>
                    <div className="slider-header">
                      <label htmlFor={`customRange${index}`}>{x.name}</label>
                      <p>{x.value}%</p>
                    </div>
                    <input
                      type="range"
                      id={`customRange${index}`}
                      value={x.value}
                      min="0"
                      max="100"
                      name={x.name}
                      onChange={onFilterChange}
                    />
                  </div>
                ))}
              </div>
              <div className="slider__container">
                <h3>Blur</h3>
                {defStyle.blur.map((x, index) => (
                  <div className="slider" key={index}>
                    <div className="slider-header">
                      <label htmlFor={`customRange${index}`}>{x.name}</label>
                      <p>{x.value}%</p>
                    </div>
                    <input
                      type="range"
                      id={`customRange${index}`}
                      value={x.value}
                      min="0"
                      max="100"
                      name={x.name}
                      onChange={onFilterChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div {...getRootProps({ className: "empty__dropzone" })}>
          <div className="status__message">
            <p>No Files Uploaded</p>
            <em>Max 5MB - total upload limit</em>
          </div>
        </div>
      )}

      {isFileListOpen && (
        <div className="filelist-overlay">
          <div className="app__header">
            <h1>Browse your files</h1>
            <p>Please select an image...</p>
          </div>
          <div className="list">{acceptedFileItems}</div>
        </div>
      )}
    </div>
  );
};

export default App;
