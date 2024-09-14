import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const ImageCanvas = ({ imageSrc }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.src = imageSrc;
    image.onload = () => {
      // Clear the canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }, [imageSrc]);

  return (
    <canvas
      ref={canvasRef}
      width={620}
      height={500}
    />
  );
};

ImageCanvas.propTypes = {
  imageSrc: PropTypes.string.isRequired, // Ensure imageSrc is a required string
};

export default ImageCanvas;
