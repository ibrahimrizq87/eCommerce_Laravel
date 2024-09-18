<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }


    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ], [
            "email.required" => "Email is required.",
            "email.email" => "The email format you provided is invalid.",
            "password.required" => "Password is required.",
            "password.min" => "Password must be at least 8 characters.",
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        $credentials = $request->only('email', 'password');
    
        if (Auth::attempt($credentials)) {
            $user = Auth::user(); 
            return response()->json([
                'token' => $user->createToken()->plainTextToken,
                'user' => $user,
            ]);
        }
    
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    

    function register(Request $request) {

        $std_validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'required|string|max:50',
            'gender' => 'nullable|string|in:male,female,other',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:15', 
            'shop_name' => 'nullable|string|max:255',
            'about' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ], [
            "email.required" => "You must add an email to log in.",
            "email.email" => "The email format you provided is invalid.",
            "password.confirmed" => "The password confirmation does not match.",
            "image.image" => "The image must be a valid image file.",
            "image.mimes" => "The image must be in jpeg, png, jpg, or gif format.",
            "image.max" => "The image size should not exceed 2MB.",
        ]);
    
        $std_validator->sometimes('shop_name', 'required|string|max:255', function($input) {
            return $input->role === 'seller';
        });
        $std_validator->sometimes('about', 'required|string|max:255', function($input) {
            return $input->role === 'seller';
        });
        $std_validator->sometimes('address', 'required|string|max:255', function($input) {
            return $input->role === 'seller' || $input->role === 'customer';
        });
    


        if ($std_validator-> fails()) {
            return response()->json(['errors' => $std_validator->errors()],400);
        }

        $my_path = '';
        if(request()->hasFile("image")){
            $image = request()->file("image");
            $my_path=$image->store('users','uploads');
        }


        
        $user = new User();
        $user->image = $my_path; 
        $user->email = $request->email;
        $user->name = $request->name;
        $user->last_name = $request->last_name;
        $user->role = $request->role;
        $user->gender = $request->gender;
        $user->password = Hash::make($request->password);
        $user->save();

        if ($request->role === 'customer') {
            $customer = new Customer();
            $customer->user_id = $user->id; 
            $customer->total_spent = 0;
            $customer->phone = $request->phone;
            $customer->address = $request->address;
            $customer->status = 'active';
            $customer->save(); 
        } elseif ($request->role === 'seller') {
            $seller = new Seller();
            $seller->user_id = $user->id; 
            $seller->total_sales = 0;
            $seller->phone = $request->phone;
            $seller->address = $request->address;
            $seller->status = 'active';
            $seller->about = $request->about; 
            $seller->shop_name = $request->shop_name; 
            $seller->save(); 
        }


        return $user->createToken()->plainTextToken;
    }



 
    public function show(User $user)
    {
        return response()->json(['user' => $user]);

    }

    public function updateUser(Request $request) {
        $user = Auth::user(); 
    
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:15',
            'gender' => 'nullable|string|in:male,female,other',
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'shop_name' => 'nullable|string|max:255',
            'about' => 'nullable|string|max:255',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $my_path = $image->store('users', 'uploads');
            $user->image = $my_path;
        }
    
        $user->name = $request->name ?? $user->name;
        $user->last_name = $request->last_name ?? $user->last_name;
        $user->email = $request->email ?? $user->email;
        $user->gender = $request->gender ?? $user->gender;
    
        $user->save();
    
        if ($user->role === 'customer') {
            $customer = Customer::where('user_id', $user->id)->first();
            if ($customer) {
                $customer->phone = $request->phone ?? $customer->phone;
                $customer->address = $request->address ?? $customer->address;
                $customer->save();
            }
        } elseif ($user->role === 'seller') {
            $seller = Seller::where('user_id', $user->id)->first();
            if ($seller) {
                $seller->phone = $request->phone ?? $seller->phone;
                $seller->address = $request->address ?? $seller->address;
                $seller->shop_name = $request->shop_name ?? $seller->shop_name;
                $seller->about = $request->about ?? $seller->about;
                $seller->save();
            }
        }
    
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
