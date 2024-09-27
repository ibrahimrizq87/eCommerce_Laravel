<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

use Response;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{
    public function index()
    {

        $orders = Order::where('user_id', Auth::id())->with('orderItems')->get();
        return response()->json($orders);

    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'total' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::create([
            'phone' => $request->phone,
            'address' => $request->address,
            'total' => $request->total,
            'user_id' => Auth::id(),
            'payment_status' => 'not_payed', 
        ]);
        

        return response()->json($order, 201);

    }

    public function show(Order $order)
{
    if ($order->user_id !== Auth::id()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    return response()->json($order);
}
public function update(Request $request, Order $order)
{
    if ($order->user_id !== Auth::id()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $validator = Validator::make($request->all(), [
        'phone' => 'sometimes|required|string|max:15',
        'address' => 'sometimes|required|string|max:255',
        'total' => 'sometimes|required|integer|min:1',
        'payment_status' => 'sometimes|required|in:payed,not_payed,canceled',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // لا تسمح بإلغاء الطلب إذا كان بالفعل ملغى أو تم تسليمه
    if ($order->payment_status === 'canceled' || $order->payment_status === 'delivered') {
        return response()->json(['error' => 'Order cannot be canceled'], 422);
    }

    $order->update($request->only(['phone', 'address', 'total', 'payment_status']));

    return response()->json($order, 200);
}


public function destroy(Order $order)
{
    if ($order->user_id !== Auth::id()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $order->delete();

    return response()->json(null, 204);
}

}



