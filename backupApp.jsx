import ImageCanvas from "./components/ImageCanvas";
import { useDropzone } from "react-dropzone";
import { useState, useEffect, useRef } from "react";
import { BarLoader } from "react-spinners";
import {
  FiList,
  FiSliders,
  FiCornerDownLeft,
  FiUpload,
  // FiTrash2,
  // FiPlusCircle,
  // FiRefreshCcw,
  // FiLifeBuoy
} from "react-icons/fi";
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
  // const [savedPresets, setSavedPresets] = useState([]);
  // const [selectedPreset, setSelectedPreset] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // const saveCurrentPreset = () => {
  //   const updatedPresets = [
  //     ...savedPresets,
  //     { id: savedPresets.length + 1, filters: filter },
  //   ];
  //   setSavedPresets(updatedPresets);
  //   localStorage.setItem("savedPresets", JSON.stringify(updatedPresets));
  // };

  // const deletePreset = (presetId) => {
  //   const updatedPresets = savedPresets.filter(
  //     (preset) => preset.id !== presetId,
  //   );
  //   setSavedPresets(updatedPresets);
  //   localStorage.setItem("savedPresets", JSON.stringify(updatedPresets));
  //   if (selectedPreset?.id === presetId) setSelectedPreset(null);
  // };

  // const loadPreset = (preset) => {
  //   setFilter(preset.filters);
  //   setSelectedPreset(preset);
  // };

  // const resetFilter = () => setFilter(defStyle);

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
      key={`${file.name}-${file.size}-${file.lastModified}`} // Use file size and last modified timestamp to create a unique key
      onClick={() => setImageSrc(URL.createObjectURL(file))}
      style={{ cursor: "pointer" }}
    >
      {file.name} | {file.size} bytes
    </li>
  ));

  const togglePanel = (setPanelState) => () => setPanelState((prev) => !prev);
  // Reset functions for each filter category
  const resetLightFilters = () => {
    setFilter((prev) =>
      prev.map((f) =>
        defStyle.light.find((def) => def.name === f.name)
          ? {
              ...f,
              value: defStyle.light.find((def) => def.name === f.name).value,
            }
          : f,
      ),
    );
  };

  const resetColorFilters = () => {
    setFilter((prev) =>
      prev.map((f) =>
        defStyle.color.find((def) => def.name === f.name)
          ? {
              ...f,
              value: defStyle.color.find((def) => def.name === f.name).value,
            }
          : f,
      ),
    );
  };

  const resetBlurFilters = () => {
    setFilter((prev) =>
      prev.map((f) =>
        defStyle.blur.find((def) => def.name === f.name)
          ? {
              ...f,
              value: defStyle.blur.find((def) => def.name === f.name).value,
            }
          : f,
      ),
    );
  };
  return (
    <div className="app">
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
        // <div
        //   className="filters-overlay"
        //   // style={{
        //   //   position: "fixed",
        //   //   top: 0,
        //   //   left: "80%",
        //   //   right: 0,
        //   //   bottom: 0,
        //   //   zIndex: 1000,
        //   //   backgroundColor: "black",
        //   //   color: "white",
        //   //   display: "flex",
        //   //   flexDirection: "column",
        //   //   padding: "20px",
        //   // }}
        // >
        //   <div className="app__header" onClick={resetFilter}>
        //     <h1>CSS Filters</h1>
        //     <p>Use sliders below to edit your image...</p>
        //   </div>

        //   <div className="tools">
        //     <button className="preset__btn" onClick={resetFilter}>
        //       <FiRefreshCcw size={16} />
        //     </button>
        //     <select
        //       value={selectedPreset?.id || ""}
        //       onChange={(e) =>
        //         loadPreset(
        //           savedPresets.find(
        //             (p) => p.id === parseInt(e.target.value, 10),
        //           ),
        //         )
        //       }
        //     >
        //       <option  value="">Select your preset</option>
        //       {savedPresets.map((preset) => (
        //         <option key={preset.id} value={preset.id}>
        //           Preset {preset.id}
        //         </option>
        //       ))}
        //     </select>
        //     <button className="preset__btn" onClick={saveCurrentPreset}>
        //       <FiPlusCircle size={16} />
        //     </button>
        //     <button
        //       className="preset__btn"
        //       onClick={() => deletePreset(selectedPreset?.id)}
        //     >
        //       <FiTrash2 size={16} />
        //     </button>
        //   </div>

        //   <div className="slider__container">
        //     <div className="header">
        //       <h3>Light</h3>
        //       <FiLifeBuoy size={20}/>
        //     </div>
        //     {filter.map((x, index) => (
        //       <div className="slider" key={index}>
        //         <div className="slider-header">
        //           <label htmlFor={`customRange${index}`}>{x.name}</label>
        //           <p>{x.value}%</p>
        //         </div>
        //         <input
        //           type="range"
        //           id={`customRange${index}`}
        //           value={x.value}
        //           min="0"
        //           max="100"
        //           name={x.name}
        //           onChange={onFilterChange}
        //         />
        //       </div>
        //     ))}
        //   </div>
        // </div>
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

      {loading ? (
        <div className="canvas__loader">
          <BarLoader color="#0000ff" loading={loading} size={50} />
        </div>
      ) : imageSrc ? (
        <ImageCanvas
          filter={filter}
          imageSrc={imageSrc}
          canvasRef={canvasRef}
        />
      ) : (
        <div {...getRootProps({ className: "dropzone__empty" })}>
          <div className="status__message">
            <p>No Files Uploaded</p>
            <em>Max 5MB - total upload limit</em>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default App;
{
  /* <div className="dropzone__container">
  {loading ? (
    <div className="canvas__loader">
      <BarLoader color="#0000ff" loading={loading} size={50} />
    </div>
  ) : imageSrc ? (
    <ImageCanvas filter={filter} imageSrc={imageSrc} canvasRef={canvasRef} />
  ) : (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <img width="36" height="44" src="public/icons/app__icon.svg" alt="file-icon" />
      <div className="status__message">
        <p>Drag and Drop your file(s) or <strong>browse</strong></p>
        <em>Max 5MB - total upload limit</em>
      </div>
    </div>
  )}
</div> */
}
