
export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  id: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type RecipeFormData = Omit<Recipe, "id" | "createdAt" | "updatedAt">;
