
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RecipeCard } from "@/components/recipe-card";
import { Recipe } from "@/types/recipe";
import { Plus, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { recipeService } from "@/services/recipe.service";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold text-olive-800">Welcome to Recipe Book</h1>
          <p className="text-olive-600">Log in or register to start creating your delicious recipes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-olive-700 hover:bg-olive-800">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="border-olive-500">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (recipes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold text-olive-800">Welcome to Your Recipe Book</h1>
          <p className="text-olive-600">Start creating delicious recipes with pictures, ingredients, steps, and labels.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-olive-700 hover:bg-olive-800">
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Recipe
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-olive-800">Your Recipes</h1>
        <div className="flex gap-3">
          <Button asChild className="bg-olive-700 hover:bg-olive-800">
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" /> New Recipe
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-olive-500">
            <Link to="/book">
              <BookOpen className="mr-2 h-4 w-4" /> Recipe Book
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          {Array.from(new Set(recipes.flatMap(r => r.labels))).slice(0, 5).map(label => (
            <TabsTrigger key={label} value={label}>{label}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </TabsContent>
        
        {Array.from(new Set(recipes.flatMap(r => r.labels))).slice(0, 5).map(label => (
          <TabsContent key={label} value={label}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.filter(recipe => recipe.labels.includes(label)).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
