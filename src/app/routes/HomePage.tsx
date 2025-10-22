import { ProductList } from '../../features/products';
import { useGetProductsQuery } from '../../services/api/productsApi';
import type { Product } from '../../types/product';
import { useCart } from '../../components/CartContext';

export function HomePage() {
  const { data: products, isLoading, error, isError } = useGetProductsQuery();
  const { addItem } = useCart();
  
  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    addItem(product, 1); 
    console.log('Adding to cart:', product);
  };

  // Debug information
  console.log('Products data:', products);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to ComStore
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Debug Info:</strong>
          <pre className="mt-2 text-sm">
            {JSON.stringify({ error, isError, isLoading }, null, 2)}
          </pre>
        </div>
      )}

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <div className="text-sm text-gray-600">
            {products && `${products.length} products available`}
          </div>
        </div>
        
        <ProductList
          products={products || []}
          isLoading={isLoading}
          error={isError ? 'Failed to load products' : undefined}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
