<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Order;

use App\Http\Resources\OrderItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class OrderItemController extends Controller
{
    

    public function index()
    { 
        
        $orderItems = OrderItem::all();
        return response()->json($orderItems);
    }

    public function getMyOrderItems($order_id)
    { 
     
        try{
            $order = Order::find($order_id);
        if(!$order){
            return response()->json(['error' => 'order not found'], 404);

            }
        $orderItems = OrderItem::with('product','product.addedOffers' ,'product.category'  )->where('order_id', $order_id)->get();

        return OrderItemResource::collection($orderItems);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }







    public function serveOrderItem($item_id)
    { 
     
        try{
            $item = OrderItem::find($item_id);
        if(!$item){
            return response()->json(['error' => 'order not found'], 404);

            }
            $product = $item->$product;
            if ($product->stock >= $item->quantity){
                return response()->json(['error' => 'there is no enough in your stock'], 403);
            }
            $product->stock =$product->stock - $item->quantity;
            $product->save();
            $item->status ='done';
            $item->save();
        $orderItems = OrderItem::with('product','product.addedOffers' ,'product.category'  )->where('order_id', $order_id)->get();

        return OrderItemResource::collection($orderItems);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }

    public function craftOrderItem($item_id)
    { 
     
        try{
            $order = Order::find($order_id);
        if(!$order){
            return response()->json(['error' => 'order not found'], 404);

            }
        $orderItems = OrderItem::with('product','product.addedOffers' ,'product.category'  )->where('order_id', $order_id)->get();

        return OrderItemResource::collection($orderItems);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }
    





    public function getSellerOrdersItems()
    { 

        $id = Auth::id();
        try{

            $orderItems = OrderItem::with('product', 'product.addedOffers', 'order')
            ->whereHas('product', function($query) use ($id) {
                $query->where('user_id', $id);  
            })
            ->whereHas('order', function($query) {
                $query->where('status', 'payed');  
            })
            ->get();

        return OrderItemResource::collection($orderItems);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
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
    public function destroy(OrderItem $orderItem)
    {
        try{
        if ($orderItem->order->payment_status == 'payed') {
            return response()->json(['message' => 'can not delete a payed order item'], 403);
        }
        $order_id = $orderItem->order_id;
        $orderItem->delete();
        $order = Order::find($order_id);

        if ($order->orderItems()->count() == 0) {
            $order->delete();
            return response()->json(['message' => 'Order and OrderItem deleted successfully'], 200);
        }

        return response()->json(['message' => 'OrderItem deleted successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }
}

// GET|HEAD          api/order-items .................... order-items.index › Api\OrderItemController@index  
//   POST            api/order-items .................... order-items.store › Api\OrderItemController@store  
//   GET|HEAD        api/order-items/{order_item} ......... order-items.show › Api\OrderItemController@show
//   PUT|PATCH       api/order-items/{order_item} ..... order-items.update › Api\OrderItemController@update
//   DELETE          api/order-items/{order_item} ... order-items.destroy › Api\OrderItemController@destroy
//   GET|HEAD        api/orders .................................. orders.index › Api\OrderController@index  
