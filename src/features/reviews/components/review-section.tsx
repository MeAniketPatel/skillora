"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, User, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  createReview,
  getCourseReviews,
  getCourseRatingStats,
  getUserReviewForCourse,
} from "../actions/review.actions";
import { formatDistanceToNow } from "date-fns";

interface ReviewSectionProps {
  courseId: string;
  userId: string | undefined;
  isEnrolled: boolean;
}

function StarRating({ rating, onRatingChange, readonly = false }: {
  rating: number;
  onRatingChange?: (r: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-neutral-300 dark:text-neutral-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ courseId, userId, isEnrolled }: ReviewSectionProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<{ average: number; count: number; distribution: Record<number, number> } | null>(null);
  const [userReview, setUserReview] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  async function loadReviews() {
    setLoading(true);
    const [reviewsData, statsData] = await Promise.all([
      getCourseReviews(courseId, 1, 50),
      getCourseRatingStats(courseId),
    ]);
    setReviews(reviewsData?.reviews || []);
    setStats(statsData);

    if (userId) {
      const existing = await getUserReviewForCourse(courseId);
      setUserReview(existing);
    }
    setLoading(false);
  }

  async function handleSubmitReview() {
    if (!userId) { router.push("/login"); return; }
    setSubmitting(true);
    const res = await createReview({ courseId, rating: newRating, comment: newComment });
    if (res.success) {
      setShowForm(false);
      setNewComment("");
      setNewRating(5);
      await loadReviews();
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Reviews</CardTitle>
        {isEnrolled && !userReview && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} variant="outline">
            Write a Review
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        {stats && stats.count > 0 && (
          <div className="flex items-center gap-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.average.toFixed(1)}</div>
              <StarRating rating={Math.round(stats.average)} readonly />
              <div className="text-xs text-muted-foreground mt-1">{stats.count} reviews</div>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star] || 0;
                const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-right text-muted-foreground">{star}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats && stats.count === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="rounded-lg border p-4 space-y-3 bg-neutral-50 dark:bg-neutral-950/50">
            <h4 className="text-sm font-semibold">Write Your Review</h4>
            <StarRating rating={newRating} onRatingChange={setNewRating} />
            <Textarea
              placeholder="Share your thoughts about this course..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmitReview} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.user?.image || ""} />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{review.user?.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <StarRating rating={review.rating} readonly />
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
