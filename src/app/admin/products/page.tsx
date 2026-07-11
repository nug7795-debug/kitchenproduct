'use client';

import * as React from 'react';
import { Package, Plus, Search, Filter, Edit2, Trash2, ExternalLink, Upload, Loader2, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

const NAMES = [
  'Rahul Sharma', 'Soriful Islam', 'Ansarul Haque', 'Priya Patel', 'Amit Verma',
  'Sneha Reddy', 'Rajesh Kumar', 'Vikram Singh', 'Deepika Rao', 'Rohan Gupta',
  'Sunita Devi', 'Vijay Yadav', 'Jyoti Mishra', 'Sandeep Choudhary', 'Neha Kapoor',
  'Anil Saxena', 'Karan Johar', 'Meera Nair', 'Arjun Mehta', 'Divya Joshi',
  'Suresh Prabhu', 'Pooja Hegde', 'Abhishek Bachchan', 'Kriti Sanon', 'Manish Malhotra',
  'Aishwarya Rai', 'Vivek Oberoi', 'Aditi Rao', 'Rajat Sharma', 'Sonal Chauhan',
  'Alok Nath', 'Preeti Zinta', 'Udit Narayan', 'Alka Yagnik', 'Kumar Sanu',
  'Sonu Nigam', 'Shreya Ghoshal', 'Sunidhi Chauhan', 'Hariharan', 'Kailash Kher',
  'Arijit Singh', 'Neha Kakkar', 'Badshah', 'Diljit Dosanjh', 'Guru Randhawa',
  'Raftaar', 'Jubin Nautiyal', 'Armaan Malik', 'Palak Muchhal', 'Sona Mohapatra'
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Patna', 'Bhopal', 'Indore', 'Chandigarh', 'Guwahati',
  'Bhubaneswar', 'Ranchi', 'Dehradun', 'Kochi', 'Madurai'
];

const STOVE_REVIEWS = [
  {
    rating: 5,
    title: 'Superb quality stove',
    comment: 'Superb quality and excellent design! Toughened glass looks very premium and elegant in my kitchen. Highly recommend this brand.'
  },
  {
    rating: 5,
    title: 'Value for money',
    comment: 'Best in the market at this price range. Burners work perfectly and flame control is really precise. Very happy with this buy.'
  },
  {
    rating: 5,
    title: 'Excellent product',
    comment: 'Very happy with the purchase. The glass top is extremely easy to clean, spill-proof design works wonders, and looks very durable.'
  },
  {
    rating: 5,
    title: 'Highly recommended',
    comment: 'Awesome build quality! Sturdy brass burners, high efficiency, and does not take too much space. The auto ignition is flawless.'
  },
  {
    rating: 5,
    title: 'Simply awesome',
    comment: 'Extremely good product. Toughened glass top makes it easy to wipe off cooking grease. Safe, efficient, and sleek.'
  },
  {
    rating: 5,
    title: 'Fabulous!',
    comment: 'This product is mindblowing. Stoves ignite instantly, glass design is scratch-resistant, and overall kitchen looks updated.'
  },
  {
    rating: 5,
    title: 'Must buy!',
    comment: 'Highly recommended for modern kitchens. Clean layout, knobs are very smooth to turn, and heat distribution is absolutely perfect.'
  },
  {
    rating: 5,
    title: 'Brilliant gas stove',
    comment: 'Excellent performance! Stainless steel body underneath toughened glass is extremely solid. Very satisfied with prompt delivery.'
  },
  {
    rating: 4,
    title: 'Very Good product',
    comment: 'Product is good and build quality is awesome. Highly durable. Deducting 1 star only because the delivery took two days longer.'
  },
  {
    rating: 4,
    title: 'Nice and compact',
    comment: 'Very efficient burner layout. Fits perfectly in my small kitchen platform. Sleek black glass is easy to clean and maintain.'
  },
  {
    rating: 4,
    title: 'Value purchase',
    comment: 'Works perfectly fine. Standard gas connection was quick. The burners produce clean blue flame without soot. Good deal!'
  },
  {
    rating: 4,
    title: 'Satisfied',
    comment: 'Looks premium and classy. Knobs are ergonomically placed. Value for money, will definitely recommend to neighbors.'
  },
  {
    rating: 4,
    title: 'Good choice',
    comment: 'The burner distance is quite comfortable. You can easily cook in two large utensils at once. Clean design and very safe.'
  },
  {
    rating: 3,
    title: 'Decent performance',
    comment: 'Stove is okay, but the small burner size is a bit too small for quick cooking. Glass quality and body build is decent.'
  },
  {
    rating: 3,
    title: 'Average build',
    comment: 'Product works but the rubber feet are slightly uneven on my platform. Had to adjust a little bit. Otherwise, burner efficiency is standard.'
  },
  {
    rating: 3,
    title: 'Okay stove',
    comment: 'Does the job. Cleaning takes a bit of effort around the spill tray edges. Overall okay for daily light cooking.'
  },
  {
    rating: 2,
    title: 'Knobs are tight',
    comment: 'The product looks premium, but one of the control knobs is very stiff to turn. Customer service was slow to respond.'
  },
  {
    rating: 2,
    title: 'Not up to expectation',
    comment: 'Glass top gets extremely hot during long cooking hours. Burner spacing could be slightly improved. Standard build.'
  },
  {
    rating: 1,
    title: 'Defective ignition',
    comment: 'Extremely unhappy. The burner auto ignition did not work out of the box. Customer support is not picking up. Very bad.'
  },
  {
    rating: 1,
    title: 'Poor customer service',
    comment: 'Stove burners started showing uneven flames in just 3 days. Trying to contact service center but no luck. Disappointed.'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState('');

  // Reviews Generator States
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
  const [reviewsCount, setReviewsCount] = React.useState(800);
  const [clearExisting, setClearExisting] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [generateProgress, setGenerateProgress] = React.useState('');

  const handleGenerateReviews = async () => {
    if (!selectedProduct) return;
    if (reviewsCount < 1) {
      alert('Please enter a valid review count.');
      return;
    }

    setGenerating(true);
    setGenerateProgress('Initializing...');

    try {
      // 1. Clear existing reviews if toggle is checked
      if (clearExisting) {
        setGenerateProgress('Clearing existing reviews...');
        const { error: clearError } = await supabase
          .from('reviews')
          .delete()
          .eq('product_id', selectedProduct.id);
        
        if (clearError) throw clearError;
      }

      // 2. Generate the review pool
      setGenerateProgress(`Generating ${reviewsCount} reviews...`);
      
      const newReviews = [];
      const now = Date.now();
      
      for (let i = 0; i < reviewsCount; i++) {
        // Star rating based on weighted probabilities
        const r = Math.random();
        let rating = 5;
        if (r < 0.70) rating = 5;
        else if (r < 0.90) rating = 4;
        else if (r < 0.95) rating = 3;
        else if (r < 0.98) rating = 2;
        else rating = 1;

        // Get reviews for this rating
        const templates = STOVE_REVIEWS.filter(x => x.rating === rating);
        const template = templates[Math.floor(Math.random() * templates.length)];

        const name = NAMES[Math.floor(Math.random() * NAMES.length)];
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        
        // Randomize reactions
        const reactions = Math.floor(Math.random() * 41); // 0 to 40 reactions
        const likes = Math.round(reactions * 0.9);
        const dislikes = reactions - likes;

        // Randomize date over the last 180 days
        const daysAgo = Math.floor(Math.random() * 180);
        const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();

        newReviews.push({
          product_id: selectedProduct.id,
          reviewer_name: name,
          rating: rating,
          title: template.title,
          comment: template.comment,
          location: `Certified Buyer, ${city}`,
          image_url: null,
          is_approved: true,
          likes: likes,
          dislikes: dislikes,
          created_at: createdAt
        });
      }

      // 3. Batch insert using Supabase
      setGenerateProgress('Saving reviews to database in batches...');
      
      const BATCH_SIZE = 200;
      for (let i = 0; i < newReviews.length; i += BATCH_SIZE) {
        const batch = newReviews.slice(i, i + BATCH_SIZE);
        setGenerateProgress(`Saving reviews: batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(newReviews.length / BATCH_SIZE)}...`);
        const { error: insertError } = await supabase
          .from('reviews')
          .insert(batch);
        
        if (insertError) throw insertError;
      }

      // 4. Recalculate statistics
      setGenerateProgress('Recalculating aggregate statistics...');
      
      // Fetch all approved reviews for this product to get fresh stats
      const { data: allReviews, error: fetchError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', selectedProduct.id)
        .eq('is_approved', true);

      if (fetchError) throw fetchError;

      const totalReviews = allReviews.length;
      const totalRatings = allReviews.length;
      
      let averageRating = 4.5;
      const distribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };

      if (totalReviews > 0) {
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
        averageRating = parseFloat((sum / totalReviews).toFixed(1));
        
        allReviews.forEach(rev => {
          const ratingStr = rev.rating.toString();
          if (ratingStr in distribution) {
            distribution[ratingStr as keyof typeof distribution] += 1;
          }
        });
      }

      const starDistribution = {
        "5": distribution["5"].toString(),
        "4": distribution["4"].toString(),
        "3": distribution["3"].toString(),
        "2": distribution["2"].toString(),
        "1": distribution["1"].toString()
      };

      // Skip database update as aggregates columns do not exist in database schema

      // Update local state product stats if applicable
      setProducts(prev => prev.map(p => {
        if (p.id === selectedProduct.id) {
          return {
            ...p,
            total_reviews: totalReviews,
            total_ratings: totalRatings,
            average_rating: averageRating,
            star_distribution: starDistribution
          };
        }
        return p;
      }));

      alert(`Successfully generated ${reviewsCount} reviews and updated product aggregates!`);
      setSelectedProduct(null);
    } catch (err: any) {
      console.error('Error generating reviews:', err);
      alert('Failed to generate reviews: ' + err.message);
    } finally {
      setGenerating(false);
      setGenerateProgress('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Optimistic UI update
    setProducts(products.filter(p => p.id !== id));
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            ),
            product_images (
              image_url,
              is_featured
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setErrorMsg(error.message || JSON.stringify(error));
          return;
        }

        if (data) {
          const transformed = data.map(p => {
            let categoryName = 'Uncategorized';
            if (p.categories) {
              if (Array.isArray(p.categories)) {
                categoryName = p.categories[0]?.name || 'Uncategorized';
              } else {
                categoryName = p.categories.name || 'Uncategorized';
              }
            }
            
            let mrpValue = '';
            try {
              if (p.price) {
                mrpValue = `₹${parseFloat(p.price).toLocaleString('en-IN')}`;
              }
            } catch (e) {
              mrpValue = p.price ? `₹${p.price}` : '';
            }

            let salePriceValue = '₹0';
            try {
              if (p.sale_price) {
                salePriceValue = `₹${parseFloat(p.sale_price).toLocaleString('en-IN')}`;
              } else if (p.price) {
                salePriceValue = `₹${parseFloat(p.price).toLocaleString('en-IN')}`;
              }
            } catch (e) {
              salePriceValue = p.sale_price ? `₹${p.sale_price}` : (p.price ? `₹${p.price}` : '₹0');
            }

            let imageUrl = 'https://via.placeholder.com/200';
            if (p.product_images) {
              if (Array.isArray(p.product_images)) {
                const featured = p.product_images.find((img: any) => img.is_featured);
                imageUrl = featured?.image_url || p.product_images[0]?.image_url || imageUrl;
              } else if (typeof p.product_images === 'object') {
                imageUrl = (p.product_images as any).image_url || imageUrl;
              }
            }

            return {
              id: p.id,
              name: p.name || 'Unnamed Product',
              category: categoryName,
              mrp: mrpValue,
              salePrice: salePriceValue,
              stock: p.stock_quantity || 0,
              status: (p.stock_quantity || 0) > 10 ? 'In Stock' : (p.stock_quantity || 0) > 0 ? 'Low Stock' : 'Out of Stock',
              image: imageUrl
            };
          });
          setProducts(transformed);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setErrorMsg(err.message || err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="bg-red-50 border-2 border-red-100 text-red-750 px-6 py-4 rounded-2xl text-xs font-bold leading-normal animate-pulse flex flex-col gap-1.5">
          <p className="font-black uppercase tracking-widest text-[10px]">Database Connection / Fetch Failure</p>
          <p>{errorMsg}</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Manage your kitchen product inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-2 font-bold gap-2">
            <Upload className="h-4 w-4" /> Bulk Upload
          </Button>
          <Link href="/admin/products/add">
            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-lg shadow-slate-200">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white"
          />
        </div>
        <Button variant="outline" className="rounded-full gap-2 bg-white">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500" />
                    <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Loading Inventory...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    No products found in database
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">ID: {product.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{product.salePrice}</span>
                      {product.mrp && product.mrp !== product.salePrice && (
                        <span className="text-xs text-slate-400 line-through">{product.mrp}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      product.status === 'In Stock' ? 'bg-green-100 text-green-600' :
                      product.status === 'Low Stock' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-600'
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <Button 
                        onClick={() => setSelectedProduct(product)} 
                        variant="ghost" 
                        size="sm" 
                        title="Generate reviews"
                        className="h-8 w-8 p-0 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-100"
                      >
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </Button>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200">
                          <Edit2 className="h-4 w-4 text-slate-600" />
                        </Button>
                      </Link>
                      <Button onClick={() => handleDelete(product.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-red-50 hover:bg-red-100 border border-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <Star className="h-5 w-5 fill-current animate-pulse" />
                </div>
                <div>
                  <h3 className="text-md font-extrabold text-slate-800 tracking-tight">Review Generator</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Bulk Mock Review System</p>
                </div>
              </div>
              <button 
                onClick={() => !generating && setSelectedProduct(null)}
                disabled={generating}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
              >
                <span className="text-lg font-black leading-none">&times;</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Product</span>
                <p className="text-sm font-bold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl p-3">{selectedProduct.name}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Number of Reviews to Generate
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(Math.max(1, parseInt(e.target.value) || 0))}
                  disabled={generating}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-sm bg-white disabled:opacity-50"
                />
                <p className="text-[10px] text-slate-400 font-medium mt-1">Recommended minimum: 800 reviews.</p>
              </div>

              <div className="flex items-center gap-3 bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                <input 
                  type="checkbox" 
                  id="clearExisting"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  disabled={generating}
                  className="h-4 w-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500 cursor-pointer disabled:opacity-50 animate-pulse"
                />
                <label htmlFor="clearExisting" className="text-xs font-bold text-slate-700 select-none cursor-pointer disabled:opacity-50">
                  Delete existing reviews for this product first
                </label>
              </div>

              {generating && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-amber-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Processing...</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{generateProgress}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button 
                variant="ghost" 
                disabled={generating}
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl font-bold text-xs"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateReviews}
                disabled={generating}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-6 py-2 shadow-lg shadow-amber-100"
              >
                {generating ? 'Generating...' : 'Generate Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
