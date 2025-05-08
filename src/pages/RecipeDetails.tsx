
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecipeDetails } from "@/components/recipe-details";
import { useLocalStorage } from "@/hooks/use-local-storage";
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

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("recipes", []);
  
  const recipe = recipes.find(r => r.id === id);
  
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

  const handleDeleteRecipe = () => {
    const updatedRecipes = recipes.filter(r => r.id !== id);
    setRecipes(updatedRecipes);
    toast.success("Recipe deleted successfully!");
    navigate("/");
  };

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
      </div>
      
      <div className="recipe-page">
        <RecipeDetails recipe={recipe} />
      </div>
    </div>
  );
}
