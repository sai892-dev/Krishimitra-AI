import { LoadingSpinner } from "@/components/layout/PageHeader";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
