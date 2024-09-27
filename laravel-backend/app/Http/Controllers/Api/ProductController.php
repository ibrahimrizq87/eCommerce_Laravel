<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;

use App\Models\ProductImage;

use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

use Illuminate\Support\Facades\Auth;


class ProductController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth:sanctum')->only([ 'stor','update' , 'destroy']);
        
   
    // }
    
    public function getProductsByCategory(Category $category)
    {
        // Fetch products that belong to the specified category
        $products = Product::where('category_id', $category->id)
        ->with(['category', 'user', 'images', 'addedOffers'])
        ->get();        
        // Return the products as a resource collection
        return ProductResource::collection($products);
    }
    
    public function index()
    {

        // $products = Product::with(['category', 'user','images'])->paginate(10);
        $products = Product::with(['category', 'user' , 'images' , 'addedOffers'])->get();
        return ProductResource::collection($products);
    }
    

    public function store(Request $request)
    {
        // dd($request->headers->all());
        // return response()->json(['data' => $request->all() ,'header' => $request->headers->all()],200);
        // return response()->json(['data' => $request->all() ,'header' => $request->headers->all()],200);

        try {
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                'size' => 'required|string|max:255',
                'material' => 'required|string|max:255',
                'cover_image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',

                'price' => 'required|numeric',
                'description' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
                'video' => 'nullable|file|mimes:mp4,mkv,avi,webm|max:102400',
                'stock' => 'required|integer',
                'category_id' => 'required|integer|exists:categories,id',
            ], [
                'product_name.required' => 'Product name is required.',
                'product_name.string' => 'Product name must be a string.',
                'product_name.max' => 'Product name may not be greater than 255 characters.',
                'price.required' => 'Price is required.',
                'price.numeric' => 'Price must be a number.',
                'description.string' => 'Description must be a string.',
                'images.file' => 'Image must be a file.',
                'images.image' => 'The file must be an image.',
                'images.mimes' => 'Image must be of type: jpeg, png, jpg, or gif.',
                'images.max' => 'Image may not be greater than 2 MB.',
                'video.file' => 'Video must be a file.',
                'video.mimes' => 'Video must be of type: mp4, mkv, or avi.',
                'video.max' => 'Video may not be greater than 40 MB.',
                'stock.required' => 'Stock is required.',
                'stock.integer' => 'Stock must be an integer.',
                'category_id.required' => 'Category ID is required.',
                'category_id.integer' => 'Category ID must be an integer.',
                'category_id.exists' => 'Category ID does not exist.',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()],400);
            }
    
            $data = $validator->validated();

            $category = Category::find($data['category_id']);

            if (!$category) {
                return response()->json(['error' => 'Invalid category ID'], 400);
            }
    
            $video_path ='';
            if ($request->hasFile('video')) {

                
                    $path = $data['video'] ->store('videos', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $video_path = $path;
               
            }
            $image_path ='';
            if ($request->hasFile('cover_image')) {

                
                    $path = $data['cover_image'] ->store('cover_images', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $image_path = $path;
               
            }

            $product = new Product();
            $product->product_name = $data['product_name'];
            $product->price = $data['price'];
            $product->description = $data['description'];
            $product->stock = $data['stock'];
            $product->video = $video_path;
            $product->cover_image = $image_path;

            $product->user_id = Auth::id();
            $product->category_id = $data['category_id']; 
            $product->size = $data['size']; 
            $product->material = $data['material']; 
            $product->save();

            

            // return response()->json(['data' => $request->all() ,'header' => $request->headers->all()],200);


            if ($request->hasFile('images')) {
                foreach ($data['images'] as $image) {
                    $path = $image->store('images', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $productImage = new ProductImage();
                    $productImage->product_id =  $product->id;
                    $productImage->image = $path;
                    $productImage->save();
                }
            }
         


    
            return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
        }

    // public function update(Request $request, Product $product)
    // {
        
    //     $validator = Validator::make($request->all(), [
    //         'product_name' => 'required|string|max:255',
    //         'price' => 'required|numeric',
    //         'description' => 'nullable|string',
    //         'images' => 'nullable|array',
    //         'images.*' => 'file|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'videos' => 'nullable|array',
    //         'videos.*' => 'file|mimes:mp4,mkv,avi|max:102400',
    //         'stock' => 'required|integer',
    //         'category_id' => 'required|integer|exists:categories,id',
          
    //     ], [
    //         'product_name.required' => 'Product name is required.',
    //         'product_name.string' => 'Product name must be a string.',
    //         'product_name.max' => 'Product name may not be greater than 255 characters.',
    //         'price.required' => 'Price is required.',
    //         'price.numeric' => 'Price must be a number.',
    //         'description.string' => 'Description must be a string.',
    //         'images.file' => 'Image must be a file.',
    //         'images.image' => 'The file must be an image.',
    //         'images.mimes' => 'Image must be of type: jpeg, png, jpg, or gif.',
    //         'images.max' => 'Image may not be greater than 2 MB.',
    //         'videos.file' => 'Video must be a file.',
    //         'videos.mimes' => 'Video must be of type: mp4, mkv, or avi.',
    //         'videos.max' => 'Video may not be greater than 40 MB.',
    //         'stock.required' => 'Stock is required.',
    //         'stock.integer' => 'Stock must be an integer.',
    //         'category_id.required' => 'Category ID is required.',
    //         'category_id.integer' => 'Category ID must be an integer.',
    //         'category_id.exists' => 'Category ID does not exist.',
    //     ]);
    
    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }
    
    //     $data = $validator->validated();
    //     if ($request->hasFile('images')) {
    //         $imagePaths = [];
    //         Storage::disk('public')->makeDirectory('products');
    //         foreach ($data['images'] as $image) {
    //             $path = $image->store('products', 'public');
    //             $imagePaths[] = $path;
    //         }
    //         $data['images'] = implode(',', $imagePaths);
    //     }
    
    //     if ($request->hasFile('videos')) {
    //         $videoPaths = [];
    //         Storage::disk('public')->makeDirectory('videos');
    //         foreach ($data['videos'] as $video) {
    //             $path = $video->store('videos', 'public');
    //             $videoPaths[] = $path;
    //         }
    //         $data['videos'] = implode(',', $videoPaths);
    //     }
   
    //     $product->update($data);
    
    //     return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
    // }
    
    public function show(Product $product)
     {
    //     $category = Category::with('products')->find($categoryId);
    
    //     if (!$category) {
    //         return response()->json(['message' => 'Category not found'], 404);
    //     }
    
    //     return response()->json($category->products, 200);
    return new ProductResource($product->load('category', 'user'));


    }
  
    public function destroy(Product $product)
    {

        $product->delete();
        return response()->json(['message' => 'Product soft deleted successfully.']);
    }
    

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

    public function forceDestroy($id)
    {
        $product = Product::withTrashed()->find($id);
    
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
    
        $product->forceDelete();
        return response()->json(['message' => 'Product hard deleted successfully.']);
    }
    
}

