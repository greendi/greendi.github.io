
import { supabase } from "@/integrations/supabase/client";
import { Recipe, RecipeFormData, Ingredient, Step } from "@/types/recipe";
import { v4 as uuidv4 } from "uuid";

// Types for the database
interface DbRecipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface DbIngredient {
  id: string;
  recipe_id: string;
  name: string;
  amount: string;
  unit: string;
}

interface DbStep {
  id: string;
  recipe_id: string;
  description: string;
  order_number: number;
}

interface DbLabel {
  id: string;
  recipe_id: string;
  name: string;
}

// Conversion functions
const toAppRecipe = async (dbRecipe: DbRecipe): Promise<Recipe> => {
  // Get ingredients
  const { data: ingredientsData, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*')
    .eq('recipe_id', dbRecipe.id);

  if (ingredientsError) {
    console.error('Error fetching ingredients:', ingredientsError);
    throw ingredientsError;
  }

  // Get steps
  const { data: stepsData, error: stepsError } = await supabase
    .from('steps')
    .select('*')
    .eq('recipe_id', dbRecipe.id)
    .order('order_number', { ascending: true });

  if (stepsError) {
    console.error('Error fetching steps:', stepsError);
    throw stepsError;
  }

  // Get labels
  const { data: labelsData, error: labelsError } = await supabase
    .from('labels')
    .select('*')
    .eq('recipe_id', dbRecipe.id);

  if (labelsError) {
    console.error('Error fetching labels:', labelsError);
    throw labelsError;
  }

  // Convert to app model
  const ingredients: Ingredient[] = ingredientsData.map(ing => ({
    id: ing.id,
    name: ing.name,
    amount: ing.amount,
    unit: ing.unit
  }));

  const steps: Step[] = stepsData.map(step => ({
    id: step.id,
    description: step.description
  }));

  const labels: string[] = labelsData.map(label => label.name);

  return {
    id: dbRecipe.id,
    title: dbRecipe.title,
    description: dbRecipe.description,
    imageUrl: dbRecipe.image_url,
    prepTime: dbRecipe.prep_time,
    cookTime: dbRecipe.cook_time,
    servings: dbRecipe.servings,
    ingredients,
    steps,
    labels,
    createdAt: new Date(dbRecipe.created_at),
    updatedAt: new Date(dbRecipe.updated_at),
    userId: dbRecipe.user_id
  };
};

// Services
export const recipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }

    // Convert to app model
    const fullRecipes = await Promise.all(recipes.map(recipe => toAppRecipe(recipe)));
    return fullRecipes;
  },

  async getRecipeById(id: string): Promise<Recipe | null> {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      console.error('Error fetching recipe:', error);
      throw error;
    }

    return await toAppRecipe(recipe);
  },

  async createRecipe(recipeData: RecipeFormData, userId: string): Promise<Recipe> {
    // Start a transaction
    const recipeId = uuidv4();

    // 1. Insert the recipe
    const { error: recipeError } = await supabase
      .from('recipes')
      .insert({
        id: recipeId,
        title: recipeData.title,
        description: recipeData.description,
        image_url: recipeData.imageUrl,
        prep_time: recipeData.prepTime,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings,
        user_id: userId
      });

    if (recipeError) {
      console.error('Error creating recipe:', recipeError);
      throw recipeError;
    }

    // 2. Insert ingredients
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      const ingredients = recipeData.ingredients.map(ingredient => ({
        id: ingredient.id,
        recipe_id: recipeId,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
      }));

      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .insert(ingredients);

      if (ingredientsError) {
        console.error('Error creating ingredients:', ingredientsError);
        throw ingredientsError;
      }
    }

    // 3. Insert steps
    if (recipeData.steps && recipeData.steps.length > 0) {
      const steps = recipeData.steps.map((step, index) => ({
        id: step.id,
        recipe_id: recipeId,
        description: step.description,
        order_number: index
      }));

      const { error: stepsError } = await supabase
        .from('steps')
        .insert(steps);

      if (stepsError) {
        console.error('Error creating steps:', stepsError);
        throw stepsError;
      }
    }

    // 4. Insert labels
    if (recipeData.labels && recipeData.labels.length > 0) {
      const labels = recipeData.labels.map(label => ({
        id: uuidv4(),
        recipe_id: recipeId,
        name: label
      }));

      const { error: labelsError } = await supabase
        .from('labels')
        .insert(labels);

      if (labelsError) {
        console.error('Error creating labels:', labelsError);
        throw labelsError;
      }
    }

    // Fetch the newly created recipe
    return await this.getRecipeById(recipeId) as Recipe;
  },

  async updateRecipe(id: string, recipeData: RecipeFormData): Promise<Recipe> {
    // 1. Update the recipe
    const { error: recipeError } = await supabase
      .from('recipes')
      .update({
        title: recipeData.title,
        description: recipeData.description,
        image_url: recipeData.imageUrl,
        prep_time: recipeData.prepTime,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (recipeError) {
      console.error('Error updating recipe:', recipeError);
      throw recipeError;
    }

    // 2. Delete old ingredients, steps, and labels
    const { error: deleteIngredientsError } = await supabase
      .from('ingredients')
      .delete()
      .eq('recipe_id', id);

    if (deleteIngredientsError) {
      console.error('Error deleting ingredients:', deleteIngredientsError);
      throw deleteIngredientsError;
    }

    const { error: deleteStepsError } = await supabase
      .from('steps')
      .delete()
      .eq('recipe_id', id);

    if (deleteStepsError) {
      console.error('Error deleting steps:', deleteStepsError);
      throw deleteStepsError;
    }

    const { error: deleteLabelsError } = await supabase
      .from('labels')
      .delete()
      .eq('recipe_id', id);

    if (deleteLabelsError) {
      console.error('Error deleting labels:', deleteLabelsError);
      throw deleteLabelsError;
    }

    // 3. Insert new ingredients
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      const ingredients = recipeData.ingredients.map(ingredient => ({
        id: uuidv4(),
        recipe_id: id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
      }));

      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .insert(ingredients);

      if (ingredientsError) {
        console.error('Error creating ingredients:', ingredientsError);
        throw ingredientsError;
      }
    }

    // 4. Insert new steps
    if (recipeData.steps && recipeData.steps.length > 0) {
      const steps = recipeData.steps.map((step, index) => ({
        id: uuidv4(),
        recipe_id: id,
        description: step.description,
        order_number: index
      }));

      const { error: stepsError } = await supabase
        .from('steps')
        .insert(steps);

      if (stepsError) {
        console.error('Error creating steps:', stepsError);
        throw stepsError;
      }
    }

    // 5. Insert new labels
    if (recipeData.labels && recipeData.labels.length > 0) {
      const labels = recipeData.labels.map(label => ({
        id: uuidv4(),
        recipe_id: id,
        name: label
      }));

      const { error: labelsError } = await supabase
        .from('labels')
        .insert(labels);

      if (labelsError) {
        console.error('Error creating labels:', labelsError);
        throw labelsError;
      }
    }

    // Fetch the updated recipe
    return await this.getRecipeById(id) as Recipe;
  },

  async deleteRecipe(id: string): Promise<void> {
    // The database cascade will handle deleting related entities
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    const filename = `${uuidv4()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);
      
    return publicUrl;
  }
};
