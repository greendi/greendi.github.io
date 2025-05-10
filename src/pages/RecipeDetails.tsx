
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecipeDetails } from "@/components/recipe-details";
import { recipeService } from "@/services/recipe.service";
import { Recipe } from "@/types/recipe";
import { ArrowLeft, Edit, BookOpen, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        const recipeData = await recipeService.getRecipeById(id);
        setRecipe(recipeData);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast.error("Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDeleteRecipe = async () => {
    if (!id) return;
    
    try {
      await recipeService.deleteRecipe(id);
      toast.success("Recipe deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-6">Recipe Not Found</h1>
        <p>The recipe you are looking for does not exist.</p>
        <Button asChild className="mt-4 bg-olive-700 hover:bg-olive-800">
          <Link to="/">Back to Recipes</Link>
        </Button>
      </div>
    );
  }

  const isOwner = user && recipe.userId === user.id;

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <Button
          variant="outline"
          asChild
          className="mb-4 border-olive-500"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
          </Link>
        </Button>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              asChild
              className="border-olive-500"
            >
              <Link to={`/edit/${recipe.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            
            <Button
              variant="outline"
              asChild
              className="border-olive-500"
            >
              <Link to="/book">
                <BookOpen className="mr-2 h-4 w-4" /> View in Book
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your recipe.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRecipe}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      <div className="recipe-page">
        <RecipeDetails recipe={recipe} />
      </div>
    </div>
  );
}
