<?php

namespace App\Http\Controllers\Api;

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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
