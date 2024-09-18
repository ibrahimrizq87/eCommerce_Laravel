<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'product_name' => $this->product_name,
            'price' => $this->price,
            'description' => $this->description,
            'images' => $this->images,
            'videos' => $this->videos,
            'stock' => $this->stock,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'user' => new UserResource($this->whenLoaded('user')),
            // 'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            // 'cart_items' => CartItemResource::collection($this->whenLoaded('cartItems')),
            // 'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
        ];
    }
}
