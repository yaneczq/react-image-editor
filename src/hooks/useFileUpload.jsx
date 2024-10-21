import { useState } from "react";
import { useDropzone } from "react-dropzone";

const useFileUpload = () => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  const onDrop = (files) => {
    const acceptedFilesList = files.map((file) => ({
      path: file.path,   // Store the file path
      name: file.name    // Optionally store the file name (or any other relevant info)
    }));

    // Update the state with all files, not just one
    setAcceptedFiles((prevFiles) => [...prevFiles, ...acceptedFilesList]);
  };

  const { getInputProps, getRootProps } = useDropzone({
    noKeyboard: true,
    multiple: true,  // Ensure multiple file uploads are allowed
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/tiff": [".tiff"],
    },
    onDrop,
    onDropRejected: (rejectedFiles) => {
      console.log("Rejected files:", rejectedFiles);
    },
  });

  return { getInputProps, getRootProps, acceptedFiles };
};

export default useFileUpload;
