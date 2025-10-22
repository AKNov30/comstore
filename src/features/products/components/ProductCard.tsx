import type { Product } from '../../../types/product';
import { formatPrice } from '../../../utils';
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Convert string price to number for formatting
  const price = parseFloat(product.product_price) || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {product.product_image && (
        <div className="aspect-w-16 aspect-h-9">
          <Link
            to={`/product/${product.id}`}    // ✅ ใช้ path มี id
            state={{ product }}
            className="block aspect-w-16 aspect-h-9 cursor-pointer"
            aria-label={`ดูรายละเอียด ${product.product_name}`}
          >
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </Link>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.product_name}
          </h3>
          <span className="text-sm text-gray-500 ml-2">
            #{product.id}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.product_description || 'No description available'}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.product_category || 'Uncategorized'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(product.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(price)}
          </span>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
