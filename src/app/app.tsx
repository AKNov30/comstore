import { Outlet } from "react-router-dom";
import { AppProvider, ReduxProvider } from "../providers";
import { Navbar } from "../components/Navbar";
import { CartProvider } from "../components/CartContext";

export function App() {
  return (
    <ReduxProvider>
      <AppProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Outlet />
            </main>
          </div>
        </CartProvider>

      </AppProvider>
    </ReduxProvider>
  );
}
