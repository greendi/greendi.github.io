
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, LogOut, User, Plus } from "lucide-react";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-olive-800 text-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-playfair text-2xl font-bold">
          <BookOpen className="h-6 w-6" />
          <span>Recipe Book</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-white hover:text-olive-200 transition-colors font-medium">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/book" className="text-white hover:text-olive-200 transition-colors font-medium">
                Recipe Book
              </Link>
              <Link to="/create">
                <Button variant="ghost" className="text-white hover:text-olive-900 hover:bg-olive-100">
                  <Plus className="h-5 w-5 mr-2" /> New Recipe
                </Button>
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                {user?.name || user?.email}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-white hover:text-olive-900 hover:bg-olive-100"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="ghost" className="text-white hover:text-olive-900 hover:bg-olive-100">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-olive-100 text-olive-800 hover:bg-olive-200">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
