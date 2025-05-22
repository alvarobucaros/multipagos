<?php

namespace App\Http\Controllers;

use App\Models\pagos;
use App\Models\Socio;

use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
               
        $user = Auth::user();
 
        $socios = Socio::where('soc_sociedad_id', $user->sociedad_id)
        ->orderBy('soc_tiposocio')     
        ->select('id', 'soc_nombre as opcion')
        ->orderBy('soc_nombre')
        ->get(); 
        return Inertia::render('Pagos/Index', ['socios' => $socios]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
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

    /**
     * Display the specified resource.
     */
    public function show(pagos $pagos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(pagos $pagos)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, pagos $pagos)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pagos $pagos)
    {
        //
    }
}
