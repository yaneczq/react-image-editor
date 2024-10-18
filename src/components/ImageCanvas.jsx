import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FiZoomIn, FiZoomOut, FiDownloadCloud, FiTrash2 } from "react-icons/fi";
import { downloadFilteredImage, resetStorageAndReload } from "../utils/utils";

const ImageCanvas = ({ imageSrc, filter = [], canvasRef }) => {
  const [zoom, setZoom] = useState(0.5); // Zoom state

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    const resizeCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Adjust canvas for high-DPI displays
      const scale = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      // Set canvas dimensions for high-DPI
      
      // Check if the computed canvas width is less than 842px
      if (width < 842) {
        canvas.width = (width / 2) * scale;
        canvas.height = (height / 2) * scale;
        canvas.style.width = `${width / 1}px`; // Reduce width by half
        canvas.style.height = `${height / 1}px`; // Reduce height by half
      } else {
        // Otherwise, set to full width and height
          canvas.width = width * scale;
          canvas.height = height * scale;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
      }
  
      // Draw the image onto the canvas
      drawImage(ctx, image);
  };
  

    const drawImage = (ctx, image) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      ctx.filter = filterString;

      // Calculate zoomed image dimensions

      // Translate the canvas context to center before scaling
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save(); // Save current state of canvas
      ctx.translate(centerX, centerY); // Move to the center of the canvas
      ctx.scale(zoom, zoom); // Apply zoom scale
      ctx.translate(-image.width / 2, -image.height / 2); // Translate back by half of the image dimensions

      ctx.drawImage(image, 0, 0, image.width, image.height); // Draw image at the center

      ctx.restore(); // Restore the original state of the canvas
    };

    image.onload = () => {
      resizeCanvas();
      drawImage(ctx, image);
    };

    image.src = imageSrc;

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [imageSrc, filter, zoom, canvasRef]);

  return (
    <>
      {/* Zoom controls */}
      <div className="controls">
        <button
          className="zoom-button zoom-in"
          onClick={() => setZoom(zoom + 0.1)}
        >
          <FiZoomIn size={16} />
        </button>
        <button
          className="zoom-button zoom-out"
          onClick={() => setZoom(zoom - 0.1)}
          disabled={zoom <= 0.2}
        >
          <FiZoomOut size={16} />
        </button>
        <button
          className="download-button"
          onClick={() => downloadFilteredImage(canvasRef)}
        >
          <FiDownloadCloud size={16} />
        </button>
        <button onClick={resetStorageAndReload}>
          <FiTrash2 size={16} />
        </button>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} />
    </>
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
  canvasRef: PropTypes.object.isRequired,
};

export default ImageCanvas;
