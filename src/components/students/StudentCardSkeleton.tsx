import { Card } from '@/components/ui/Card';

export function StudentCardSkeleton() {
  return (
    <Card className="relative overflow-hidden group">
      {/* Wavy Background Skeleton */}
      <div className="absolute top-0 left-0 w-full h-24 skeleton" style={{ clipPath: 'ellipse(150% 100% at 50% 0%)' }} />
      
      <div className="p-5 pt-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-card skeleton shrink-0" />
          <div className="space-y-2 flex-1 pt-4">
            <div className="h-5 w-3/4 skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-3 w-1/3 skeleton rounded" />
            <div className="h-4 w-2/3 skeleton rounded" />
          </div>
          <div className="space-y-1.5 text-right flex flex-col items-end">
            <div className="h-3 w-1/3 skeleton rounded" />
            <div className="h-4 w-2/3 skeleton rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}
