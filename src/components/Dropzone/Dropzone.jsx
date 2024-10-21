import useFileUpload from '../../hooks/useFileUpload'; // Adjust the path if needed

const Dropzone = () => {
  // Use the custom hook
  const { getRootProps, getInputProps, acceptedFiles } = useFileUpload();

  return (
    <>
      <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px' }}>
        <input {...getInputProps()} />
        <p>Drag & drop some files here, or click to select files</p>
      </div>

      {/* Render the list of accepted files */}
      <div>
        
            {acceptedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
      
      </div>
    </>
  );
};

export default Dropzone;
