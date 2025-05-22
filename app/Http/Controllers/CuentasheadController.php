<?php

namespace App\Http\Controllers;

use App\Models\Cuentahead;
use App\Models\Concepto;
use App\Models\Grupo;
use App\Models\Gruposocio;
use App\Models\Socio;

use Illuminate\Support\Facades\DB;
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
            return Inertia::render('Cuentashead/Index', ['cuentahead' => [],'conceptos' => []]);
        }
         
        $cuentashead = Cuentahead::where('cxh_sociedad_id', $user->sociedad_id)
        ->join('conceptos', 'conceptos.id', '=', 'cuentashead.cxh_concepto_id')
        ->join('grupos', 'grupos.id', '=', 'cuentashead.cxh_grupo')
        ->orderBy('cxh_fchinicio', 'desc')
        ->select('cuentashead.id', 'cuentashead.cxh_concepto_id', 'cuentashead.cxh_detalle', 'cuentashead.cxh_valor', 
        'cuentashead.cxh_cuotas', 'cuentashead.cxh_fchinicio', 'cuentashead.cxh_nrocxc', 'cuentashead.cxh_total',
         'cuentashead.cxh_saldo', 'conceptos.con_descripcion', 'cxh_grupo', 'grupos.grp_titulo' )        
        ->paginate(10);

        $conceptos = Concepto::where('con_sociedad_id', $user->sociedad_id)
        ->where('con_tipo', 'D')
        ->select('id', 'con_descripcion as opcion')
        ->orderBy('con_descripcion')
        ->get();

        // $grupos = Grupo::where('grp_sociedad_id', $user->sociedad_id)
        // ->where('grp_estado', 'A')
        // ->select('id', 'grp_titulo as opcion')
        // ->orderBy('grp_titulo')
        // ->get();
 
        return Inertia::render('Cuentashead/Index', 
        ['cuentashead' => $cuentashead, 'conceptos' => $conceptos]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // SELECT id, cxh_sociedad_id, cxh_concepto_id, cxh_valor, cxh_cuotas,
        // cxh_fchinicio, cxh_nrocxc, cxh_total, cxh_saldo, cxh_grupo 
    }

    private function validate($request)
    {
        return $request->validate([
            'cxh_fchinicio' => 'required|date',
            'cxh_valor' => 'required|numeric|min:0',
            'cxh_cuotas' => 'required|numeric|min:0',
            'cxh_detalle' => 'required|max:200',
            'cxh_sociedad_id' => 'required|exists:sociedades,id',
            'cxh_concepto_id' => 'required|exists:cuentashead,id',  
            'cxh_nrocxc' => 'required',      
            'cxh_total' => 'required',      
            'cxh_saldo' => 'required',
            'cxh_grupo' => 'required',
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $id = $request->cxh_concepto_id;
        $concepto = Concepto::find($id);
        if (!$concepto) {
            return redirect()->back()->with('error', 'Concepto no encontrado.');
        }

        // $request->merge([ ]);
        //     'cxh_valor' => $concepto->con_valorCobro,
        //     'cxh_cuotas' => $concepto->con_cuotas,
        //     'cxh_grupo' => $concepto->con_grupo,
        // ]);

        $request['cxh_valor'] = $concepto->con_valorCobro;
        $request['cxh_cuotas'] = $concepto->con_cuotas;
        $request['cxh_grupo'] = $concepto->con_grupo;

//         $validatedData = $this->validate($request);
// dd($validatedData->all());
        try {
            Cuentahead::create($request->all());
            return redirect()->back()->with('success', 'Anticipo creado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un problema al crear el anticipo.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function updateDis(string $id)
    {
        $cuentashead = Cuentahead::find($id);
   
        $nro = 0;
        $total = 0;
        $valorCuota = 0;
        $fecha = $cuentashead->cxh_fchinicio;
        $grupo = $cuentashead->cxh_grupo;
        $concepto = $cuentashead->cxh_concepto_id;
        $id = $cuentashead->id;

        if ($cuentashead->cxh_cuotas > 0) {
             $valorCuota = $cuentashead->cxh_valor / $cuentashead->cxh_cuotas;
        }

        if($grupo === 1){
            $socios = Socio::where('soc_tiposocio','S');
        }else{
            $socios = Gruposocio::where('gsc_grupo_id', $id);
        }

        foreach ($socios->get() as $row){
            DB::table('cuentas')->insert([
                'cxc_head_id' => $id,
                'cxc_socio_id' => $row->gsc_socio_id,
                'cxc_concepto_id' => $concepto,
                'cxc_grupo_id' => $grupo,
                'cxc_fecha' => $fecha,
                'cxc_valor' => $valorCuota,
                'cxc_saldo' => $valorCuota,
            ]);
            $nro++;
            $total += $valorCuota;
            $fecha = date('Y-m-d', strtotime($fecha. ' +1 month'));
        }
        $cuentashead->update([
            'cxh_nrocxc' => $nro,
            'cxh_total' => $total,
            'cxh_saldo' => $total
        ]);
        return redirect()->back()->with('success', 'cuentashead actualizado correctamente');
    }

            // 'cxh_nrocxc' => 'required',      
            // 'cxh_total' => 'required',      
            // 'cxh_saldo' => 'required',
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cuentashead = Cuentahead::find($id);
        $cuentashead->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'cuentashead actualizado correctamente');
    }

 
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cuentashead = Cuentahead::find($id);
        if (!$cuentashead) {
            return response()->json(['message' => 'cuentas head no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $cuentashead->delete();

         return redirect()->back()->with('success','Cuentas head eliminado correctamente');
        
    }
}
