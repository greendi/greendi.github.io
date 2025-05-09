
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
    const [isFlipping, setIsFlipping] = React.useState(false);

    React.useEffect(() => {
      setActivePage(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages) {
        setIsFlipping(true);
        setTimeout(() => {
          setActivePage(newPage);
          onPageChange?.(newPage);
          setIsFlipping(false);
          
          // Scroll to top of the book when page changes
          const bookElement = document.querySelector('.book-container');
          if (bookElement) {
            bookElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full max-w-5xl mx-auto relative book-container", className)}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[2/1.3] bg-cream-50 shadow-xl rounded-lg overflow-hidden border border-olive-300 relative">
            {/* Leather texture overlay */}
            <div className="absolute inset-0 bg-paper-texture opacity-20 mix-blend-overlay pointer-events-none" />
            
            {/* Book spine and binding effect */}
            <div className="flex h-full shadow-2xl">
              <div className="w-[3%] h-full bg-olive-800 opacity-20" />
              <div className="flex-1 flex relative">
                {/* Inner shadow along the spine */}
                <div className="absolute inset-0 shadow-[inset_12px_0_18px_-10px_rgba(0,0,0,0.4)]" />
                
                {/* Page content */}
                <div 
                  className={cn(
                    "w-full px-6 py-8 overflow-y-auto recipe-page book-page-transition", 
                    isFlipping && "opacity-0 scale-95"
                  )}
                >
                  {children[activePage]}
                </div>
              </div>
            </div>
          </div>

          {/* Page navigation controls */}
          <div className="mt-8 flex items-center gap-6">
            <Button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 0}
              variant="outline"
              className="border-olive-500 font-indie"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Page
            </Button>
            <span className="text-olive-800 font-semibold">
              Page {activePage + 1} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages - 1}
              variant="outline"
              className="border-olive-500 font-indie"
            >
              Next Page <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

BookView.displayName = "BookView";

export { BookView };
