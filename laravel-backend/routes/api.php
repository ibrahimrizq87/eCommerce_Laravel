<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AddedOfferController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\CustomOrderController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderItemController;
use App\Http\Controllers\Api\PaymentRequestController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\WishListController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('users', UserController::class);
Route::apiResource('added-offers', AddedOfferController::class);
Route::apiResource('cart-items', CartItemController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('custom-orders', CustomOrderController::class);
Route::apiResource('offers', OfferController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-items', OrderItemController::class);
Route::apiResource('payment-requests', PaymentRequestController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('reviews', ReviewController::class);
Route::apiResource('sellers', SellerController::class);
Route::apiResource('wish_lists', WishListController::class);
// Route::apiResource('added-offers', AddedOfferController::class);



