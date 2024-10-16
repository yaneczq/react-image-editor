import { FiUpload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { saveImagesToLocalStorage } from "../../utils/utils";

const UploadButton = () => {
  const [setLoading] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [setImageSrc] = useState(null);

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

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <FiUpload size={32} />
    </div>
  );
};
export default UploadButton;
