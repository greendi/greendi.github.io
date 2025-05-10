
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookView } from "@/components/ui/book-view";
import { RecipeDetails } from "@/components/recipe-details";
import { Recipe } from "@/types/recipe";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TableOfContents } from "@/components/table-of-contents";
import { recipeService } from "@/services/recipe.service";
import { Spinner } from "@/components/ui/spinner";

export default function RecipeBook() {
  const { isAuthenticated, user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecipes();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  if (recipes.length === 0) {
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
      recipes={recipes} 
      onSelectRecipe={(index) => setCurrentPage(index + 1)}
    />,
    // The rest are individual recipe pages
    ...recipes.map((recipe) => (
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
