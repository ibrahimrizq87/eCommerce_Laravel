<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WishList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class WishListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'product_id' => 'required|integer|exists:products,id',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }
            if (WishList::where('product_id', $request->input('product_id'))
            ->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Item is already in your wishlist'], 409); 
        }

            $item = new WishList();
            $item->product_id = $request->input('product_id');
            $item->user_id = Auth::id();
            $item->save();
    
            return response()->json(['message' => 'item added successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Display the specified resource.
     */
    public function show(WishList $wishList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WishList $wishList)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WishList $wishList)
    {
        //
    }
}
