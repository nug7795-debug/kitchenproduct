const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Mock Lucide icons
jest = { mock: () => {} };
const Heart = () => 'HeartIcon';

// Mock Next Link and Image
const Link = ({ children }) => children;
const Image = () => 'Image';

// Mock product
const product = {
  id: "bd7bfe1f-d383-4fc9-a1d4-597dc315f6c5",
  name: "Maharaja Whiteline Odacios Plus Juicer Mixer Grinder",
  price: 4900,
  sale_price: 139,
  categories: { name: "Kitchen", slug: "kitchen" },
  product_images: [
    {
      image_url: "https://scjbackzybmoapkupfbi.supabase.co/storage/v1/object/public/kitchenproduct/products/1779433573286-8iculop.webp",
      is_featured: true
    }
  ]
};

// We will copy the ProductCard component function locally to test it
const AssuredBadge = () => 'AssuredBadge';
const WowIcon = () => 'WowIcon';
const DeliveryTruckIcon = () => 'DeliveryTruckIcon';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    name,
    price,
    sale_price,
    categories,
    product_images
  } = product;

  const displayPrice = price || product.price || 0;
  const displaySalePrice = sale_price || product.salePrice || displayPrice;
  const categoryName = categories?.name || product.category || 'Kitchen';
  const imageUrl = product_images?.[0]?.image_url || product.imageUrl || 'https://via.placeholder.com/300';
  
  const discount = (displaySalePrice && displayPrice && displayPrice > displaySalePrice) ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) : 0;
  const bankOfferPrice = Math.round((displaySalePrice || displayPrice || 0) * 0.95);

  const numericId = typeof id === 'number' ? id : (id?.charCodeAt(0) || 0);
  const ratingVal = parseFloat(product.average_rating || (4.0 + (numericId % 5) * 0.1)).toFixed(1);
  const totalRatings = product.total_ratings || ((numericId * 73) % 400 + 80);
  const totalRatingsStr = totalRatings >= 1000 ? `${(totalRatings / 1000).toFixed(1)}k` : `${totalRatings}`;

  const words = (name || '').split(' ');
  const description = words.slice(1).join(' ') || name || 'Kitchen Product';

  return React.createElement('div', {}, 
    React.createElement('span', {}, description),
    React.createElement('span', {}, ratingVal),
    React.createElement('span', {}, totalRatingsStr),
    React.createElement('span', {}, discount),
    React.createElement('span', {}, bankOfferPrice)
  );
};

try {
  const html = ReactDOMServer.renderToString(React.createElement(ProductCard, { product }));
  console.log('SSR Successful!');
  console.log('HTML Output:', html);
} catch (e) {
  console.error('SSR Failed:', e);
}
