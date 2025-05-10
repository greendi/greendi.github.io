
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, ChefHat, Clock, Users, Tag, Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { RecipeFormData } from "@/types/recipe";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";

const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  prepTime: z.coerce.number().min(1, "Preparation time is required"),
  cookTime: z.coerce.number().min(1, "Cooking time is required"),
  servings: z.coerce.number().min(1, "Number of servings is required"),
  ingredients: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Ingredient name is required"),
      amount: z.string().min(1, "Amount is required"),
      unit: z.string(),
    })
  ).min(1, "At least one ingredient is required"),
  steps: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(3, "Step description is required"),
    })
  ).min(1, "At least one step is required"),
  labels: z.array(z.string()).default([]),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  defaultValues?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export function RecipeForm({ defaultValues, onSubmit, isEditing = false, isSubmitting = false }: RecipeFormProps) {
  const [labelInput, setLabelInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(defaultValues?.imageUrl || null);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      imageUrl: defaultValues?.imageUrl || "",
      prepTime: defaultValues?.prepTime || 15,
      cookTime: defaultValues?.cookTime || 30,
      servings: defaultValues?.servings || 4,
      ingredients: defaultValues?.ingredients || [
        { id: uuidv4(), name: "", amount: "", unit: "" }
      ],
      steps: defaultValues?.steps || [
        { id: uuidv4(), description: "" }
      ],
      labels: defaultValues?.labels || [],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = 
    useFieldArray({ control: form.control, name: "ingredients" });

  const { fields: stepFields, append: appendStep, remove: removeStep } = 
    useFieldArray({ control: form.control, name: "steps" });

  const labels = form.watch("labels");

  const addLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      form.setValue("labels", [...labels, labelInput.trim()]);
      setLabelInput("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    form.setValue("labels", labels.filter(label => label !== labelToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image is too large. Please select an image under 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
      form.setValue("imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (data: RecipeFormValues) => {
    try {
      onSubmit(data as RecipeFormData);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="border-olive-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-olive-800">
              {isEditing ? "Edit Recipe" : "Create New Recipe"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Delicious Pasta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A brief description of your recipe..." 
                          className="resize-none h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Recipe Image (optional)</FormLabel>
                  <div className="mt-2 space-y-2">
                    {previewImage && (
                      <div className="relative w-full h-40 overflow-hidden rounded-md border border-gray-200">
                        <img 
                          src={previewImage} 
                          alt="Recipe preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPreviewImage(null);
                            form.setValue("imageUrl", "");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {!previewImage && (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG (max. 5MB)</p>
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Prep (mins)
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cookTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center">
                            <ChefHat className="w-4 h-4 mr-1" />
                            Cook (mins)
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Servings
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <FormLabel className="flex items-center mb-2">
                    <Tag className="w-4 h-4 mr-1" />
                    Labels
                  </FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {labels.map((label) => (
                      <div 
                        key={label} 
                        className="bg-olive-100 text-olive-800 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                      >
                        {label}
                        <button 
                          type="button"
                          onClick={() => removeLabel(label)}
                          className="text-olive-600 hover:text-olive-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a label (e.g. Vegan, Spicy)" 
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addLabel();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLabel}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-olive-100 pt-4">
              <FormLabel className="mb-2 block">Ingredients</FormLabel>
              <div className="space-y-3">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Ingredient" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input placeholder="Qty" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input placeholder="Unit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-olive-600 hover:text-olive-800 hover:bg-olive-50"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredientFields.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendIngredient({ id: uuidv4(), name: "", amount: "", unit: "" })}
                  className="w-full border-dashed border-olive-300"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>
            </div>

            <div className="border-t border-olive-100 pt-4">
              <FormLabel className="mb-2 block">Steps</FormLabel>
              <div className="space-y-3">
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3">
                    <div className="flex items-center justify-center px-2 py-1 bg-olive-100 rounded text-olive-800 font-medium min-w-[30px] h-10">
                      {index + 1}
                    </div>
                    <FormField
                      control={form.control}
                      name={`steps.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Step description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-olive-600 hover:text-olive-800 hover:bg-olive-50"
                      onClick={() => removeStep(index)}
                      disabled={stepFields.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendStep({ id: uuidv4(), description: "" })}
                  className="w-full border-dashed border-olive-300"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Step
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-olive-100 pt-4">
            <Button type="submit" className="bg-olive-700 hover:bg-olive-800" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {isEditing ? "Updating Recipe..." : "Creating Recipe..."}
                </>
              ) : (
                isEditing ? "Update Recipe" : "Create Recipe"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
