'use client';

import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as reviewService from '@/service/products/reviews';
import { Button } from '@/components/ui/button';

interface Review {
  _id: string;
  product_id: string;
  user_id_data?: {
    fullName: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  size?: string;
  color?: string;
  created_at?: string;
  is_approved?: boolean;
}

interface ReviewListProps {
  productId: string;
  refreshKey?: number;
}

export function ReviewList({ productId, refreshKey = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({});

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getProductReviews(productId, {
        limit: 10,
      });
      const reviewsList = data.hits || [];
      setReviews(reviewsList);
      setTotalReviews(data.pagination?.totalRows || 0);

      // Tính average rating
      if (reviewsList.length > 0) {
        const avgRating = reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length;
        setAverageRating(Math.round(avgRating * 10) / 10);

        // Tính distribution
        const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsList.forEach((r) => {
          distribution[r.rating]++;
        });
        setRatingDistribution(distribution);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshKey]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Xóa đánh giá thành công');
      fetchReviews();
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi xóa đánh giá');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-400">Đang tải đánh giá...</div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Đánh giá từ khách hàng</h3>

      {totalReviews === 0 ? (
        <p className="text-center text-gray-500 py-8">Chưa có đánh giá nào cho sản phẩm này</p>
      ) : (
        <>
          {/* Rating Overview */}
          <div className="bg-gray-50 p-6 mb-8 rounded-sm">
            <div className="flex items-start gap-8">
              {/* Average Rating */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{averageRating}</div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{totalReviews} đánh giá</p>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${
                            totalReviews > 0
                              ? ((ratingDistribution[rating] || 0) / totalReviews) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {ratingDistribution[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 p-4 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {review.user_id_data?.avatar ? (
                        <img
                          src={review.user_id_data.avatar}
                          alt={review.user_id_data.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-gray-600">
                          {review.user_id_data?.fullName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {review.user_id_data?.fullName || 'Ẩn danh'}
                      </p>
                      <div className="flex gap-2 items-center">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at || '').toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TODO: Add delete button for own reviews */}
                  {/* <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button> */}
                </div>

                <p className="text-gray-700 text-sm mb-2">{review.comment}</p>

                {(review.size || review.color) && (
                  <p className="text-xs text-gray-500">
                    {review.size && `Kích cỡ: ${review.size}`}
                    {review.size && review.color && ' | '}
                    {review.color && `Màu: ${review.color}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
