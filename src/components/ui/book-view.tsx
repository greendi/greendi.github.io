
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface BookViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const BookView = React.forwardRef<HTMLDivElement, BookViewProps>(
  ({ className, children, currentPage = 0, onPageChange, ...props }, ref) => {
    const [activePage, setActivePage] = React.useState(currentPage);
    const totalPages = React.Children.count(children);

    const handlePageChange = (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages) {
        setActivePage(newPage);
        onPageChange?.(newPage);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full max-w-5xl mx-auto relative", className)}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[2/1] bg-cream-50 shadow-lg rounded-lg overflow-hidden border border-olive-300 relative">
            <div className="absolute inset-0 bg-paper-texture opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="flex h-full">
              <div className="w-[3%] h-full bg-olive-800 opacity-20" />
              <div className="flex-1 flex relative">
                <div className="absolute inset-0 shadow-[inset_10px_0_10px_-10px_rgba(0,0,0,0.3)]" />
                <div className="w-full px-4 py-6 overflow-y-auto recipe-page">
                  {children[activePage]}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 0}
              variant="outline"
              className="border-olive-500"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-olive-800 font-semibold">
              Page {activePage + 1} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages - 1}
              variant="outline"
              className="border-olive-500"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

BookView.displayName = "BookView";

export { BookView };
