import ImageCanvas from "./components/ImageCanvas";
import Navbar from "./components/Navbar/Navbar";
import { defStyle } from "./utils/utils";
import { useState, useRef } from "react";

const Applicaton = () => {
  const [filter] = useState(defStyle);
  const canvasRef = useRef(null);
  const [imageSrc] = useState(null);

  return (
    <div className="application">
      <Navbar />
      <ImageCanvas filter={filter} imageSrc={imageSrc} canvasRef={canvasRef} />
    </div>
  );
};
export default Applicaton;
