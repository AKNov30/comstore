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
      // เพิ่ม path ใหม่ได้ที่นี่
      {
        path: "products",
        element: <div className="p-6"><h1 className="text-2xl font-bold">Products Page</h1></div>,
      },
      {
        path: "cart",
        element: <div className="p-6"><h1 className="text-2xl font-bold">Shopping Cart</h1></div>,
      },
      {
        path: "profile",
        element: <div className="p-6"><h1 className="text-2xl font-bold">User Profile</h1></div>,
      },
    ],
  },
]);
