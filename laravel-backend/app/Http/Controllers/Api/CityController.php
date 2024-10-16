<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CityResource;


class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cities = City::all();
        return CityResource::collection($cities);
        
    }

   
    public function store(Request $request)
    {
        try{

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:cities,name',
                'description' => 'required|string|max:500',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',    
            ], [
                'name.required' => 'City name is required.',
                'name.string' => 'City name must be a string.',
                'name.max' => 'City name may not be greater than 255 characters.',
                'name.unique' => 'City name must be unique.',
                'description.string' => 'Description must be a string.',
                'description.max' => 'Description may not be greater than 500 characters.',
                "image.image" => "The image must be a valid image file.",
                "image.required" => "City image is required.",
                "image.mimes" => "The image must be in jpeg, png, jpg, or gif format.",
                "image.max" => "The image size should not exceed 2MB.",
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
      
            $my_path = '';
            if(request()->hasFile("image")){
                $image = request()->file("image");
                $my_path=$image->store('images','category_image');
                $my_path= asset('uploads/categories/' . $my_path); 
            }
    
    
            $city = new City();
    
            $city->name = $request->name;
            $city->discription = $request->description;
            $city->image = $my_path;
            $city->save();
    
    
            return response()->json(['message' => 'City created successfully', 'city' => $city], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    
    
    }

    /**
     * Display the specified resource.
     */
    public function show(City $city)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, City $city)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(City $city)
    {
        $city->delete();
        return response()->json(['message' => 'city deleted successfully'], 200);
    
    }
}
