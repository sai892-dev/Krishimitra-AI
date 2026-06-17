import { LoadingSpinner } from "@/components/layout/PageHeader";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
