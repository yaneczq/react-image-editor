import { createRoot } from "react-dom/client";
import Application from "./Application.jsx";
import "./index.scss";

createRoot(document.getElementById("root")).render(
  <>
    <Application />
  </>,
);
