<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all(); // لجلب جميع الفئات
        return response()->json($categories, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // الفاليديشن
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

        // التحقق من الفاليديشن
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // استعادة البيانات
        $data = $validator->validated();

        // إنشاء الفئة في الداتا بيز
        $category = Category::create($data);

        return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category, 200); // عرض تفاصيل الفئة
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        // الفاليديشن
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

        // التحقق من الفاليديشن
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // استعادة البيانات
        $data = $validator->validated();

        // تحديث الفئة
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
