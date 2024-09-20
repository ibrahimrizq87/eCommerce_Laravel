<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    { 
        // Check if user is admin and return all orders 
        if ($request->user()->isAdmin()) {
            $orderItems = OrderItem::all();
            return response()->json($orderItems);
        }

        // get only the user's order items
        $orderItems = OrderItem::where('order_id', Auth::id())->get();
        return response()->json($orderItems);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'quantity' => 'required|integer',
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
        ]);

        $orderItem = OrderItem::create($request->all());

        return response()->json($orderItem, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $orderItem = OrderItem::find($id);

        if (!$orderItem) {
            return response()->json(['message' => 'OrderItem not found'], Response::HTTP_NOT_FOUND);
        }

        //the order belongs to the user
        if (!Auth::user()->isAdmin() && $orderItem->order_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        return response()->json($orderItem);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $orderItem = OrderItem::find($id);

        if (!$orderItem) {
            return response()->json(['message' => 'OrderItem not found'], Response::HTTP_NOT_FOUND);
        }

       //the order belongs to the user  ====>>> un commit if wont the admin can't to updata order
        // if (!Auth::user()->isAdmin() && $orderItem->order_id !== Auth::id()) {
        //     return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        // }

        $request->validate([
            'quantity' => 'sometimes|required|integer',
            'order_id' => 'sometimes|required|exists:orders,id',
            'product_id' => 'sometimes|required|exists:products,id',
        ]);

        $orderItem->update($request->all());
        return response()->json($orderItem)->with("orderItem updatad");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $orderItem = OrderItem::find($id);

        if (!$orderItem) {
            return response()->json(['message' => 'OrderItem not found'], Response::HTTP_NOT_FOUND);
        }

        //the order belongs to the user
        if (!Auth::user()->isAdmin() && $orderItem->order_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $orderItem->delete();

        return response()->json(['message' => 'OrderItem deleted successfully'], Response::HTTP_NO_CONTENT);
    }
}

// GET|HEAD          api/order-items .................... order-items.index › Api\OrderItemController@index  
//   POST            api/order-items .................... order-items.store › Api\OrderItemController@store  
//   GET|HEAD        api/order-items/{order_item} ......... order-items.show › Api\OrderItemController@show
//   PUT|PATCH       api/order-items/{order_item} ..... order-items.update › Api\OrderItemController@update
//   DELETE          api/order-items/{order_item} ... order-items.destroy › Api\OrderItemController@destroy
//   GET|HEAD        api/orders .................................. orders.index › Api\OrderController@index  
