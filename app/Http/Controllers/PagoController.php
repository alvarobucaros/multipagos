<?php

namespace App\Http\Controllers;

use App\Models\pagos;
use App\Models\Socio;
use App\Models\Cuenta;
use App\Models\Concepto;

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
        ->where('soc_tiposocio', '=', 'S') 
        ->orderBy('soc_nombre')     
        ->select('id', 'soc_nombre as opcion')
        ->orderBy('soc_nombre')
        ->get(); 


        $cuentas = null;
        $socioSeleccionado = null;
        $filters = ['socio_id' => null]; 
        $saldo = [];

        return Inertia::render('Pagos/Index', ['socios' => $socios, 'cuentas' => $cuentas, 
                'filters' => $filters, 'socioSeleccionado' => $socioSeleccionado,
                'saldo'=> $saldo]);                              
                                
    }


    public function showCuales(Request $request, $id) // $id es el ID del socio
    {
        // Obtener todos los socios para repoblar el select (Inertia necesita todas las props de la página)
        $sociosList = Socio::select('id', 'soc_nombre')
            ->orderBy('soc_nombre')
            ->get()
            ->map(fn ($socio) => ['value' => $socio->id, 'label' => $socio->soc_nombre]);

        // Obtener el socio seleccionado (para mostrar su nombre, por ejemplo)
        $socioSeleccionado = Socio::select('id', 'soc_nombre')->find($id);

        // Obtener las cuentas del socio
        $cuentas = Cuenta::where('cxc_socio_id', $id)
            ->where('cxc_saldo', '>', 0)
            ->join('conceptos', 'conceptos.id', '=', 'cuentas.cxc_concepto_id')
            ->select(
                'cuentas.id',
                'conceptos.con_titulo',
                'conceptos.con_descripcion',
                'cxc_fecha',
                'cxc_valor',
                'cxc_saldo'
            )
            ->orderBy('cxc_fecha')
            ->orderBy('con_titulo')
            ->paginate(10)
            ->withQueryString(); // Importante para que la paginación funcione con partial reloads

        // Obtener los saldos del socio por concepto
        $saldo = Cuenta::join('conceptos', 'conceptos.id', '=', 'cuentas.cxc_concepto_id')
            ->where('cxc_socio_id', $id)
            ->where('cxc_saldo', '>', 0)
            ->groupBy('cxc_concepto_id', 'con_descripcion')
            ->selectRaw('cxc_concepto_id, con_descripcion, SUM(cxc_saldo) as total_saldo')
            ->get();
 // dd($saldo);
        // Repoblar la vista con datos actualizados
        return Inertia::render('Pagos/Index', [ // Renderiza la MISMA página
            'socios' => $sociosList,
            'cuentas' => $cuentas,
            'socioSeleccionado' => $socioSeleccionado,
            'saldo'=> $saldo,
            'filters' => ['socio_id' => $id], // Devuelve el filtro aplicado            
        ]);
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
