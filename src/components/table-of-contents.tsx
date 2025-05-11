
import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TableOfContentsProps {
  recipes: Recipe[];
  onSelectRecipe: (index: number) => void;
}

export function TableOfContents({ recipes, onSelectRecipe }: TableOfContentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sort recipes alphabetically by title
  const sortedRecipes = [...recipes].sort((a, b) => 
    a.title.localeCompare(b.title)
  );
  
  // Filter recipes based on search query - only look in titles
  const filteredRecipes = sortedRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find the original index of the filtered recipe
  const getOriginalIndex = (recipe: Recipe) => {
    return recipes.findIndex(r => r.id === recipe.id);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-indie font-bold text-olive-900 mb-2">Table of Contents</h2>
        <p className="text-olive-700 italic font-indie">Your personal collection of delightful recipes</p>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recipes by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 font-indie"
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full font-indie">Recipe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecipes.map((recipe) => (
            <TableRow 
              key={recipe.id} 
              className="cursor-pointer hover:bg-olive-50"
              onClick={() => onSelectRecipe(getOriginalIndex(recipe))}
            >
              <TableCell className="flex items-center p-4">
                <div className="w-16 h-16 overflow-hidden rounded-lg border border-olive-200 mr-4 flex-shrink-0">
                  <img 
                    src={recipe.imageUrl || "/placeholder.svg"} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-indie font-medium text-lg">{recipe.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1 font-indie">{recipe.description}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {filteredRecipes.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-10 text-muted-foreground font-indie">
                {searchQuery ? 
                  `No recipes found matching "${searchQuery}"` : 
                  "No recipes available"
                }
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
