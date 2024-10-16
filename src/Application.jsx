import { useDropzone } from 'react-dropzone';
import { useState, useRef } from 'react';
import ImageCanvas from './components/ImageCanvas';
import { defStyle } from './utils/utils';

function Application() {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState(
    defStyle.light.concat(defStyle.color, defStyle.blur),
  );
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageSrc(URL.createObjectURL(file)); // Set image source
      }
    }
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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
  return (
    <>
      <div className='empty__dropzone' {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="status__message">
          <p>No Files Uploaded</p>
          <em>Max 5MB - total upload limit</em>
        </div>
        {acceptedFileItems}
      </div>
      {imageSrc ? (
        <ImageCanvas
          filter={filter}
          imageSrc={imageSrc}
          canvasRef={canvasRef}
        />
      ) : null}

<div className="filters">
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
    </>
  );
}

export default Application;
