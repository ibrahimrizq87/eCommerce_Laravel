import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home parent/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { ErrorComponent } from './components/error/error.component';
import { OrderComponent } from './components/order/order.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactComponent } from './components/contact/contact.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { GuestHeaderComponent } from './components/guest-header/guest-header.component';
import { GuestPageComponent } from './components/guest-page/guest-page.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { NeedVarificationComponent } from './components/need-varification/need-varification.component';

import { CustomerMAccountComponent } from './components/customer-m-account/customer-m-account.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { Cart1Component } from './components/cart1/cart1.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { SellerPageComponent } from './components/seller-page/seller-page.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { Component } from '@angular/core';
import { ViewOrderComponent } from './components/cutomer-profile/view-order/view-order.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:"home",component:HomeComponent},
    {path:"products", component:ProductListComponent},
    {path:"products/:id", component:ProductDetailsComponent},
    {path:"cart",component:CartComponent},
    {path:"varification",component:NeedVarificationComponent},
    {path:"payment",component:PaymentComponent},
    {path:"order",component:OrderComponent},
    {path:"category",component:CategoryComponent},
    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},   
    {path:"contact",component:ContactComponent},
    {path:"add-product",component:AddProductComponent},
    {path:"update-product",component:UpdateProductComponent},
    {path:"category/items", component:CategoryDetailsComponent},
    {path:"customer/profile", component:CustomerProfileComponent},
    {path:"edit-profile", component:EditProfileComponent},
    {path:"guest-header", component:GuestHeaderComponent},
    {path:"guest/page", component: GuestPageComponent},
    {path:"seller/page", component:SellerPageComponent},
    {path:"admin/page",component:AdminPageComponent},
    {path:"wishlist", component:WishlistComponent},
    {path:"manage/account", component:CustomerMAccountComponent},
    {path:"checkout", component:CheckoutComponent},
    {path:"cart/new",component:Cart1Component},
    {path:"product/view", component:ViewProductComponent},
    {path:"send", component:SendEmailComponent},
    {path:"reset", component:ResetPasswordComponent},
    {path:"order/view", component:ViewOrderComponent},
    {path:"**",component:ErrorComponent}
];

