'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, User } from 'lucide-react';
import { toast } from 'sonner';
import * as reviewService from '@/service/products/reviews';

interface ReviewFormProps {
  productId: string;
  onReviewSubmit: () => void;
}

export function ReviewForm({ productId, onReviewSubmit }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1) {
      toast.error('Vui lòng chọn số sao');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        product_id: productId,
        rating,
        comment: comment.trim(),
      });
      toast.success('Đánh giá của bạn sẽ hiển thị sau khi được duyệt');
      setComment('');
      setRating(5);
      setIsOpen(false);
      onReviewSubmit();
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.data?.message || 'Có lỗi xảy ra khi tạo đánh giá';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Đánh giá sản phẩm</h3>
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gray-800 hover:bg-black text-white rounded-none text-sm"
          >
            + Viết đánh giá
          </Button>
        )}
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 mb-8 rounded-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung đánh giá
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setComment('');
                setRating(5);
              }}
              variant="outline"
              className="border-gray-300 rounded-none text-sm"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-800 hover:bg-black text-white rounded-none text-sm"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
