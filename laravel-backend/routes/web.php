<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AddedOfferController;

Route::get('/', function () {
    return view('welcome');
});


// route::get('added-offers', [AddedOfferController::class, 'index'])->name('added-offers.index');
// route::get('added-offers', [AddedOfferController::class, 'craete'])->name('added-offers.craete');


Route::resource('added-offers', AddedOfferController::class);
