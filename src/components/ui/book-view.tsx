import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

interface BookViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const BookView = React.forwardRef<HTMLDivElement, BookViewProps>(
  ({ className, children, currentPage = 0, onPageChange, ...props }, ref) => {
    const [activePage, setActivePage] = React.useState(currentPage);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [isFlipping, setIsFlipping] = React.useState(false);
    const [flipDirection, setFlipDirection] = React.useState<'left' | 'right'>('right');
    const totalPages = React.Children.count(children);
    const bookContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      setActivePage(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages) {
        setFlipDirection(newPage > activePage ? 'right' : 'left');
        setIsFlipping(true);
        setTimeout(() => {
          setActivePage(newPage);
          onPageChange?.(newPage);
          setIsFlipping(false);
          
          const bookElement = document.querySelector('.book-container');
          if (bookElement) {
            bookElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300); // Reduced animation duration from 500ms to 300ms
      }
    };

    const toggleFullscreen = () => {
      if (isFullscreen) {
        document.exitFullscreen();
      } else if (bookContainerRef.current) {
        bookContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    };

    React.useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, []);

    return (
      <div
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
          bookContainerRef.current = node;
        }}
        className={cn(
          "w-full max-w-6xl mx-auto relative book-container",
          isFullscreen ? "fixed inset-0 w-screen h-screen" : "",
          className
        )}
        {...props}
      >
        <div className={cn(
          "flex flex-col items-center h-full",
          isFullscreen ? "h-screen" : ""
        )}>
          {/* Notepad container with navigation */}
          <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col">
            {/* Left navigation button */}
            <Button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 0}
              variant="ghost"
              size="icon"
              className="absolute -left-16 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-cream-50/90 hover:bg-cream-100/90 text-olive-700 shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>

            {/* Fullscreen button */}
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="icon"
              className="absolute -right-32 top-4 z-30 h-14 w-14 rounded-full bg-cream-50/90 hover:bg-cream-100/90 text-olive-700 shadow-lg transition-transform hover:scale-110"
            >
              {isFullscreen ? <Minimize2 className="h-7 w-7" /> : <Maximize2 className="h-7 w-7" />}
            </Button>

            {/* Right navigation button */}
            <Button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages - 1}
              variant="ghost"
              size="icon"
              className="absolute -right-16 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-cream-50/90 hover:bg-cream-100/90 text-olive-700 shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>

            {/* Notepad container */}
            <div className={cn(
              "w-full bg-cream-50 shadow-lg rounded-lg overflow-hidden relative flex flex-col",
              isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[85vh]"
            )}>
              {/* Spiral binding at top */}
              <div className="absolute -top-1 left-0 right-0 h-8 flex items-center justify-center gap-1 px-4 z-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-3 h-6 rounded-full border-2 border-olive-300 bg-cream-50 shadow-sm" />
                ))}
              </div>
              
              {/* Notepad pages */}
              <div className="flex-1 mt-8 px-4 pb-4 overflow-hidden">
                <div className="h-full bg-white rounded-lg shadow-inner overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-8">
                      {/* Page content with subtle shadow to show stacking */}
                      <div 
                        className={cn(
                          "w-full bg-white shadow-sm rounded-lg",
                          isFlipping && flipDirection === 'right' && "animate-page-flip-right",
                          isFlipping && flipDirection === 'left' && "animate-page-flip-left"
                        )}
                      >
                        {/* Page texture - vertical lines for notepad */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxsaW5lIHgxPSI0MCIgeTE9IjAiIHgyPSI0MCIgeTI9IjEwMCUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8bGluZSB4MT0iODAiIHkxPSIwIiB4Mj0iODAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjEyMCIgeTE9IjAiIHgyPSIxMjAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjE2MCIgeTE9IjAiIHgyPSIxNjAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjIwMCIgeTE9IjAiIHgyPSIyMDAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjI0MCIgeTE9IjAiIHgyPSIyNDAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjI4MCIgeTE9IjAiIHgyPSIyODAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjMyMCIgeTE9IjAiIHgyPSIzMjAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPGxpbmUgeDE9IjM2MCIgeTE9IjAiIHgyPSIzNjAiIHkyPSIxMDAlIiBzdHJva2U9IiNlZWUiIHN0cm9rZS13aWR0aD0iMSIgLz4KPC9zdmc+')] opacity-30" />
                        
                        {/* Page content */}
                        <div className="relative z-10">
                          {children[activePage]}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>

          {/* Page counter */}
          <div className={cn(
            "text-olive-800 font-semibold font-indie py-4",
            isFullscreen ? "mb-0" : ""
          )}>
            Page {activePage + 1} of {totalPages}
          </div>
        </div>
      </div>
    );
  }
);

BookView.displayName = "BookView";

export { BookView };
