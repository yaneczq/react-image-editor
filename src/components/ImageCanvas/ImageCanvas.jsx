import { useRef, useEffect } from 'react';

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

export default ImageCanvas;
