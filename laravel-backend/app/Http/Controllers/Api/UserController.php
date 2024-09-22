<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Customer;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
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
                'token' => $user->createToken('Personal Access Token')->plainTextToken,
                'user' => $user,
            ]);
        }
    
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    
    public function register(Request $request) {
        $std_validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'required|string|max:50',
            'gender' => 'nullable|string|in:male,female,other',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:15', 
            'shope_name' => 'nullable|string|max:255',
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
    
        $std_validator->sometimes('shope_name', 'required|string|max:255', function($input) {
            return $input->role === 'seller';
        });
        $std_validator->sometimes('about', 'required|string|max:255', function($input) {
            return $input->role === 'seller';
        });
        $std_validator->sometimes('address', 'required|string|max:255', function($input) {
            return $input->role === 'seller' || $input->role === 'customer';
        });

        if ($std_validator->fails()) {
            return response()->json(['errors' => $std_validator->errors()], 400);
        }

        $my_path = '';
        if($request->hasFile("image")){
            $image = $request->file("image");
            $my_path = $image->store('users', 'public');
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
            $seller->shope_name = $request->shope_name; 
            $seller->save(); 
        }

        return response()->json(['token' => $user->createToken('Personal Access Token')->plainTextToken]);
    }

    public function store(Request $request)
    {
        return $this->register($request);
    }

    public function index(Request $request)
    {
        // جلب جميع المستخدمين أو أي منطق تريده هنا
        $users = User::all();
        return response()->json($users);
    }
}