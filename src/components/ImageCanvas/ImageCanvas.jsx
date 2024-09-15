import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation

// const ImageCanvas = ({ imageSrc }) => {
//   const canvasRef = useRef(null);


//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const image = new Image();

//     image.src = imageSrc;
//     image.onload = () => {
//       // Clear the canvas before drawing
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       // Draw the image on the canvas
//       ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//     };
//   }, [imageSrc]);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={620}
//       height={500}
//     />
//   );
// };

// ImageCanvas.propTypes = {
//   imageSrc: PropTypes.string.isRequired, // Ensure imageSrc is a required string
// };

// export default ImageCanvas;

const ImageCanvas = ({ imageSrc, filters = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Apply the CSS filter string
          const filterString = filters.map(f => {
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
                      return `saturate(${value}%)`;
                  case "Blur":
                      return `blur(${value}px)`;
                  default:
                      return "";
              }
          }).join(" ");

          // Apply the filter to the canvas
          ctx.filter = filterString;
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };

      image.src = imageSrc;
  }, [imageSrc, filters]);

  return <canvas ref={canvasRef} width={620} height={500}></canvas>;
};

ImageCanvas.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
      PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired
      })
  )
};

// ImageCanvas.defaultProps = {
//   filters: [] // Default empty array for filters
// };


export default ImageCanvas;