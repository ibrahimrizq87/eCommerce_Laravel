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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {path:"home",component:HomeComponent},
    {path:"products", component:ProductListComponent},
    {path:"product/:id", component:ProductDetailsComponent},
    {path:"cart",component:CartComponent},
    {path:"order",component:OrderComponent},
    {path:"category",component:CategoryComponent},
    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},   
    {path:"contact",component:ContactComponent},
    {path:"**",component:ErrorComponent}
];

