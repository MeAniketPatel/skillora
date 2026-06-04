import db from "@/lib/prisma";

export async function getCouponByCode(code: string) {
  return db.coupon.findUnique({
    where: { code },
  });
}

export async function getAllCoupons(params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const [coupons, total] = await Promise.all([
    db.coupon.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { title: true } },
      },
    }),
    db.coupon.count(),
  ]);

  return { coupons, total, pages: Math.ceil(total / limit) };
}

export async function createCoupon(data: any) {
  return db.coupon.create({ data });
}

export async function updateCoupon(id: string, data: any) {
  return db.coupon.update({
    where: { id },
    data,
  });
}

export async function deleteCoupon(id: string) {
  return db.coupon.delete({
    where: { id },
  });
}

export async function incrementCouponUsage(id: string) {
  return db.coupon.update({
    where: { id },
    data: { usedCount: { increment: 1 } },
  });
}

export async function validateCoupon(code: string, courseId: string) {
  const coupon = await getCouponByCode(code);
  
  if (!coupon) return { error: "Invalid coupon code" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { error: "Coupon expired" };
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { error: "Coupon usage limit reached" };
  if (coupon.courseId && coupon.courseId !== courseId) return { error: "Coupon not applicable to this course" };

  return { discount: coupon.discount, type: coupon.type, couponId: coupon.id };
}

export async function getTeacherCoupons(teacherId: string) {
  return db.coupon.findMany({
    where: {
      course: {
        teacherId
      }
    },
    include: {
      course: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}
