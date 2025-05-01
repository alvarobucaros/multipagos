<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController; 
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\EmpresaController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'appVersion' => '1.0.0 - beta ', 
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', [PostController::class, 'indexPost'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/post', [PostController::class, 'index'])->name('post');
Route::get('/post', [PostController::class, 'index'])->name('post');
Route::get('/post/{id}', [PostController::class, 'show'])->name('post.show');
Route::post('/post', [PostController::class, 'store'])->name('post.store');
Route::put('/post/{id}', [PostController::class, 'update'])->name('post.update');
Route::delete('/post/{id}', [PostController::class, 'destroy'])->name('post.destroy');

Route::get('/grupo', [GrupoController::class, 'index'])->name('grupo');
Route::get('/grupo/{id}', [GrupoController::class, 'show'])->name('grupo.show');
Route::post('/grupo', [GrupoController::class, 'store'])->name('grupo.store');
Route::put('/grupo/{id}', [GrupoController::class, 'update'])->name('grupo.update');
Route::delete('/grupo/{id}', [GrupoController::class, 'destroy'])->name('grupo.destroy');

Route::get('/empresa', [EmpresaController::class, 'index'])->name('empresa');
Route::get('/empresa/{id}', [EmpresaController::class, 'show'])->name('empresa.show');
Route::post('/empresa', [EmpresaController::class, 'store'])->name('empresa.store');
Route::put('/empresa/{id}', [EmpresaController::class, 'update'])->name('empresa.update');
Route::delete('/empresa/{id}', [EmpresaController::class, 'destroy'])->name('empresa.destroy');

Route::get('/user', [UserController::class, 'index'])->name('user');
Route::get('/user/{id}', [UserController::class, 'show'])->name('user.show');
Route::post('/user', [UserController::class, 'store'])->name('user.store');
Route::put('/user/{id}', [UserController::class, 'update'])->name('user.update');
Route::delete('/user/{id}', [UserController::class, 'destroy'])->name('user.destroy');

Route::middleware('auth')->group(function () {
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__.'/auth.php';
