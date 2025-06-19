<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Anticipo;
use App\Models\Concepto;
use App\Models\Cuenta;
use App\Models\Cuentahead;
use App\Models\Grupo;
use App\Models\Gruposocio;
use App\Models\Ingregasto;
use App\Models\Sociedad;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SociedadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $sociedad = Sociedad::first();
       
        if (!$sociedad) {
            $sociedad = new Sociedad();
        }
   
        return Inertia::render('Sociedades/Index',['sociedad'=>$sociedad]); 
    
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sociedad = Sociedad::find($id);
   
        if ($sociedad) {
            return Inertia::render('Sociedades/Index',['sociedad'=>$sociedad]); 
        } else {
            return response()->json(['message' => 'Sociedad not found'], 404);
        }
    }
    
  
    public function store(Request $request)
    {  
        $request-> validate([
            'sdd_nombre' => 'required|max:100',
            'sdd_direccion' => 'required|max:100',
            'sdd_ciudad' => 'required|max:100',
            'sdd_tipodoc' => 'required|max:100',
            'sdd_nrodoc' => 'required|max:100',
            'sdd_telefono' => 'required|max:100',
            'sdd_email' => 'required|max:100',
            'sdd_logo' => 'required',
            'sdd_consecAjustes' => 'required',
            'sdd_consecIngreso' => 'required',
            'sdd_consecEgreso' => 'required',
            'sdd_fchini' => 'required',
            'sdd_saldo' => 'required',
        ]);

        Sociedad::create($request->all());
        return redirect()->back()->with('success', 'Sociedad creado exitosamente.');
    }


    public function update(Request $request, $id)
    {
        $request-> validate([
            'sdd_nombre' => 'required|max:100',
            'sdd_direccion' => 'required|max:100',
            'sdd_ciudad' => 'required|max:100',
            'sdd_tipodoc' => 'required|max:100',
            'sdd_nrodoc' => 'required|max:100',
            'sdd_telefono' => 'required|max:100',
            'sdd_email' => 'required|max:100',
            'sdd_logo' => 'required',
            'sdd_consecAjustes' => 'required',
            'sdd_consecIngreso' => 'required',
            'sdd_consecEgreso' => 'required',
            'sdd_fchini' => 'required',
            'sdd_saldo' => 'required',
        ]);

        $sociedads = Sociedad::find($id);
        $sociedads->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Sociedad actualizado correctamente');
    }

    public function generarDatosReporte  ($id){
     
        $user = Auth::user();   //  Id de la sociedad
//dd($id);
        // trae información de la sociedad 
        $sociedad = Sociedad::select('sdd_nombre', 'sdd_email', 'sdd_telefono', 'sdd_tipodoc', 
        'sdd_nrodoc', 'sdd_logo', 'sdd_administra')
        ->where('id', $user->sociedad_id)
        ->first();

        // Si no se encuentra la sociedad, devuelve un error
        if (!$sociedad) {
            return response()->json(['error' => 'Sociedad no encontrada'], 404);
        }

        // Devuelve los datos en formato JSON
        return response()->json(['sociedad' => $sociedad]);
    }

    public function reportesSociedad ($id){
        
        $user = Auth::user();   //  Id de la sociedad

        $sociedad = [];
        $anticipos = [];
        $conceptos=[];
        $cuentas=[];
        $grupos=[];
        $grupoSocios = [];
        $ingregasto = [];

        if($id === 'LG'){
            //  Recupera grupos 
            $grupos = Grupo::where( 'grp_sociedad_id',  $user->sociedad_id)
            ->orderBy('grp_titulo')
            ->get();

            $gruposIds = Grupo::where('grp_sociedad_id',  $user->sociedad_id)->pluck('id');
           
            $grupoSocios = GrupoSocio::whereIn('gsc_grupo_id', $gruposIds)
            ->join('socios', 'socios.id', '=', 'gsc_socio_id')
            ->select('gsc_grupo_id', 'socios.soc_nombre' )
            ->get();        
        }

        if($id === 'LC'){
            $conceptos = Concepto::where( 'con_sociedad_id',  $user->sociedad_id)
            ->join('grupos', 'grupos.id', '=', 'con_grupo')
            ->orderBy('con_tipo')
            ->orderBy('con_titulo')
            ->get();
           //  dd($conceptos);
        }
      
         if($id === 'CC'){

            $cuentashead = Cuentahead::where('cxh_sociedad_id',  $user->sociedad_id)->pluck('id');

             $cuentas = Cuenta::whereIn('cxc_head_id', $cuentashead)
            ->join('socios', 'socios.id', '=', 'cxc_socio_id')
            ->join('conceptos', 'conceptos.id', '=', 'cxc_concepto_id')
            ->join('grupos', 'grupos.id', '=', 'cxc_grupo_id')
            ->where('cxc_saldo', '>', 0)
            ->select('cuentas.cxc_fecha', 'cuentas.cxc_valor', 'cuentas.cxc_saldo', 'socios.soc_nombre',
             'conceptos.con_titulo', 'grupos.grp_titulo')
            ->orderBy('conceptos.con_titulo')
            ->orderBy('cxc_fecha')
            ->get();

    //        dd($cuentas->toArray());

         }

          if($id === 'EC'){
            dd('Estoy en EC');
          }

          if($id === 'IG'){
             $ingregasto = Ingregasto::where( 'iga_sociedad_id',  $user->sociedad_id)
            ->join('socios', 'socios.id', '=', 'iga_socio_id')
            ->join('conceptos', 'conceptos.id', '=', 'iga_concepto_id')
            ->select('ingregastos.iga_tipo', 'ingregastos.iga_numero',  'ingregastos.iga_Fecha',
             'ingregastos.iga_detalle', 'ingregastos.iga_debito', 'ingregastos.iga_credito',
             'conceptos.con_titulo', 'socios.soc_nombre')
            ->orderBy('iga_fecha')
            
            ->get();

      //      dd($ingregasto->toArray());
          }

        if($id === 'IA'){
             $anticipos = Anticipo::where( 'ant_sociedad_id',  $user->sociedad_id)
             ->where('ant_saldo', '>', 0)
            ->join('socios', 'socios.id', '=', 'ant_socio_id')
            ->select('ant_fecha', 'ant_detalle', 'ant_valor', 'ant_saldo', 'socios.soc_nombre')
            ->orderBy('socios.soc_nombre')
            ->get();
            //  dd($anticipos->toArray());
        }

              // llama al informe para mostrar la información
//dd('Llama al informe');     
          Inertia::render('Sociedades/Informe',['sociedad'=>$sociedad]); 
        //Inertia::render('Sociedades/Informe', [ 'sociedad' => $sociedad]);
                            //    'ingregasto' => $ingregasto, 'conceptos' => $conceptos, 'cuentas' => $cuentas,
                            //    'grupos' => $grupos, 'grupoSocios' => $grupoSocios ]);        
        // Inertia::render('Sociedades/Informe', ['anticipos' => $anticipos,  'sociedad' => $sociedad,
        //                        'ingregasto' => $ingregasto, 'conceptos' => $conceptos, 'cuentas' => $cuentas,
        //                        'grupos' => $grupos, 'grupoSocios' => $grupoSocios ]);
    dd('sale del informe');                           
        return redirect()->back()->with('success', 'Sociedad Informe creado');
    }

  
      
      

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sociedads = Sociedad::find($id);
        if (!$sociedads) {
            return response()->json(['message' => 'Sociedad no encontrada'], Response::HTTP_NOT_FOUND);
        }
        $sociedads->delete();

         return redirect()->back()->with('success','Sociedad eliminada correctamente');
        
    }

    
}