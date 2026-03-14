import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const savedTheme = window.localStorage.getItem("appThemeMode");
const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
document.documentElement.setAttribute("data-theme", initialTheme);

createRoot(document.getElementById("root")!).render(<App />);