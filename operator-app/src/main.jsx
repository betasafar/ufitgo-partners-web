import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { ThemeProvider } from "./context/ThemeContext"
import { LayoutProvider } from "./context/LayoutContext"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <LayoutProvider>
      <App />
    </LayoutProvider>
  </ThemeProvider>
)



