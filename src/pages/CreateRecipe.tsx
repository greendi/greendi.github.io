
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeFormData } from "@/types/recipe";
import { useAuth } from "@/contexts/AuthContext";
import { recipeService } from "@/services/recipe.service";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }

  const handleCreateRecipe = async (data: RecipeFormData) => {
    if (!user) {
      toast.error("You must be logged in to create a recipe");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Handle image upload if there's a file
      if (data.imageUrl && data.imageUrl.startsWith('blob:')) {
        // This is a new file upload (from a file input)
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput?.files?.length) {
          const file = fileInput.files[0];
          const imageUrl = await recipeService.uploadImage(file);
          data.imageUrl = imageUrl;
        }
      }
      
      const newRecipe = await recipeService.createRecipe(data, user.id);
      toast.success("Recipe created successfully!");
      navigate(`/recipe/${newRecipe.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create recipe");
      console.error("Error creating recipe:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Spinner /> 
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-olive-800 mb-6 font-playfair">Create New Recipe</h1>
      <RecipeForm 
        onSubmit={handleCreateRecipe} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
