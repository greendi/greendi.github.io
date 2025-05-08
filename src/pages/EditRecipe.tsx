
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeFormData } from "@/types/recipe";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Recipe } from "@/types/recipe";
import { toast } from "@/components/ui/sonner";

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("recipes", []);
  
  const recipe = recipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-6">Recipe Not Found</h1>
        <p>The recipe you are trying to edit does not exist.</p>
      </div>
    );
  }

  const handleUpdateRecipe = (data: RecipeFormData) => {
    const updatedRecipes = recipes.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...data,
          updatedAt: new Date(),
        };
      }
      return r;
    });

    setRecipes(updatedRecipes);
    toast.success("Recipe updated successfully!");
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-olive-800 mb-6">Edit Recipe</h1>
      <RecipeForm 
        defaultValues={recipe} 
        onSubmit={handleUpdateRecipe} 
        isEditing
      />
    </div>
  );
}
