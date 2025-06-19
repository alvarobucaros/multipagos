<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Abono;
use App\Models\Anticipo;
use App\Models\Concepto;
use App\Models\Cuenta;
use App\Models\Cuentahead;
use App\Models\Grupo;
use App\Models\Gruposocio;
use App\Models\Ingregasto;
use App\Models\Sociedad;
use App\Models\Socio;

use Illuminate\Support\Facades\Auth;

class ReportesController extends Controller
{

    /**
     * Genera los datos necesarios para el reporte de la sociedad y sus socios.
     */

    public function generarDatosReporteLC  ($id){
     
        $user = Auth::user();   //  Id de la sociedad

        // trae información de la sociedad 
        $sociedad = Sociedad::select('sdd_nombre', 'sdd_email', 'sdd_telefono', 'sdd_tipodoc', 
        'sdd_nrodoc', 'sdd_logo', 'sdd_administra')
        ->where('id', $user->sociedad_id)
        ->first();

        // Si no se encuentra la sociedad, devuelve un error
        if (!$sociedad) {
            return response()->json(['error' => 'Sociedad no encontrada'], 404);
        }

        $socios = Socio::where('soc_sociedad_id', $user->sociedad_id)
        ->orderBy('soc_tiposocio')
        ->orderBy('soc_nombre')
        ->get();

        // Devuelve los datos en formato JSON
        return response()->json(['sociedad' => $sociedad, 
                                 'socios' => $socios]);
    }

    /**
     * Genera los datos necesarios para el reporte de anticipos.
     */

    public function generarDatosReporteAN  ($id){
     
        $user = Auth::user();   //  Id de la sociedad

        // trae información de la sociedad 
        $sociedad = Sociedad::select('sdd_nombre', 'sdd_email', 'sdd_telefono', 'sdd_tipodoc', 
        'sdd_nrodoc', 'sdd_logo', 'sdd_administra')
        ->where('id', $user->sociedad_id)
        ->first();

        // Si no se encuentra la sociedad, devuelve un error
        if (!$sociedad) {
            return response()->json(['error' => 'Sociedad no encontrada'], 404);
        }

        $anticipos = Anticipo::where('ant_sociedad_id', $user->sociedad_id)
        ->join('socios', 'socios.id', '=', 'ant_socio_id')
        ->where('ant_saldo', '>', 0)       
        ->select( 'socios.soc_nombre', 'ant_fecha', 'ant_saldo', 'ant_valor', 'ant_detalle')
         ->orderBy('socios.soc_nombre')
        ->get();      

        // Devuelve los datos en formato JSON
        return response()->json(['sociedad' => $sociedad, 
                                 'anticipos' => $anticipos]);
    }

    
    /**
     * Genera los datos necesarios para el reporte de los conceptos.
     */

    public function generarDatosReporteCP  ($id){
     
        $user = Auth::user();   //  Id de la sociedad

        // trae información de la sociedad 
        $sociedad = Sociedad::select('sdd_nombre', 'sdd_email', 'sdd_telefono', 'sdd_tipodoc', 
        'sdd_nrodoc', 'sdd_logo', 'sdd_administra')
        ->where('id', $user->sociedad_id)
        ->first();

        if (!$sociedad) {
            return response()->json(['error' => 'Sociedad no encontrada'], 404);
        }

        $conceptos = Concepto::where('con_sociedad_id', $user->sociedad_id)
        ->join('grupos', 'grupos.id', '=', 'conceptos.con_grupo')
        ->select( 'grupos.grp_titulo', 'conceptos.con_titulo', 'conceptos.con_descripcion', 'conceptos.con_fechaDesde',
            'conceptos.con_fechaHasta', 'conceptos.con_valorCobro', 'conceptos.con_cuotas', 'conceptos.con_valorCuota',
            'conceptos.con_grupo', 'conceptos.con_aplica', 'conceptos.con_estado','conceptos.con_tipo')
         ->orderBy('conceptos.con_tipo', 'asc')
         ->orderBy('conceptos.con_descripcion')
        ->get();      

        // Devuelve los datos en formato JSON
        return response()->json(['sociedad' => $sociedad, 
                                 'conceptos' => $conceptos]);
    }

    // trae información al reporte de grupos y socios
    public function generarDatosReporteGRP  ($id){
     
        $user = Auth::user();   //  Id de la sociedad
        
        // trae información de la sociedad 
        $sociedad = Sociedad::select('sdd_nombre', 'sdd_email', 'sdd_telefono', 'sdd_tipodoc', 
        'sdd_nrodoc', 'sdd_logo', 'sdd_administra')
        ->where('id', $user->sociedad_id)
        ->first();

        if (!$sociedad) {
            return response()->json(['error' => 'Sociedad no encontrada'], 404);
        }

        $orden = 'grp_titulo';
        if ($id === 'S'){
            $orden = 'soc_nombre';
        }
        $grupos = Grupo::where('grp_sociedad_id', $user->sociedad_id)
        ->join('gruposocios', 'gruposocios.gsc_grupo_id', '=', 'grupos.id')
        ->join('socios', 'socios.id', '=', 'gruposocios.gsc_socio_id')
        ->select(  'grp_titulo', 'grp_detalle', 'grp_estado', 'soc_nombre' )
        ->orderBy($orden, 'asc')
        ->get();

        // Devuelve los datos en formato JSON
        return response()->json(['sociedad' => $sociedad, 
                                 'grupos' => $grupos,
                                'tipo' => $id]);
    }

    // trae información al reporte de ingresos y gastos
    public function generarDatosReporteIG($id){
       $ar = explode("|",$id);
       $ingresoId = $ar[0];        // ide del ingeso gasto
       $ingresoNro = $ar[1];       // Número de ingreso gasto
       $ingresoTipo = $ar[2];      // Tipo de Ingreso Gasto
       $socioId = $ar[3];          // Id del socio
       $user = Auth::user();       //  Id de la sociedad

        $ingregasto = Ingregasto::where('id',$ingresoId)
        ->first();

        $conceptoId =  $ingregasto->iga_concepto_id; // Id del Concepto

        // trae el socio indicado
        $socios = socio::select('soc_nombre', 'soc_telefono', 'soc_email' ,'soc_tipodoc' ,'soc_nrodoc')
        ->where('id',$socioId)
        ->first();

        // trae información de la sociedad 
        $sociedad = Sociedad::select('sdd_nombre', 'sdd_email', 'sdd_telefono', 'sdd_tipodoc', 
        'sdd_nrodoc', 'sdd_logo', 'sdd_administra')
        ->where('id', $user->sociedad_id)
        ->first();

        // trae los abonos que tiene el socio
        $abonos = Abono::where('abo_socio_id', $socioId)
        ->where('abo_sociedad_id', $user->sociedad_id)
        ->where('abo_ingreso_id', $ingresoId)
        ->join('conceptos', 'conceptos.id', '=', 'abonos.abo_concepto_id')
        ->select('abo_concepto_id', 'con_descripcion', 'abo_fecha', 'abo_descripcion', 
        'abo_saldo', 'abo_abono', 'abo_ingreso_id' )
        ->orderBy('abo_concepto_id')
        ->get(); 

        //  Trae los anticipos que tenga el socio
        $anticipos = Anticipo::where('ant_socio_id', $id)
        ->where('ant_ingreso', $ingresoId )
        ->where('ant_saldo','>',0)
        ->select('ant_fecha', 'ant_detalle', 'ant_valor')
        ->get();
       
        // llama al informe para mostrar la información
        return response()->json(['socios' => $socios,  'sociedad' => $sociedad,
                               'ingregasto' => $ingregasto, 'abonos' => $abonos, 'anticipos' => $anticipos ]);
    }

}

