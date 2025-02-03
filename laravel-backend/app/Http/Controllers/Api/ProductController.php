<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\Product;

use App\Models\Offer;
use App\Models\Color;
use App\Models\Size;

use App\Models\AddedOffer;

use App\Models\WishList;
use App\Models\OrderItem;

use App\Models\Category;

use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

use Illuminate\Support\Facades\Auth;


class ProductController extends Controller
{
    


    

    public function getMostOfferedProducts()
    {
        $products = Product::with(['category', 'user', 'images', 'addedOffers.offer'])
            ->get()
            ->map(function ($product) {
                $totalDiscount = $product->addedOffers->sum(function ($addedOffer) {
                    return $addedOffer->getDiscountAmount();
                });
                $product->total_discount = $totalDiscount;    
                return $product;
            })
            ->sortByDesc('total_discount')
            ->take(8);
    
        return ProductResource::collection($products);
    }
    



        public function getProductsByOffer(Request $request)
{
    $page = $request->input('page', 1);
    $itemsPerPage = $request->input('itemsPerPage', 10);
    $searchCriteria = $request->input('searchCriteria', null);
    $searchTerm = $request->input('searchTerm', null);
    $priceFrom = $request->input('priceFrom', null);
    $priceTo = $request->input('priceTo', null);
    $offer_id = $request->input('offerId');

    $query = Product::whereHas('addedOffers', function ($query) use ($offer_id) {
        $query->where('offer_id', $offer_id);
    })
    ->with(['category', 'user', 'images', 'addedOffers']);

    if (!empty($searchTerm)) {
        if ($searchCriteria === 'name') {
            $query->where('products.product_name', 'LIKE', '%' . $searchTerm . '%');
        } elseif ($searchCriteria === 'category') {
            $query->whereHas('category', function ($q) use ($searchTerm) {
                $q->where('category_name', 'LIKE', '%' . $searchTerm . '%');
            });
        }
    }

    if (!empty($priceFrom)) {
        $query->where('products.price', '>=', $priceFrom);
    }
    if (!empty($priceTo)) {
        $query->where('products.price', '<=', $priceTo);
    }

    $paginatedProducts = $query->paginate($itemsPerPage, ['*'], 'page', $page);

    return ProductResource::collection($paginatedProducts)
        ->additional(['total' => $paginatedProducts->total()]);
}

        public function removeProductOffer(Request $request)
        {
    
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'offer_id' => 'required|exists:offers,id',
            ]); 
    
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $data = $validator->validated();

            $addedOffer = AddedOffer::where('product_id' ,$data['product_id'])
            ->where('offer_id', $data['offer_id'])->first();
            if(!$addedOffer){
                return response()->json(['errors' => 'added offer not found'], 404);
            }
            $addedOffer->delete();
            return response()->json(['message' => 'removed succesffuly'], 200);

        }
                    

    

        

        public function getRelatedProducts(Category $category)
        {
             
            $topProducts = Product::where('category_id', $category->id)
            ->with(['category', 'user', 'images', 'addedOffers'])
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->select('products.*', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_ordered')) 
            ->groupBy('products.id')
            ->orderByDesc('total_ordered')
            ->limit(6)
            ->get();
    
        if ($topProducts->count() < 6) {
            $additionalProducts = Product::where('category_id', $category->id)->
            with(['category', 'user', 'images', 'addedOffers'])
                ->whereNotIn('id', $topProducts->pluck('id'))
                ->limit(6 - $topProducts->count())
                ->get();
            
            $topProducts = $topProducts->merge($additionalProducts);
        }
            return ProductResource::collection($topProducts);
        }
        
    public function getProductsByCategory(Category $category)
    {
         
        $topProducts = Product::where('category_id', $category->id)
        ->with(['category', 'user', 'images', 'addedOffers'])
        ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
        ->select('products.*', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_ordered')) 
        ->groupBy('products.id')
        ->orderByDesc('total_ordered')
        ->limit(6)
        ->get();

    if ($topProducts->count() < 6) {
        $additionalProducts = Product::where('category_id', $category->id)->
        with(['category', 'user', 'images', 'addedOffers'])
            ->whereNotIn('id', $topProducts->pluck('id'))
            ->limit(6 - $topProducts->count())
            ->get();
        
        $topProducts = $topProducts->merge($additionalProducts);
    }
        return ProductResource::collection($topProducts);
    }
    
    



public function getMostSelledProducts()
{
    $topProducts = Product::with(['category', 'user', 'images', 'addedOffers'])
        ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
        ->select('products.*', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_ordered')) 
        ->groupBy('products.id')
        ->orderByDesc('total_ordered')
        ->limit(6)
        ->get();

      

    if ($topProducts->count() < 6) {
        $additionalProducts = Product::with(['category', 'user', 'images', 'addedOffers'])
            ->whereNotIn('id', $topProducts->pluck('id'))
            ->limit(6 - $topProducts->count())
            ->get();
        
        $topProducts = $topProducts->merge($additionalProducts);
    }

    return ProductResource::collection($topProducts); 
}





public function index(Request $request)
{
    $page = $request->input('page', 1);
    $itemsPerPage = $request->input('itemsPerPage', 10);
    $searchCriteria = $request->input('searchCriteria', null);
    $searchTerm = $request->input('searchTerm', null);
    $priceFrom = $request->input('priceFrom', null);
    $priceTo = $request->input('priceTo', null);

    // $query = Product::with(['category', 'user', 'images', 'addedOffers'])
    //     ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
    //     ->select('products.*', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_ordered'))
    //     ->groupBy('products.id')
    //     ->orderByDesc('total_ordered');
    $query = Product::with(['category', 'user', 'images', 'addedOffers'])
    ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
    ->select('products.*', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_ordered'))
    ->groupBy('products.id') 
    ->orderByDesc('total_ordered')
    ->orderBy('products.id');



        // return response()->json(['page' =>  $page,'itemsPerPage' =>  $itemsPerPage,
        // 'searchCriteria' =>  $searchCriteria,'searchTerm' =>  $searchTerm,'priceFrom' =>  $priceFrom,'priceTo' =>  $priceTo],200);

    if (!empty($searchTerm)) {
        if ($searchCriteria === 'name') {
            $query->where('products.product_name', 'LIKE', '%' . $searchTerm . '%');
        } elseif ($searchCriteria === 'category') {
            $query->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('categories.category_name', 'LIKE', '%' . $searchTerm . '%');

            // $query->where('products.description', 'LIKE', '%' . $searchTerm . '%');
        }
    }

    if (!empty($priceFrom)) {
        $query->where('products.price', '>=', $priceFrom);
    }
    if (!empty($priceTo)) {
        $query->where('products.price', '<=', $priceTo);
    }

    $paginatedProducts = $query->paginate($itemsPerPage, ['*'], 'page', $page);

    return ProductResource::collection($paginatedProducts)
        ->additional(['total' => $paginatedProducts->total()]);
}





public function getAlldeleted(Request $request)
{



    $page = $request->input('page', 1);
    $itemsPerPage = $request->input('itemsPerPage', 10);
    $searchCriteria = $request->input('searchCriteria', null);
    $searchTerm = $request->input('searchTerm', null);
    $priceFrom = $request->input('priceFrom', null);
    $priceTo = $request->input('priceTo', null);

    $query = Product::onlyTrashed()->with(['category', 'user', 'images', 'addedOffers']);    



    
    if (!empty($searchTerm)) {
        if ($searchCriteria === 'name') {
            $query->where('products.product_name', 'LIKE', '%' . $searchTerm . '%');
        } elseif ($searchCriteria === 'category') {
            $query->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('categories.category_name', 'LIKE', '%' . $searchTerm . '%');

        }
    }

    if (!empty($priceFrom)) {
        $query->where('products.price', '>=', $priceFrom);
    }
    if (!empty($priceTo)) {
        $query->where('products.price', '<=', $priceTo);
    }

    $paginatedProducts = $query->paginate($itemsPerPage, ['*'], 'page', $page);

    return ProductResource::collection($paginatedProducts)
        ->additional(['total' => $paginatedProducts->total()]);

// return ProductResource::collection($products);
}


    

    public function getMostOrderedProductsSeller()
    {


        // return response()->json(['message' =>  Auth::id()],400);


        $topProducts = Product::with(['category', 'user', 'images', 'addedOffers'])
        ->withTrashed() 
        ->where('user_id', Auth::id())
        ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
        ->select('products.*', DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_ordered'))
        ->groupBy('products.id') 
        ->orderByDesc('total_ordered')
        ->limit(6)

        ->get();
    if ($topProducts->count() < 6) {
        $additionalProducts = Product::with(['category', 'user', 'images', 'addedOffers'])
            ->whereNotIn('id', $topProducts->pluck('id'))
            ->where('user_id', Auth::id())

            ->limit(6 - $topProducts->count())

            ->get();
        
        $topProducts = $topProducts->merge($additionalProducts);
    }

        return ProductResource::collection($topProducts);
    }


    public function getMyProduct()
    {

        $products = Product::with(['category', 'user' , 'images' , 'addedOffers'])->
        where('user_id' , Auth::id())->get();
        return ProductResource::collection($products);
    }
    

    public function productsInWishlist()
    {

        $wishlistItems = WishList::where('user_id',Auth::id())->get()->pluck('product_id');
        // return response()->json(['data' => $wishlistItems],200);
 
        $products = Product::with(['category', 'user', 'images', 'addedOffers'])
        ->whereIn('id', $wishlistItems)
        ->get();

        // $products = Product::with(['category', 'user' , 'images' , 'addedOffers'])->get();
        return ProductResource::collection($products);
    }
    

    
    
    



    public function updateProduct(Request $request)
    {
        

       
        try {
            $validator = Validator::make($request->all(), [
                'id' => 'required|exists:products,id',

                'product_name' => 'required|string|max:255',
                'material' => 'nullable|string|max:255',
                'cover_image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
                'colors' => 'nullable|array',
                'colors.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048',
                'sizes' => 'required|array',
                'sizes.*.size' => 'required|string|max:255', 
                'sizes.*.price' => 'required|numeric|min:0',
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
            $product = Product::find($data['id']);

            $category = Category::find($data['category_id']);

            if (!$category) {
                return response()->json(['error' => 'Invalid category ID'], 404);
            }
            if (!$product) {
                return response()->json(['error' => 'product not found'], 404);
            }
    
            $video_path =$product->video;
            if ($request->hasFile('video')) {

                    $path = $data['video'] ->store('videos', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $video_path = $path;
               
            }
            $image_path =$product->cover_image;
            if ($request->hasFile('cover_image')) {

                
                    $path = $data['cover_image'] ->store('cover_images', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $image_path = $path;
               
            }

            $product->product_name = $data['product_name'];
            $product->price = $data['price'];
            $product->description = $data['description'];
            $product->stock = $data['stock'];
            $product->video = $video_path;
            $product->cover_image = $image_path;

            // $product->user_id = Auth::id();
            $product->category_id = $data['category_id']; 
            $product->size = ''; 
            if($data['material']){
                $product->material = $data['material']; 

            }else{
                $product->material = ''; 

            }
                        $product->save();

            

            // return response()->json(['data' => $request->all() ,'header' => $request->headers->all()],200);


            if ($request->hasFile('images')) {

// $oldImages = ProductImage::where('product_id' ,  $product->id )->delete();
$oldImages = ProductImage::where('product_id', $product->id)->get(); // Retrieve the images

foreach ($oldImages as $image) {
    $url = $image->image;
    $relativePath = str_replace(asset('uploads/products/') . '/', '', $url);
    // Storage::delete($image->path);  
    if (Storage::disk('products')->exists($relativePath)) {
        Storage::disk('products')->delete($relativePath);
    }

    $image->delete();
}


                foreach ($data['images'] as $image) {
                    $path = $image->store('images', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $productImage = new ProductImage();
                    $productImage->product_id =  $product->id;
                    $productImage->image = $path;
                    $productImage->save();
                }
            }
         

            if ($request->hasFile('colors')) {

                // $oldImages = ProductImage::where('product_id' ,  $product->id )->delete();
                $oldImages = Color::where('product_id', $product->id)->get(); // Retrieve the images
                
                foreach ($oldImages as $image) {
                    $url = $image->image;
                    $relativePath = str_replace(asset('uploads/products/') . '/', '', $url);
                    // Storage::delete($image->path);  
                    if (Storage::disk('products')->exists($relativePath)) {
                        Storage::disk('products')->delete($relativePath);
                    }
                
                    $image->delete();
                }
                
                
                                foreach ($data['colors'] as $image) {
                                    $path = $image->store('colors', 'products');
                                    $path= asset('uploads/products/' . $path); 
                                    $productImage = new Color();
                                    $productImage->product_id =  $product->id;
                                    $productImage->image = $path;
                                    $productImage->color = '';
                                    $productImage->save();
                                }
                            }


                            $product->sizes->each(function ($size) {
                                $size->delete();
                            });


                            $lowestPrice = $product->price;

                                            // return response()->json(['error' => $size['price']], 500);
                              
                            foreach ($data['sizes'] as $size) {
                                // return response()->json(['error' => $size['price']], 500);
                                if($lowestPrice > $size['price']){
                                    $lowestPrice =$size['price'];
                                }
                    $sizeObject = new Size();
                    $sizeObject->size = $size['size'];
                    $sizeObject->price =  $size['price'];
                    $sizeObject->product_id =  $product->id;
                    $sizeObject->save();
                }


                $product->price =$lowestPrice;
                $product->save();
            return response()->json(['message' => 'Product updates successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
        }

    public function store(Request $request)
    {
     
        try {
            $validator = Validator::make($request->all(), [
                'product_name' => 'required|string|max:255',
                // 'size' => 'required|string|max:255',
                'material' => 'nullable|string|max:255',
                'cover_image' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048',

                'price' => 'required|numeric',
                'description' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048',
                'colors' => 'nullable|array',
                'colors.*' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048',
                'sizes' => 'required|array',
                'sizes.*.size' => 'required|string|max:255', 
                'sizes.*.price' => 'required|numeric|min:0',

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
            $product->size = ''; 
            // return response()->json(['error' => $product->price], 500);

            if($data['material']){
                $product->material = $data['material']; 

            }else{
                $product->material = ''; 

            }
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

            if ($request->hasFile('colors')) {
                foreach ($data['colors'] as $image) {
                    $path = $image->store('colors', 'products');
                    $path= asset('uploads/products/' . $path); 
                    $colorImage = new Color();
                    $colorImage->color = "";
                    $colorImage->product_id =  $product->id;
                    $colorImage->image = $path;
                    $colorImage->save();
                }
            }

            $lowestPrice = $product->price;

            foreach ($data['sizes'] as $size) {
                            // return response()->json(['error' => $size['price']], 500);
                if($lowestPrice > $size['price']){
                    $lowestPrice =$size['price'];
                }
                $sizeObject = new Size();
                $sizeObject->size = $size['size'];
                $sizeObject->price =  $size['price'];
                $sizeObject->product_id =  $product->id;
                $sizeObject->save();
            }

            $product->price = $lowestPrice;
            $product->save();
            return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
        }


    
    public function show(Product $product)
     {

    return new ProductResource($product->load('category', 'user'));


    }
  
    public function destroy(Product $product)
    {


        
        return response()->json(['message' => $product->cartItems , 403]);

        $product->delete();

        return response()->json(['message' => 'Product soft deleted successfully.']);
    }
    
    
 
    
    public function restore($product_id)
    {
        $product = Product::withTrashed()->find($product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
        $product->restore();
        return response()->json(['message' => 'done suuccessfully.'], 200);
    }

    public function forceDestroy($id)
    {
        $product = Product::withTrashed()->find($id);
            // return response()->json(['message' => $product->cartItems , 403]);
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
    
        $product->forceDelete();
        return response()->json(['message' => 'Product hard deleted successfully.']);
    }
    
}

