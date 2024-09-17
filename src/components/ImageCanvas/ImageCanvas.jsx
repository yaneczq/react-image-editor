// @LATEST VERSION

import { useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const ImageCanvas = ({ imageSrc, filters = [], canvasRef }) => {
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply the CSS filter string
      const filterString = filters.map(f => {
        const { name, value } = f;
        switch (name) {
          case 'Grayscale':
            return `grayscale(${value}%)`;
          case 'Sepia':
            return `sepia(${value}%)`;
          case 'Opacity':
            return `opacity(${value / 100})`;
          case 'Invert':
            return `invert(${value}%)`;
          case 'Hue-Rotate':
            return `hue-rotate(${value}deg)`;
          case 'Brightness':
            return `brightness(${value}%)`;
          case 'Contrast':
            return `contrast(${value}%)`;
          case 'Saturate':
            return `saturate(${value * 4}%)`;
          case 'Blur':
            return `blur(${value}px)`;
          default:
            return '';
        }
      }).join(' ');
      
      // Apply the filter to the canvas
      ctx.filter = filterString;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    image.src = imageSrc;
  }, [imageSrc, filters, canvasRef]);

  return (
    <>
      <canvas
        className='form__editor-display'
        ref={canvasRef}
        width={492}
        height={492 * 0.75}
      >

      </canvas>
    </>
  );
};

ImageCanvas.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ),
  canvasRef: PropTypes.object.isRequired // Ensure canvasRef is required and passed correctly
}; 

export default ImageCanvas;
