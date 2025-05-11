
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
      if (data.imageUrl && data.imageUrl.startsWith('data:')) {
        // This is a base64 encoded image from the file input
        try {
          const imageFile = await fetch(data.imageUrl)
            .then(res => res.blob())
            .then(blob => new File([blob], "recipe-image.jpg", { type: "image/jpeg" }));
          
          const imageUrl = await recipeService.uploadImage(imageFile);
          data.imageUrl = imageUrl;
        } catch (error) {
          console.error("Error converting base64 to file:", error);
          // Continue with creation even if image upload fails
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
      <h1 className="text-3xl font-bold text-olive-800 mb-6 font-indie">Create New Recipe</h1>
      <RecipeForm 
        onSubmit={handleCreateRecipe} 
        isSubmitting={isSubmitting}
        hideFormTitle={true}
      />
    </div>
  );
}
