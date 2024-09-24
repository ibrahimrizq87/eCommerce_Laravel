<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;



class CategoryController extends Controller
{

    public function index()
    {

        $categories = Category::all();
        return CategoryResource::collection($categories);
    }

 
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255|unique:categories,category_name',
            'description' => 'nullable|string|max:500',
        ], [
            'category_name.required' => 'Category name is required.',
            'category_name.string' => 'Category name must be a string.',
            'category_name.max' => 'Category name may not be greater than 255 characters.',
            'category_name.unique' => 'Category name must be unique.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description may not be greater than 500 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $validator->validated();

        $category = Category::create($data);

        return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);

    }

   

    
    public function show(Category $category)
    {

        return new CategoryResource($category);
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255|unique:categories,category_name,' . $category->id,
            'description' => 'nullable|string|max:500',
        ], [
            'category_name.required' => 'Category name is required.',
            'category_name.string' => 'Category name must be a string.',
            'category_name.max' => 'Category name may not be greater than 255 characters.',
            'category_name.unique' => 'Category name must be unique.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description may not be greater than 500 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $validator->validated();

        $category->update($data);

        return response()->json(['message' => 'Category updated successfully', 'category' => $category], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
