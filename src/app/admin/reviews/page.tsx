'use client';

import * as React from 'react';
import { supabase } from '../../../lib/supabase';
import { Check, X, Star, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<any[]>([
    {
      id: 'mock-r1',
      products: { name: 'Premium 3-Burner Gas Stove' },
      reviewer_name: 'Rahul Sharma',
      rating: 5,
      comment: 'Superb quality and excellent design! Toughened glass looks very premium.',
      is_approved: true
    },
    {
      id: 'mock-r2',
      products: { name: 'Heavy Duty Induction Cooktop' },
      reviewer_name: 'Priya Patel',
      rating: 4,
      comment: 'Works perfectly fine. Burners work perfectly and flame control is really precise.',
      is_approved: true
    },
    {
      id: 'mock-r3',
      products: { name: 'Non-stick Cookware Set' },
      reviewer_name: 'Amit Verma',
      rating: 3,
      comment: 'Stove is okay, but the small burner size is a bit too small. Decent build.',
      is_approved: false
    }
  ]);
  const [loading, setLoading] = React.useState(false);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        products (name)
      `)
      .order('created_at', { ascending: false });

    if (data) setReviews(data);
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', id);

    if (!error) {
      setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: isApproved } : r));
    } else {
      alert('Error updating review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (!error) {
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      alert('Error deleting review');
    }
  };

  if (loading) {
    return <div className="p-8">Loading reviews...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Product Reviews</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-medium text-slate-600">Product</th>
              <th className="p-4 font-medium text-slate-600">Reviewer</th>
              <th className="p-4 font-medium text-slate-600">Rating</th>
              <th className="p-4 font-medium text-slate-600">Comment</th>
              <th className="p-4 font-medium text-slate-600">Status</th>
              <th className="p-4 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-800 font-medium">
                    {review.products?.name || 'Unknown Product'}
                  </td>
                  <td className="p-4 text-slate-600">
                    {review.reviewer_name}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold w-max">
                      {review.rating} <Star className="h-3 w-3 fill-current" />
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate" title={review.comment}>
                    {review.comment || '-'}
                  </td>
                  <td className="p-4">
                    {review.is_approved ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Approved</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Pending</span>
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    {!review.is_approved ? (
                      <button 
                        onClick={() => handleApprove(review.id, true)}
                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        title="Approve Review"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApprove(review.id, false)}
                        className="p-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        title="Unapprove Review"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Delete Review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
