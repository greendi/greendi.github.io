
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeFormData, Recipe } from "@/types/recipe";
import { recipeService } from "@/services/recipe.service";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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

  const handleUpdateRecipe = async (data: RecipeFormData) => {
    if (!id) return;

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
      
      await recipeService.updateRecipe(id, data);
      toast.success("Recipe updated successfully!");
      navigate(`/recipe/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update recipe");
      console.error("Error updating recipe:", error);
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
  
  if (!recipe) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-6">Recipe Not Found</h1>
        <p>The recipe you are trying to edit does not exist.</p>
      </div>
    );
  }

  // Check if user owns this recipe
  if (recipe.userId !== user?.id) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-olive-800 mb-6">Unauthorized</h1>
        <p>You don't have permission to edit this recipe.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-olive-800 mb-6">Edit Recipe</h1>
      <RecipeForm 
        defaultValues={recipe} 
        onSubmit={handleUpdateRecipe} 
        isEditing
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
