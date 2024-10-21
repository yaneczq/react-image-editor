import useFileUpload from "../../hooks/useFileUpload"; // Adjust the path if needed
import { FiUpload } from "react-icons/fi";

const Dropzone = () => {
  // Use the custom hook
  const { getRootProps, getInputProps, acceptedFiles } = useFileUpload();

  function truncate(filename) {
    const maxLen = 35;
    // Ensure filename is a string
    if (typeof filename !== "string") {
      return ""; // Return an empty string or handle it as needed
    }

    const ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    const baseName = filename.substring(0, filename.lastIndexOf("."));

    if (baseName.length <= maxLen) {
      return filename; // Return the full filename if it fits
    }

    // Calculate the new base name length considering the extension and ellipsis
    const truncatedName = baseName.substring(0, maxLen - ext.length); // Subtract 3 for '[...]'
    return `${truncatedName}.. .${ext}`; // Return the truncated name with extension
  }

  return (
    <>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />

        <div className="app__icon">
          <img src="./public/app__icon.svg" alt="" />
        </div>

        <div className="icon">
          <FiUpload />
        </div>

        <div className="header">
          <h3>
            <strong>Drag & Drop or...</strong>
          </h3>
          <p>Click to select files</p>
        </div>
      </div>

      {/* Render the list of accepted files */}
      <div className="filelist">
        {acceptedFiles.map((file, index) => (
          <li key={index}>{truncate(file.name)}</li>
        ))}
      </div>
    </>
  );
};

export default Dropzone;
