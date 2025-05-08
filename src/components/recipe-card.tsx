
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { Clock, ChefHat, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { id, title, description, imageUrl, prepTime, cookTime, labels } = recipe;

  return (
    <Card className="recipe-card overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-olive-800 line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-muted-foreground mb-3 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center text-sm text-olive-700">
            <Clock className="w-4 h-4 mr-1" />
            <span>{prepTime + cookTime} mins</span>
          </div>
          <div className="flex items-center text-sm text-olive-700">
            <ChefHat className="w-4 h-4 mr-1" />
            <span>Prep: {prepTime} mins</span>
          </div>
        </div>
        {labels.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mt-2">
            <Tags className="w-4 h-4 text-olive-600 mr-1" />
            {labels.slice(0, 3).map((label) => (
              <Badge key={label} variant="outline" className="bg-olive-50 text-olive-700 border-olive-200">
                {label}
              </Badge>
            ))}
            {labels.length > 3 && (
              <Badge variant="outline" className="bg-olive-50 text-olive-700 border-olive-200">
                +{labels.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-olive-700 hover:bg-olive-800">
          <Link to={`/recipe/${id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
