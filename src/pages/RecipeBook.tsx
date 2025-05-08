
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookView } from "@/components/ui/book-view";
import { RecipeDetails } from "@/components/recipe-details";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Recipe } from "@/types/recipe";
import { ArrowLeft } from "lucide-react";

export default function RecipeBook() {
  const [recipes] = useLocalStorage<Recipe[]>("recipes", []);
  const [currentPage, setCurrentPage] = React.useState(0);
  
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
        {recipes.map((recipe) => (
          <RecipeDetails key={recipe.id} recipe={recipe} />
        ))}
      </BookView>
    </div>
  );
}
