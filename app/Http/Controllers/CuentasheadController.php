<?php

namespace App\Http\Controllers;

use App\Models\Cuentahead;
use App\Models\Concepto;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas  HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CuentasheadController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
            $user = Auth::user();
        if (!$user || !$user->sociedad_id) {           
            return Inertia::render('Cuentahead/Index', ['cuentahead' => []]);
        }
         
        $cuentahead = Cuentahead::where('cxh_sociedad_id', $user->sociedad_id)
        ->orderBy('cxh_fchinicio', 'desc')
        ->paginate(10);

        $conceptos = Concepto::where('grp_sociedad_id', $user->sociedad_id)
        ->where('con_tipo', 'D')
        ->select('id', 'con_descripcion as opcion')
        ->orderBy('con_descripcion')
        ->get();

        return Inertia::render('Cuentahead/Index', ['cuentahead' => $cuentahead, 'conceptos' => $conceptos]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // SELECT id, cxh_sociedad_id, cxh_concepto_id, cxh_valor, cxh_cuotas,
        // cxh_fchinicio, cxh_nrocxc, cxh_total, cxh_saldo,
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
