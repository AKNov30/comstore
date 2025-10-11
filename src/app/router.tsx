import { createBrowserRouter } from "react-router-dom";
import { App } from "./app";
import ErrorPage from "../ErrorPage";
import { HomePage } from "./routes/HomePage";
import { AboutPage } from "./routes/AboutPage";
import { ContactPage } from "./routes/ContactPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
]);
