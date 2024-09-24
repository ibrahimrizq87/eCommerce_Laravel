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
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { SellerProfileComponent } from './components/seller-profile/seller-profile.component';
import { GuestHeaderComponent } from './components/guest-header/guest-header.component';
import { GuestPageComponent } from './components/guest-page/guest-page.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:"home",component:HomeComponent},
    {path:"products", component:ProductListComponent},
    {path:"product/3", component:ProductDetailsComponent},
    {path:"cart",component:CartComponent},
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
    {path:"seller/profile", component:SellerProfileComponent},
    {path:"edit-profile", component:EditProfileComponent},
    {path:"guest-header", component:GuestHeaderComponent},
    {path:"customer/page", component:CustomerPageComponent},
    {path:"guest/page", component: GuestPageComponent},
    {path:"wishlist", component:WishlistComponent},
    {path:"**",component:ErrorComponent}
];

