<?php

namespace App\Http\Controllers;

use App\Models\Ingregasto;
use App\Models\Concepto;
use App\Models\Socio;
use App\Models\Sociedad;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class IngregastoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
 
        $ingregastos = Ingregasto::where('iga_sociedad_id', $user->sociedad_id)
        ->join('socios', 'socios.id', '=', 'ingregastos.iga_socio_id')
        ->join('conceptos', 'conceptos.id', '=', 'ingregastos.iga_concepto_id')
        ->orderBy('iga_tipo', 'desc')
        ->orderBy('iga_numero', 'desc' )
        ->select('ingregastos.id', 'iga_sociedad_id', 'iga_socio_id', 'iga_tipo', 'iga_numero', 
        'iga_Fecha', 'iga_concepto_id', 'iga_detalle', 'iga_Documento', 'iga_debito', 'iga_credito', 
        'iga_grupo', 'iga_procesado', 'iga_idUsuario','soc_nombre','con_descripcion')
        ->paginate(10);

        $conceptos = Concepto::where('con_sociedad_id', $user->sociedad_id)
        ->whereIn('con_tipo', ['I', 'G', 'A'])
        ->select('id', 'con_descripcion as opcion', 'con_tipo')
        ->orderBy('con_descripcion')
        ->get();

        $socios = Socio::where('soc_sociedad_id', $user->sociedad_id)
        ->where('soc_tiposocio', '=', 'T') 
        ->orderBy('soc_nombre')     
        ->select('id', 'soc_nombre as opcion')
        ->orderBy('soc_nombre')
        ->get();

        $sociedad = Sociedad::select( 'sdd_consecAjustes', 'sdd_consecIngreso', 'sdd_consecEgreso', 'sdd_saldo')
        ->where('id', $user->sociedad_id)
        ->get();

      return Inertia::render('Ingregastos/Index', ['ingregastos' => $ingregastos, 
      'conceptos' => $conceptos, 'socios' => $socios, 'sociedad' => $sociedad]);
    }

    public function tipoBaseDatos()
    {
        $tipoDB = DB::connection()->getDriverName();
        
        return response()->json(['tipo_base_datos' => $tipoDB]);

        $versionLaravel = app()->version();
        dd($versionLaravel);

        $versionPHP = phpversion();
        dd($versionPHP);

    }

    private function validate($request)
    {
        return $request->validate([
            'iga_sociedad_id' => 'required|exists:sociedades,id', 
            'iga_socio_id' => 'required|exists:socios,id',
            'iga_tipo' => 'required|in:I,G,A', // I=Ingreso, G=Gasto, A=Aguste, S=Saldo 
            'iga_numero' => 'required|numeric|min:0', 
            'iga_Fecha' => 'required|date', 
            'iga_concepto_id' => 'required|exists:conceptos,id', 
            'iga_detalle' => 'required|max:200',
            'iga_Documento' => 'nullable|max:200', // Documento puede ser nulo
            'iga_debito' => 'required|numeric|min:0', // Debito debe ser numérico y mayor o igual a 0 
            'iga_credito' => 'required|numeric|min:0', // 
            'iga_grupo' => 'required|exists:grupos,id',  
            'iga_procesado' => 'required|in:S,N,A', // S=Si, N=No, A=Anulado
            'iga_idUsuario' => 'required|exists:users,id', // Asegurarse de que iga_idUsuario sea un usuario válido
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request);  // valida

        try {
            Ingregasto::create($validatedData);
            $this->updateSociedad($request);   // actualiza saldo en la Sociedad
            return redirect()->back()->with('success', 'Anticipo creado exitosamente.');
        } catch (\Exception $e) {
            dd('Eror Creación :' . $e->getMessage());
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }


  private function updateSociedad(Request $request)
   {
   // dd( $request->all());
        $dato = $request->all();
        $user = Auth::user();
        $sociedad = Sociedad::find($user->sociedad_id);
        if ($dato['iga_tipo'] == 'I') {
            $sociedad->sdd_consecIngreso = $dato['iga_numero'];
            $sociedad->sdd_saldo +=  $dato['iga_debito'];
        }elseif ($dato['iga_tipo'] == 'G') {
            $sociedad->sdd_consecEgreso = $dato['iga_numero'];
            $sociedad->sdd_saldo -=  $dato['iga_credito'];
        } elseif ($dato['iga_tipo'] == 'A') {
            $sociedad->sdd_consecAjustes = $dato['iga_numero'];
            $sociedad->sdd_saldo +=  $dato['iga_debito'];
            $sociedad->sdd_saldo -=  $dato['iga_credito'];
        }
       
         $sociedad->fill($request->input())->saveOrFail();
   } 

  
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $sociedad = Sociedad::find($user->sociedad_id);

        $dato = $request->all(); 
       
        $ingregasto = Ingregasto::find($id);

        $db = $dato['iga_debito'] - $ingregasto->iga_debito;
        $cr = $dato['iga_credito'] - $ingregasto->iga_credito;

        if($db !== 0){
            $sociedad->sdd_saldo += $db;
        }
        if($cr !== 0){
            $sociedad->sdd_saldo -=  $cr;
        }

        $sociedad->fill($request->input())->saveOrFail();
    
        $ingregasto->fill($request->input())->saveOrFail();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $ingregasto = Ingregasto::find($id);
        if (!$ingregasto) {
            return response()->json(['message' => 'ingregasto no encontrado'], Response::HTTP_NOT_FOUND);
        }


        $user = Auth::user();
        $sociedad = Sociedad::find($user->sociedad_id);

   
        if ($ingregasto->iga_tipo == 'I') {
            $sociedad->sdd_saldo -=  $ingregasto->iga_debito;
        }elseif ($ingregasto->iga_tipo == 'G') {
            $sociedad->sdd_saldo +=  $ingregasto->iga_credito;
        } elseif ($ingregasto->iga_tipo == 'A') {
            $sociedad->sdd_saldo -=  $ingregasto->iga_debito;
            $sociedad->sdd_saldo +=  $ingregasto->iga_credito;
        }

        $sociedad->saveOrFail();

        $ingregasto->delete();

         return redirect()->back()->with('success','Grupo eliminado correctamente');
        
    }
}
