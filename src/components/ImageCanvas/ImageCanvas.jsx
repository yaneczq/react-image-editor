// @LATEST VERSION

import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation

const ImageCanvas = ({ imageSrc, filter = [], canvasRef }) => {
  const [zoom, setZoom] = useState(1); // Add zoom state

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply the CSS filter string
      const filterString = filter
        .map((f) => {
          const { name, value } = f;
          switch (name) {
            case "Grayscale":
              return `grayscale(${value}%)`;
            case "Sepia":
              return `sepia(${value}%)`;
            case "Opacity":
              return `opacity(${value / 100})`;
            case "Invert":
              return `invert(${value}%)`;
            case "Hue-Rotate":
              return `hue-rotate(${value}deg)`;
            case "Brightness":
              return `brightness(${value}%)`;
            case "Contrast":
              return `contrast(${value}%)`;
            case "Saturate":
              return `saturate(${value * 4}%)`;
            case "Blur":
              return `blur(${value}px)`;
            default:
              return "";
          }
        })
        .join(" ");

      // Apply the filter to the canvas
      ctx.filter = filterString;

      // Calculate the zoom dimensions
      const zoomWidth = canvas.width * zoom;
      const zoomHeight = canvas.height * zoom;
      const offsetX = (canvas.width - zoomWidth) / 2;
      const offsetY = (canvas.height - zoomHeight) / 2;

      ctx.drawImage(image, offsetX, offsetY, zoomWidth, zoomHeight);
    };

    image.src = imageSrc;
  }, [imageSrc, filter, zoom, canvasRef]);

  return (
    <div className="canvas__container">
      <canvas
        className="canvas__editor-display"
        ref={canvasRef}
        width={492}
        height={492 * 0.75}
      ></canvas>

      {/* Zoom controls */}
      <button
        className="zoom-button zoom-in"
        onClick={() => setZoom(zoom + 0.1)}
      >
        Zoom In
      </button>
      <button
        className="zoom-button zoom-out"
        onClick={() => setZoom(zoom - 0.1)}
        disabled={zoom <= 0.5}
      >
        Zoom Out
      </button>
    </div>
  );
};

ImageCanvas.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  filter: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ),
  canvasRef: PropTypes.object.isRequired, // Ensure canvasRef is required and passed correctly
};

export default ImageCanvas;
