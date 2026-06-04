import { PageHeader } from "@/components/shared/page-header";
import { getAllCoupons } from "@/data/coupon.data";
import { CouponManager } from "@/components/admin/coupon-manager";
import { Pagination } from "@/components/shared/pagination";

interface AdminCouponsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminCouponsPage({
  searchParams,
}: AdminCouponsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const limit = 10;

  const { coupons, pages } = await getAllCoupons({
    page,
    limit,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Discount Coupon Manager"
        description="Generate promo codes, configure percentage/fixed limits, and monitor global discount usages."
      />

      <CouponManager initialCoupons={coupons} />

      <Pagination totalPages={pages} currentPage={page} />
    </div>
  );
}
