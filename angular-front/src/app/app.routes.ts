import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home parent/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { ErrorComponent } from './components/error/error.component';
import { OrderComponent } from './components/order/order.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactComponent } from './components/contact/contact.component';

import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { NeedVarificationComponent } from './components/need-varification/need-varification.component';

import { CustomerMAccountComponent } from './components/customer-m-account/customer-m-account.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

import { ViewProductComponent } from './components/view-product/view-product.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import { ViewOrderComponent } from './components/view-order/view-order.component';
import { LoadingComponent } from './components/loading/loading.component';

import { ShowSellerContactComponent } from './components/show-seller-contact/show-seller-contact.component';
import { BannedUserComponent } from './components/banned-user/banned-user.component';
import { NeedToPayComponent } from './components/need-to-pay/need-to-pay.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:"home",component:HomeComponent},
    {path:"need-to-pay",component:NeedToPayComponent},

    {path:"banned", component:BannedUserComponent},
    {path:"products", component:ProductListComponent},
    {path:"cart",component:CartComponent},
    {path:"varification",component:NeedVarificationComponent},
    {path:"order",component:OrderComponent},
    {path:"category",component:CategoryComponent},
    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},   
    {path:"contact",component:ContactComponent},

    {path:"customer/profile", component:CustomerProfileComponent},
    {path:"seller/contact", component:ShowSellerContactComponent},

    
   
    {path:"wishlist", component:WishlistComponent},
    {path:"manage/account", component:CustomerMAccountComponent},
    {path:"checkout", component:CheckoutComponent},
    {path:"product/view", component:ViewProductComponent},
    {path:"send", component:SendEmailComponent},
    {path:"reset", component:ResetPasswordComponent},
    {path:"order/view", component:ViewOrderComponent},
    
    {path:"loading", component:LoadingComponent},
    {path:"**",component:ErrorComponent}
];

