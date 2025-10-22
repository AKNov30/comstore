import React, { useMemo, useState } from "react";
import { useGetProductsQuery } from "../../services/api/productsApi";
import { useParams } from "react-router-dom";
import type { Product } from "../../types";
import { useCart } from "../../components/CartContext"; // เปลี่ยน path ให้ตรงโปรเจกต์
// ถ้ามี API ของสินค้ารายตัว ให้เปลี่ยนมาใช้ useGetProductByIdQuery(id)
// ในตัวอย่างนี้ ผมรับ product ผ่าน props หรือ fallback เป็น mock

type Props = {
  product?: Product;
};

const currency = (v: string | number) => {
  const n = typeof v === "string" ? Number(v) : v;
  return n.toLocaleString("th-TH", { style: "currency", currency: "THB" });
};

const SocialIcon: React.FC<{ name: "facebook" | "link" | "x"; onClick?: () => void }> = ({ name, onClick }) => {
  if (name === "facebook") {
    return (
      <button onClick={onClick} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" aria-label="Share to Facebook">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.495V14.708H9.69v-3.62h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.1 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.317h3.587l-.467 3.62h-3.12V24h6.116C23.406 24 24 23.407 24 22.676V1.325C24 .593 23.406 0 22.675 0z"/></svg>
      </button>
    );
  }
  if (name === "x") {
    return (
      <button onClick={onClick} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" aria-label="Share to X">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.9 2H22l-7.05 8.06L23 22h-6.9l-5.4-7.06L4.5 22H2l7.53-8.62L1 2h7l4.86 6.48L18.9 2Zm-2.42 18h1.83L7.61 4H5.63l10.85 16Z"/></svg>
      </button>
    );
  }
  return (
    <button onClick={onClick} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" aria-label="Copy link">
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11 4"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 20"/>
      </svg>
    </button>
  );
};

const QtyPicker: React.FC<{ value: number; onChange: (n: number) => void }> = ({ value, onChange }) => (
  <div className="inline-flex items-stretch rounded-lg border">
    <button
      type="button"
      onClick={() => onChange(Math.max(1, value - 1))}
      className="px-3 py-2 text-gray-600 hover:bg-gray-50"
      aria-label="decrease"
    >−</button>
    <div className="px-3 py-2 min-w-[40px] text-center font-medium">{String(value).padStart(2, "0")}</div>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="px-3 py-2 text-gray-600 hover:bg-gray-50"
      aria-label="increase"
    >＋</button>
  </div>
);

export const ProductDetailPage: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState<"details" | "specs">("details");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ ดึงสินค้าทั้งหมดจาก API เดิม
  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  // ✅ หา product จาก id ใน URL
  const product = useMemo(() => {
    if (!products || !id) return undefined;
    return products.find((p) => String(p.id) === String(id));
  }, [products, id]);

  if (isLoading) {
    return <div className="p-6 bg-white rounded-2xl shadow-sm">กำลังโหลดข้อมูลสินค้า...</div>;
  }
  if (isError) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm text-red-600">
        ไม่สามารถโหลดสินค้าได้: {String((error as any)?.message || "Unknown error")}
      </div>
    );
  }
  if (!product) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm">
        ไม่พบสินค้า id: <b>{id}</b>
      </div>
    );
  }

  const gallery: string[] = useMemo(() => {
    const first = product.product_image;
    return [first, first, first, first]; // ถ้ายังมีแค่รูปเดียว จำลองแกลเลอรี
  }, [product]);

  const priceText = currency(product.product_price);

  const handleAddToCart = () => addItem(product, qty);
  const handleBuyNow = () => {
    addItem(product, qty);
    alert("เพิ่มสินค้าลงตะกร้าแล้ว ไปหน้า Checkout ได้เลย");
  };

  return (
    <div className="px-4 sm:px-0">
      {/* เหมือนเวอร์ชันดีไซน์ blue theme ที่ให้ไปก่อนหน้า แต่ใช้ตัวแปร product จาก API */}
      {/* Left: Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage || gallery[0]}
              alt={product.product_name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(src)}
                className={`aspect-square rounded-xl overflow-hidden border ${
                  selectedImage === src || (!selectedImage && i === 0) ? "border-blue-500" : "border-transparent"
                } bg-gray-50 hover:opacity-90`}
              >
                <img src={src} alt={`thumbnail-${i}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.product_name}</h1>
              <div className="flex items-center gap-2">
                <SocialIcon name="link" onClick={() => navigator.clipboard.writeText(window.location.href)} />
                <SocialIcon name="facebook" />
                <SocialIcon name="x" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                มีสินค้า พร้อมส่ง
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">
                หมวดหมู่: {product.product_category}
              </span>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-extrabold text-gray-900">{priceText}</div>
              <p className="mt-2 text-sm text-gray-500">อัปเดต: {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="text-sm text-gray-700">จำนวน</div>
              <QtyPicker value={qty} onChange={setQty} />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 text-blue-700 px-4 py-3 font-semibold hover:bg-blue-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2m.6 3h13l-1.5 8h-12L4 6h16M7 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
                </svg>
                เพิ่มในตะกร้า
              </button>
              <button
                onClick={handleBuyNow}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-3 font-semibold hover:bg-blue-700"
              >
                ซื้อเลย
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm">
            <div className="flex gap-2 p-2">
              <button
                onClick={() => setActive("details")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  active === "details" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                รายละเอียดสินค้า
              </button>
              <button
                onClick={() => setActive("specs")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  active === "specs" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                คุณสมบัติ
              </button>
            </div>

            <div className="p-6">
              {active === "details" ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.product_description}</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="bg-gray-50 w-40 p-3 text-gray-600">Brand</td>
                        <td className="p-3">—</td>
                      </tr>
                      <tr className="border-b">
                        <td className="bg-gray-50 w-40 p-3 text-gray-600">Material</td>
                        <td className="p-3">—</td>
                      </tr>
                      <tr className="border-b">
                        <td className="bg-gray-50 w-40 p-3 text-gray-600">Size</td>
                        <td className="p-3">—</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-50 w-40 p-3 text-gray-600">Warranty</td>
                        <td className="p-3">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Service highlights (เหมือนเดิม) */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};