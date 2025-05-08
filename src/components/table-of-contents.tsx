
import React from "react";
import { Recipe } from "@/types/recipe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TableOfContentsProps {
  recipes: Recipe[];
  onSelectRecipe: (index: number) => void;
}

export function TableOfContents({ recipes, onSelectRecipe }: TableOfContentsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-bold text-olive-900 mb-2">Table of Contents</h2>
        <p className="text-olive-700 italic font-playfair">Your personal collection of delightful recipes</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Recipe</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe, index) => (
            <TableRow key={recipe.id}>
              <TableCell className="p-2">
                <div className="w-16 h-16 overflow-hidden rounded-lg border border-olive-200">
                  <img 
                    src={recipe.imageUrl || "/placeholder.svg"} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-playfair font-medium text-lg">{recipe.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{recipe.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onSelectRecipe(index)}
                  className="text-olive-700 hover:text-olive-900 hover:bg-olive-100"
                >
                  View <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
