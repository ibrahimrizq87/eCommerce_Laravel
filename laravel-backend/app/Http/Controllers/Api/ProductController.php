<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'user'])->paginate(10);
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'product_name' => 'required|string|max:255',
    //         'price' => 'required|numeric',
    //         'description' => 'nullable|string',
    //         'stock' => 'required|integer',
    //         'category_id' => 'required|exists:categories,id',
    //         'user_id' => 'required|exists:users,id',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $product = Product::create($request->all());
    //     return new ProductResource($product->load('category', 'user'));
    // }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return new ProductResource($product->load('category', 'user'));
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Product $product)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'product_name' => 'sometimes|string|max:255',
    //         'price' => 'sometimes|numeric',
    //         'description' => 'nullable|string',
    //         'stock' => 'sometimes|integer',
    //         'category_id' => 'sometimes|exists:categories,id',
    //         'user_id' => 'sometimes|exists:users,id',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $product->update($request->all());
    //     return new ProductResource($product->load('category', 'user'));
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product soft deleted successfully.']);
    }
    
    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        // Find the soft-deleted product by its ID
        $product = Product::withTrashed()->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Restore the product
        $product->restore();

        // Return the restored product with ProductResource
        return new ProductResource($product->load('category', 'user'));
    }
}
