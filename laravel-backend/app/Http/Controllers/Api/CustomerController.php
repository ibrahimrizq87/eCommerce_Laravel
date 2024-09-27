<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    // Retrieve a list of all customers
    public function index(Request $request)
    {
        $customers = Customer::all();  // Fetch all customers
        return response()->json($customers);
    }

    // Create a new customer
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'phone' => 'required|string|max:15',
        'address' => 'required|string|max:255',
        'total_spent' => 'nullable|numeric|min:0',
        'status' => 'nullable|string|in:active,inactive',
        'user_id' => 'required|exists:users,id'
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    try {
        $customer = new Customer();
        $customer->phone = $request->phone;
        $customer->address = $request->address;
        $customer->total_spent = $request->total_spent ?? 0;
        $customer->status = $request->status ?? 'active';
        $customer->user_id = $request->user_id;  
        $customer->save();

        return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    // Show details of a specific customer
    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    // Update an existing customer
    public function update(Request $request, Customer $customer)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'total_spent' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $customer->phone = $request->phone ?? $customer->phone;
            $customer->address = $request->address ?? $customer->address;
            $customer->total_spent = $request->total_spent ?? $customer->total_spent;
            $customer->status = $request->status ?? $customer->status;
            $customer->save();

            return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Delete a customer
    public function destroy(Customer $customer)
    {
        try {
            $customer->delete();
            return response()->json(['message' => 'Customer deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
