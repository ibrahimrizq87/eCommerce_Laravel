<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\SellerResource;

class SellerController extends Controller
{
    /**
     * Display a listing of the sellers.
     */
    public function index()
    {
        try {
            // $sellers = Seller::with(relations: 'user')->get();
            $sellers = Seller::with(relations: 'user')->where('status','active')->get();  
            return SellerResource::collection($sellers);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve sellers: ' . $e->getMessage()], 500);
        }
    }



    public function getBanned()
    {
        $sellers = Seller::with(relations: 'user')->where('status','banned')->get();  
        return SellerResource::collection($sellers);
    }

    public function banSeller($id)
    {

        try{
        $seller = Seller::find($id);
        if (!$seller){
            return response()->json(['errors' => 'user not found'], 404);
 
        }  
        $seller->status = 'banned';
        $seller->save();

        return response()->json(['message' => 'banned successfully'], 200);
    }catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }

}
public function unBanSeller($id)
{

    try{
    $seller = Seller::find($id);
    if (!$seller){
        return response()->json(['errors' => 'user not found'], 404);

    }  
    $seller->status = 'active';
    $seller->save();

    return response()->json(['message' => 'activated successfully'], 200);
}catch (\Exception $e) {
    return response()->json(['error' => $e->getMessage()], 500);
}

}

  


    /**
     * Store a newly created seller in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'phone' => 'required|string|max:15',
                'address' => 'required|string|max:255',
                'shope_name' => 'required|string|max:255',
                'about' => 'nullable|string|max:255',
                'user_id' => 'required|exists:users,id',  // Ensure the user exists
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // Create a new Seller
            $seller = Seller::create([
                'phone' => $request->phone,
                'address' => $request->address,
                'shope_name' => $request->shope_name,
                'about' => $request->about,
                'total_sales' => 0,  // Default value for a new seller
                'status' => 'active',  // Default status
                'user_id' => $request->user_id,
            ]);

            return response()->json(['seller' => $seller], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create seller: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified seller.
     */
    public function show(Seller $seller)
    {
        try {
            // Return the seller with the associated user
            return response()->json($seller->load('user'), 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Seller not found: ' . $e->getMessage()], 404);
        }
    }

    /**
     * Update the specified seller in storage.
     */
    public function update(Request $request, Seller $seller)
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string|max:255',
                'shope_name' => 'nullable|string|max:255',
                'about' => 'nullable|string|max:255',
                'status' => 'nullable|string|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // Update seller details
            $seller->update($request->only(['phone', 'address', 'shope_name', 'about', 'status']));

            return response()->json(['message' => 'Seller updated successfully', 'seller' => $seller], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update seller: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified seller from storage.
     */
    public function destroy(Seller $seller)
    {
        try {
            // Delete the seller
            $seller->delete();

            return response()->json(['message' => 'Seller deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete seller: ' . $e->getMessage()], 500);
        }
    }
}
