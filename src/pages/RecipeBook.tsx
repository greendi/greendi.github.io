
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookView } from "@/components/ui/book-view";
import { RecipeDetails } from "@/components/recipe-details";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Recipe } from "@/types/recipe";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TableOfContents } from "@/components/table-of-contents";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RecipeBook() {
  const { isAuthenticated, user } = useAuth();
  const [recipes] = useLocalStorage<Recipe[]>("recipes", []);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter recipes for the current user
  const userRecipes = recipes.filter(recipe => recipe.userId === user?.id);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userRecipes.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-6">Your Recipe Book</h1>
        <p>You don't have any recipes yet. Create some to view them in book format.</p>
        <Button asChild className="mt-4 bg-olive-700 hover:bg-olive-800">
          <Link to="/create">Create Your First Recipe</Link>
        </Button>
      </div>
    );
  }

  // Create book pages array - table of contents and individual recipes
  const bookPages = [
    // First page is Table of Contents
    <TableOfContents 
      key="toc"
      recipes={userRecipes} 
      onSelectRecipe={(index) => setCurrentPage(index + 1)}
    />,
    // The rest are individual recipe pages
    ...userRecipes.map((recipe) => (
      <RecipeDetails key={recipe.id} recipe={recipe} />
    ))
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-olive-800">Your Recipe Book</h1>
        <Button
          variant="outline"
          asChild
          className="border-olive-500"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
          </Link>
        </Button>
      </div>
      
      <BookView 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        {bookPages}
      </BookView>
    </div>
  );
}
