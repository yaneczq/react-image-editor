import "./Navbar.scss";
// import UploadButton from "../UploadButton/UploadButton.jsx"
import {
  FiList,
  FiSliders,
  FiCornerDownLeft,
  FiUpload,
  FiRefreshCcw,
  FiPlusCircle,
  FiTrash2,
} from "react-icons/fi";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveImagesToLocalStorage, defStyle } from "../../utils/utils.js";

const Navbar = () => {
  const [setLoading] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [setImageSrc] = useState(null);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filter, setFilter] = useState(defStyle);
  const [savedPresets, setSavedPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const resetFilter = () => setFilter(defStyle);

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
  const onDrop = (files) => {
    setLoading(true);

    const newFiles = files.filter(
      (file) =>
        !acceptedFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size,
        ),
    );

    if (newFiles.length === 0) {
      alert("No new files to add. Please check for duplicates.");
      setLoading(false);
      return;
    }

    setAcceptedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      saveImagesToLocalStorage(updatedFiles); // Ensure this works correctly
      return updatedFiles;
    });

    // Set imageSrc only if newFiles has at least one file
    if (newFiles[0]) {
      setImageSrc(URL.createObjectURL(newFiles[0]));
    }
    setLoading(false);
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

  const togglePanel = (setPanelState) => () => setPanelState((prev) => !prev);
  const saveCurrentPreset = () => {
    const updatedPresets = [
      ...savedPresets,
      { id: savedPresets.length + 1, filters: filter },
    ];
    setSavedPresets(updatedPresets);
    localStorage.setItem("savedPresets", JSON.stringify(updatedPresets));
  };

  const deletePreset = (presetId) => {
    const updatedPresets = savedPresets.filter(
      (preset) => preset.id !== presetId,
    );
    setSavedPresets(updatedPresets);
    localStorage.setItem("savedPresets", JSON.stringify(updatedPresets));
    if (selectedPreset?.id === presetId) setSelectedPreset(null);
  };

  const loadPreset = (preset) => {
    setFilter(preset.filters);
    setSelectedPreset(preset);
  };

  return (
    <>
      <nav className="navbar">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <FiUpload size={32} />
        </div>
        <div className="menu-icon" onClick={togglePanel(setIsFiltersOpen)}>
          {isFiltersOpen ? <FiCornerDownLeft /> : <FiSliders />}
        </div>
        <div className="menu-icon" onClick={togglePanel(setIsFileListOpen)}>
          {isFileListOpen ? <FiCornerDownLeft /> : <FiList />}
        </div>
      </nav>

      {isFiltersOpen && (
        <div
          className="filters-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: "80%",
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div className="app__header" onClick={resetFilter}>
            <h1>Edit image</h1>
            <p>You can reset styles on the right.</p>
          </div>

          <div className="tools">
            <button className="preset__btn" onClick={resetFilter}>
              <FiRefreshCcw />
            </button>
            <select
              value={selectedPreset?.id || ""}
              onChange={(e) =>
                loadPreset(
                  savedPresets.find(
                    (p) => p.id === parseInt(e.target.value, 10),
                  ),
                )
              }
            >
              <option value="">Select a Preset</option>
              {savedPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  Preset {preset.id}
                </option>
              ))}
            </select>
            <button className="preset__btn" onClick={saveCurrentPreset}>
              <FiPlusCircle size={16} />
            </button>
            <button
              className="preset__btn"
              onClick={() => deletePreset(selectedPreset?.id)}
            >
              <FiTrash2 size={16} />
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
        </div>
      )}

      {isFileListOpen && (
        <div
          className="filelist-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: "80%",
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Browse your files</h1>
          <p>Please select an image...</p>
          <div className="list">{acceptedFileItems}</div>
        </div>
      )}
    </>
  );
};

export default Navbar;
