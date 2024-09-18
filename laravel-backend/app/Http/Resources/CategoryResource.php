<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id, 
            'category_name' => $this->category_name,
            'description' => $this->description,
            // 'products' => ProductResource::collection($this->whenLoaded('products')), 
            'created_at' => $this->created_at->toDateTimeString(), 
            'updated_at' => $this->updated_at->toDateTimeString(), 
        ];
    }
}