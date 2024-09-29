<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use App\Http\Resources\OfferResource;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
        $offers = Offer::all();
        // return response()->json(['responce' => $offers], 200);

        return OfferResource::collection($offers);
    }catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Offer $offer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Offer $offer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Offer $offer)
    {
        try{
    $offer->delete();
    return response()->json(['message' => 'deleted successfully'], 200);
}catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
