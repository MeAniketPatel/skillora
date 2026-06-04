/**
 * Skillora Points calculation utilities
 * 
 * Rules:
 * - 100 points = $1 course discount
 */

export const POINTS_TO_DOLLAR_RATE = 100;

/**
 * Converts reward points to monetary discount value in USD
 */
export function pointsToDiscount(points: number): number {
  return points / POINTS_TO_DOLLAR_RATE;
}

/**
 * Converts a monetary discount value in USD to points cost
 */
export function discountToPoints(dollars: number): number {
  return Math.ceil(dollars * POINTS_TO_DOLLAR_RATE);
}

/**
 * Calculates max points a user can apply based on their total points and course price
 */
export function calculateMaxUsablePoints(userPoints: number, coursePrice: number): {
  pointsToUse: number;
  discountAmount: number;
  remainingPrice: number;
} {
  const maxDiscountAllowed = coursePrice;
  const userDiscountValue = pointsToDiscount(userPoints);

  if (userDiscountValue >= maxDiscountAllowed) {
    return {
      pointsToUse: discountToPoints(maxDiscountAllowed),
      discountAmount: maxDiscountAllowed,
      remainingPrice: 0,
    };
  }

  return {
    pointsToUse: userPoints,
    discountAmount: userDiscountValue,
    remainingPrice: coursePrice - userDiscountValue,
  };
}
