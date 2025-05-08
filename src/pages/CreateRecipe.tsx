
import React from "react";
import { useNavigate } from "react-router-dom";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeFormData } from "@/types/recipe";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Recipe } from "@/types/recipe";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("recipes", []);

  const handleCreateRecipe = (data: RecipeFormData) => {
    const newRecipe: Recipe = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRecipes([...recipes, newRecipe]);
    navigate(`/recipe/${newRecipe.id}`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-olive-800 mb-6">Create New Recipe</h1>
      <RecipeForm onSubmit={handleCreateRecipe} />
    </div>
  );
}
