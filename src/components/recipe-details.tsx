
import React from "react";
import { Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Users, Tag } from "lucide-react";

interface RecipeDetailsProps {
  recipe: Recipe;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const { title, description, imageUrl, prepTime, cookTime, servings, ingredients, steps, labels } = recipe;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="rounded-lg overflow-hidden border border-olive-200">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3 space-y-4">
          <h1 className="text-3xl font-bold text-olive-900">{title}</h1>
          <p className="text-olive-700">{description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-olive-700">
              <Clock className="w-4 h-4 mr-2" />
              <span>Prep: {prepTime} mins</span>
            </div>
            <div className="flex items-center text-olive-700">
              <ChefHat className="w-4 h-4 mr-2" />
              <span>Cook: {cookTime} mins</span>
            </div>
            <div className="flex items-center text-olive-700">
              <Users className="w-4 h-4 mr-2" />
              <span>Servings: {servings}</span>
            </div>
          </div>

          {labels.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="w-4 h-4 text-olive-700" />
              {labels.map((label) => (
                <Badge key={label} variant="outline" className="bg-olive-50 text-olive-700 border-olive-200">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-olive-800 mb-3">Ingredients</h2>
          <ul className="space-y-2 list-disc pl-5">
            {ingredients.map((ing) => (
              <li key={ing.id} className="text-olive-700">
                <span className="font-medium">{ing.amount} {ing.unit}</span> {ing.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-olive-800 mb-3">Instructions</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.id} className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-olive-100 text-olive-800 font-medium text-sm">
                  {index + 1}
                </div>
                <p className="text-olive-700">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
