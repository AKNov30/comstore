export function AboutPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            ComStore is a modern e-commerce platform built with React and TypeScript. 
            We provide a seamless shopping experience with our intuitive interface and 
            robust backend infrastructure.
          </p>
          <p className="text-gray-600 mb-4">
            Our mission is to make online shopping accessible, secure, and enjoyable 
            for everyone. We continuously work on improving our platform to meet the 
            evolving needs of our customers.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Customer satisfaction is our top priority</li>
            <li>We believe in transparency and honesty</li>
            <li>Innovation drives everything we do</li>
            <li>We support our local community</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
