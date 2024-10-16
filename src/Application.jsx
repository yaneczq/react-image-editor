// import { useDropzone } from 'react-dropzone';
// import { useState, useRef } from 'react';
// import EditorControllers from './components/EditorControllers';
// import { defStyle } from './utils/utils';

// function Application(file, filters, onSliderChange) {
//   const [imageSrc, setImageSrc] = useState(null);
//   const canvasRef = useRef(null);
//   const [filter, setFilter] = useState(
//     defStyle.light.concat(defStyle.color, defStyle.blur),
//   );
  
//   const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       if (acceptedFiles.length > 0) {
//         const file = acceptedFiles[0];
//         setImageSrc(URL.createObjectURL(file)); // Set image source
//       }
//     }
//   });

//   const acceptedFileItems = acceptedFiles.map((file) => (
//     <li key={file.path}>
//       {file.path} - {file.size} bytes
//     </li>
//   ));

//   return (
//     <>
//       <div className='empty__dropzone' {...getRootProps()}>
//         <input {...getInputProps()} />
//         <div className="status__message">
//           <p>No Files Uploaded</p>
//           <em>Max 5MB - total upload limit</em>
//         </div>
//         {acceptedFileItems}
//       </div>
//       {imageSrc ? (
//          <EditorControllers
//          file={file}
//          filters={filters}
//          canvasRef={canvasRef}
//          onSliderChange={onSliderChange}
//        />
//       ) : null}
//     </>
//   );
// }

// export default Application;
