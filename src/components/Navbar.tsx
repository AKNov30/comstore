import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import { useCart } from "./CartContext";



export function Navbar() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 👈 state สำหรับ popup
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // 👈 state สำหรับ popup
  const [openCart, setOpenCart] = useState(false); // 👈 toggle dropdown
  const { items, count } = useCart(); // 👈 ใช้จำนวนจาก context


  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // TODO: ต่อระบบค้นหาจริง เช่น navigate(`/search?q=${searchTerm}`)
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-gray-900">
                ComStore
              </Link>
            </div>

            {/* Center: Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 mx-8 max-w-md hidden sm:flex"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Right: Navigation */}
            <nav className="flex space-x-8 items-center">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/") || isActive("/home")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/about")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/contact")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Contact
              </Link>
              {/* 🔹 Cart Icon + Badge */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Cart"
                  onClick={() => setOpenCart((o) => !o)}
                  className="relative p-2 rounded-md hover:bg-gray-100"
                >
                  {/* cart icon (heroicons-like) */}
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2m.6 3h13l-1.5 8h-12L4 6h16M7 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>

                  {/* badge */}
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] rounded-full bg-red-600 text-white">
                      {count}
                    </span>
                  )}
                </button>

                {/* dropdown mini-cart */}
                {openCart && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
                    <div className="p-3 border-b font-semibold">Cart</div>
                    <div className="max-h-64 overflow-auto">
                      {items.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">Your cart is empty</div>
                      ) : (
                        <ul className="divide-y">
                          {items.map(({ product, qty }) => (
                            <li key={product.id} className="p-3 flex items-start gap-3">
                              <img
                                src={product.product_image}
                                alt={product.product_name}
                                className="w-12 h-12 rounded object-cover bg-gray-100"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.product_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Qty: {qty}
                                  {typeof product.product_price === "string" && (
                                    <span className="ml-2">
                                      • {Number(product.product_price).toLocaleString()} ฿
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="p-3 border-t flex gap-2">
                      <Link
                        to="/cart"
                        className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setOpenCart(false)}
                      >
                        View cart
                      </Link>
                      <button
                        className="flex-1 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                        onClick={() => {
                          setOpenCart(false);
                          // TODO: ไปหน้า checkout
                        }}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 🔹 ปุ่ม Login (ไอคอนรูปคน) */}
              <button
                onClick={() => setIsLoginOpen(true)}
                aria-label="Login"
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
              >
                {/* Person icon (Heroicons style) */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {/* ศีรษะ */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                  {/* ลำตัว */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 20.25a8.25 8.25 0 0115 0"
                  />
                </svg>
              </button>

            </nav>
          </div>
        </div>
      </header>

      {/* 🔹 Login Popup (ไม่มี path) */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(payload) => {
          console.log("Logged in:", payload);
          setIsLoginOpen(false);
          // TODO: คุณอาจเก็บ user ลง global state หรือเปลี่ยนปุ่ม Login เป็นชื่อผู้ใช้
        }}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true); // 👈 เปิด Register popup
        }}
      />

      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(payload) => {
          console.log("Registered & logged in:", payload);
          setIsRegisterOpen(false);
        }}
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
