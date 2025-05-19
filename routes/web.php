<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AnticipoController;
use App\Http\Controllers\ConceptoController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\CuentasheadController;
use App\Http\Controllers\IngregastoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController; 
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\SociedadController;
use App\Http\Controllers\SocioController;

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

Route::get('/anticipo', [AnticipoController::class, 'index'])->name('anticipo');
Route::get('/anticipo/{id}', [AnticipoController::class, 'show'])->name('anticipo.show');
Route::post('/anticipo', [AnticipoController::class, 'store'])->name('anticipo.store');
Route::put('/anticipo/{id}', [AnticipoController::class, 'update'])->name('anticipo.update');
Route::put('/anticipoAnt/{id}', [AnticipoController::class, 'updateAnt'])->name('anticipo.updateAnt');
Route::delete('/anticipo/{id}', [AnticipoController::class, 'destroy'])->name('anticipo.destroy');

Route::get('/concepto', [ConceptoController::class, 'index'])->name('concepto');
Route::get('/concepto/{id}', [ConceptoController::class, 'show'])->name('concepto.show');
Route::post('/concepto', [ConceptoController::class, 'store'])->name('concepto.store');
Route::put('/concepto/{id}', [ConceptoController::class, 'update'])->name('concepto.update');
Route::delete('/concepto/{id}', [ConceptoController::class, 'destroy'])->name('concepto.destroy');

Route::get('/cuenta', [CuentaController::class, 'index'])->name('cuenta');
Route::get('/cuenta/{id}', [CuentaController::class, 'show'])->name('cuenta.show');
Route::post('/cuenta', [CuentaController::class, 'store'])->name('cuenta.store');
Route::put('/cuenta/{id}', [CuentaController::class, 'update'])->name('cuenta.update');
Route::delete('/cuenta/{id}', [CuentaController::class, 'destroy'])->name('cuenta.destroy');

Route::get('/cuentahead', [CuentasheadController::class, 'index'])->name('cuentahead');
Route::get('/cuentahead/{id}', [CuentasheadController::class, 'show'])->name('cuentahead.show');
Route::post('/cuentahead', [CuentasheadController::class, 'store'])->name('cuentahead.store');
Route::put('/cuentahead/{id}', [CuentasheadController::class, 'update'])->name('cuentahead.update');
Route::delete('/cuentahead/{id}', [CuentasheadController::class, 'destroy'])->name('cuentahead.destroy');

Route::get('/grupo', [GrupoController::class, 'index'])->name('grupo');
Route::get('/grupo/{id}', [GrupoController::class, 'show'])->name('grupo.show');
Route::post('/grupo', [GrupoController::class, 'store'])->name('grupo.store');
Route::put('/grupo/{id}', [GrupoController::class, 'update'])->name('grupo.update');
Route::delete('/grupo/{id}', [GrupoController::class, 'destroy'])->name('grupo.destroy');

Route::get('/ingregasto', [IngregastoController::class, 'index'])->name('ingregasto');
Route::get('/ingregasto/{id}', [IngregastoController::class, 'show'])->name('ingregasto.show');
Route::post('/ingregasto', [IngregastoController::class, 'store'])->name('ingregasto.store');
Route::put('/ingregasto/{id}', [IngregastoController::class, 'update'])->name('ingregasto.update');
Route::delete('/ingregasto/{id}', [IngregastoController::class, 'destroy'])->name('ingregasto.destroy');

Route::get('/sociedad', [SociedadController::class, 'index'])->name('sociedad');
Route::get('/sociedad/{id}', [SociedadController::class, 'show'])->name('sociedad.show');
Route::post('/sociedad', [SociedadController::class, 'store'])->name('sociedad.store');
Route::put('/sociedad/{id}', [SociedadController::class, 'update'])->name('sociedad.update');
Route::delete('/sociedad/{id}', [SociedadController::class, 'destroy'])->name('sociedad.destroy');

Route::get('/socio', [SocioController::class, 'index'])->name('socio');
Route::get('/socio/{id}', [SocioController::class, 'show'])->name('socio.show');
Route::post('/socio', [SocioController::class, 'store'])->name('socio.store');
Route::put('/socio/{id}', [SocioController::class, 'update'])->name('socio.update');
Route::delete('/socio/{id}', [SocioController::class, 'destroy'])->name('socio.destroy');

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
