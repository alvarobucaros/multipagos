<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ConceptoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController; 
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\SociedadController;

// Route::get('/', function () {
//     return Inertia::render('Posts/Index', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'appVersion' => '1.0.0 - beta ', 
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [PostController::class, 'indexPost'])->name('/');

Route::get('/dashboard', [PostController::class, 'indexPost'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/mimenu', [PostController::class, 'indexMenu'])->middleware(['auth', 'verified'])->name('mimenu');
Route::get('/docs', [PostController::class, 'indexDoc'])->middleware(['auth', 'verified'])->name('docs');

Route::get('/concepto', [ConceptoController::class, 'index'])->name('concepto');
Route::get('/concepto/{id}', [ConceptoController::class, 'show'])->name('concepto.show');
Route::post('/concepto', [ConceptoController::class, 'store'])->name('concepto.store');
Route::put('/concepto/{id}', [ConceptoController::class, 'update'])->name('concepto.update');
Route::delete('/concepto/{id}', [ConceptoController::class, 'destroy'])->name('concepto.destroy');

Route::get('/grupo', [GrupoController::class, 'index'])->name('grupo');
Route::get('/grupo/{id}', [GrupoController::class, 'show'])->name('grupo.show');
Route::post('/grupo', [GrupoController::class, 'store'])->name('grupo.store');
Route::put('/grupo/{id}', [GrupoController::class, 'update'])->name('grupo.update');
Route::delete('/grupo/{id}', [GrupoController::class, 'destroy'])->name('grupo.destroy');

Route::get('/sociedad', [SociedadController::class, 'index'])->name('sociedad');
Route::get('/sociedad/{id}', [SociedadController::class, 'show'])->name('sociedad.show');
Route::post('/sociedad', [SociedadController::class, 'store'])->name('sociedad.store');
Route::put('/sociedad/{id}', [SociedadController::class, 'update'])->name('sociedad.update');
Route::delete('/sociedad/{id}', [SociedadController::class, 'destroy'])->name('sociedad.destroy');

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
