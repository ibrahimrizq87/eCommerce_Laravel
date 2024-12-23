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
use App\Http\Controllers\Api\VerificationController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\DeliveryController;


use App\Http\Controllers\Api\PaymentController;

Route::get('products/most-selled', [ProductController::class , 'getMostSelledProducts']);
Route::get('products/most-offered', [ProductController::class , 'getMostOfferedProducts']);
Route::get('products/most-ordered-seller', [ProductController::class , 'getMostOrderedProductsSeller'])->middleware('auth:sanctum');

Route::get('orders/restore/{order_id}', [OrderController::class , 'restore'])->middleware('auth:sanctum');

Route::post('orders/edit-order', [OrderController::class , 'updateOrderStatus'])->middleware('auth:sanctum');

Route::get('orders/deleted', [OrderController::class , 'getDeletedOrders'])->middleware('auth:sanctum');



Route::get('order-items/admin-waiting-orderitems', [OrderItemController::class , 'getWaitingOrderItems'])->middleware('auth:sanctum');
Route::get('order-items/admin-done-orderitems', [OrderItemController::class , 'getDoneOrderItems'])->middleware('auth:sanctum');
Route::get('order-items/admin-doing-orderitems', [OrderItemController::class , 'getDoingOrderItems'])->middleware('auth:sanctum');


Route::get('order-items/my-items-old/{order_id}', [OrderItemController::class , 'getMyOldOrderItems'])->middleware('auth:sanctum');

Route::get('order-items/my-items/{order_id}', [OrderItemController::class , 'getMyOrderItems'])->middleware('auth:sanctum');
Route::get('order-items/seller-orders', [OrderItemController::class , 'getSellerOrdersItems'])->middleware('auth:sanctum');
Route::get('order-items/craft-order/{item_id}', [OrderItemController::class , 'craftOrderItem'])->middleware('auth:sanctum');
Route::get('order-items/serve-order/{item_id}', [OrderItemController::class , 'serveOrderItem'])->middleware('auth:sanctum');
Route::get('order-items/done-order/{item_id}', [OrderItemController::class , 'doneOrderItem'])->middleware('auth:sanctum');
Route::get('order-items/doing-order', [OrderItemController::class , 'getDoingOrders'])->middleware('auth:sanctum');
Route::get('order-items/done-order-seller', [OrderItemController::class , 'getDoneOrders'])->middleware('auth:sanctum');
// Route::get('sellers/seller/{order_id}', [SellerController::class , 'getSellerById'])->middleware('auth:sanctum');
Route::get('customers/customer/{order_id}', [CustomerController::class , 'getCustomerById'])->middleware('auth:sanctum');
Route::get('orders/my-orders', [OrderController::class , 'getMyOrder'])->middleware('auth:sanctum');
Route::get('orders/my-orders-old', [OrderController::class , 'getMyOldOrder'])->middleware('auth:sanctum');


Route::get('customers/me', [CustomerController::class , 'getMyCustomer'])->middleware('auth:sanctum');
Route::get('order-items/old-order-items', [OrderItemController::class , 'getMyOldOrderItems'])->middleware('auth:sanctum');

Route::post('customers/update/customer', [CustomerController::class , 'updateCustomer'])->middleware('auth:sanctum');

Route::get('order-items/deliver-order/{item_id}', [OrderItemController::class , 'payForOrderItem'])->middleware('auth:sanctum');
Route::post('users/update-password', [UserController::class , 'updatePassword'])->middleware('auth:sanctum');
// Route::post('sellers/update/seller', [SellerController::class , 'updateSeller'])->middleware('auth:sanctum');
Route::post('/offers/remove-product-from-offer', [ProductController::class , 'removeProductOffer'])->middleware('auth:sanctum');
Route::get('/cart-items/my-items', [CartItemController::class , 'getMyItems'])->middleware('auth:sanctum');
Route::get('/products/byOffer/{offer_id}', [ProductController::class , 'getProductsByOffer'])->middleware('auth:sanctum');
Route::post('/offers/add-offer-to-products', [OfferController::class , 'addOfferToProducts'])->middleware('auth:sanctum');
Route::get('/offers/getMyOffers', [OfferController::class , 'getMyOffers'])->middleware('auth:sanctum');
Route::get('/products/myProduct', [ProductController::class , 'getMyProduct'])->middleware('auth:sanctum');
Route::post('/products/update', [ProductController::class , 'updateProduct'])->middleware('auth:sanctum');

Route::post('/users/add-delivery', [UserController::class , 'addDelivery'])->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->middleware(['signed'])
    ->name('verification.verify');


    
    Route::get('/customers/ban/{id}', [CustomerController::class, 'banCustomer'])->middleware('auth:sanctum');
    Route::get('/customers/unBan/{id}', [CustomerController::class, 'unBanCustomer'])->middleware('auth:sanctum');
    Route::get('/customers/banned', [CustomerController::class, 'getBanned'])->middleware('auth:sanctum');
    

Route::post('users/reset-password', [UserController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('users/reset', [UserController::class, 'resetPassword'])->name('password.reset');

Route::post('users/email/resend', [VerificationController::class, 'resend'])
    ->middleware('auth:sanctum');

Route::post('users/login', [UserController::class, 'login']);

Route::post('users/register', [UserController::class, 'register']);

Route::get('orders/all', [OrderController::class, 'getOrders'])->middleware('auth:sanctum');

Route::get('users/me', [UserController::class, 'getUser'])->middleware('auth:sanctum');

Route::post('/users/logout',
    [UserController::class, 'logoutFromOneDevice'])
    ->middleware('auth:sanctum');

Route::apiResource('users', UserController::class)->middleware('auth:sanctum');


Route::get('/products/deleted',
    [ProductController::class, 'getAlldeleted'])
    ->middleware('auth:sanctum');
Route::get('/products/restore/{product_id}',
    [ProductController::class, 'restore'])
    ->middleware('auth:sanctum');


Route::apiResource('contact-messages', ContactMessageController::class);
Route::apiResource('added-offers', AddedOfferController::class);
Route::apiResource('cart-items', CartItemController::class)->middleware('auth:sanctum');
Route::apiResource('categories', CategoryController::class);
Route::apiResource('customers', CustomerController::class)->middleware('auth:sanctum');
Route::apiResource('custom-orders', CustomOrderController::class);
Route::apiResource('offers', OfferController::class)->middleware('auth:sanctum');
Route::apiResource('orders', OrderController::class)->middleware('auth:sanctum');
Route::apiResource('order-items', OrderItemController::class);
Route::apiResource('payment-requests', PaymentRequestController::class);
Route::apiResource('cities', CityController::class)->middleware('auth:sanctum');
Route::apiResource('deliveries', DeliveryController::class)->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
Route::apiResource('products', ProductController::class)->only([ 'store','update', 'destroy']);
});
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::get('products/related-products/{category}', [ProductController::class, 'getRelatedProducts']);

Route::get('products/byCategory/{category}', [ProductController::class, 'getProductsByCategory']);
Route::get('reviews/product/{product_id}', [ReviewController::class, 'getAllReviews']);

Route::apiResource('reviews', ReviewController::class)->middleware('auth:sanctum');
// Route::apiResource('sellers', SellerController::class)->middleware('auth:sanctum');


Route::apiResource('wish_lists', WishListController::class)->middleware('auth:sanctum');


Route::post('/payment/handel', [PaymentController::class, 'handlePayment'])->middleware('auth:sanctum');
Route::post('/categories/update', [CategoryController::class, 'updateCategory']);

Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('cancel');
Route::get('/payment/success/{orderId}', [PaymentController::class, 'success'])->name('success');

Route::post('wish_lists/myWish', [WishListController::class , 'inWishlist'])->middleware('auth:sanctum');
Route::get('/products/wishlist/all', [ProductController::class , 'productsInWishlist'])->middleware('auth:sanctum');
Route::delete('wish_lists/remove/{product_id}', [WishListController::class , 'removeWishlist'])->middleware('auth:sanctum');

Route::get('/categories/parent', [CategoryController::class , 'getAllParent'])->middleware('auth:sanctum');
Route::get('/categories/sub-catogory', [CategoryController::class , 'getAllsubCategories'])->middleware('auth:sanctum');
Route::get('/categories/by-parent/{parent_id}', [CategoryController::class , 'getByParent'])->middleware('auth:sanctum');



