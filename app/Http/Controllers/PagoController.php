<?php

namespace App\Http\Controllers;

use App\Models\Anticipo;
use App\Models\Abono;
use App\Models\pagos;
use App\Models\Socio;
use App\Models\Sociedad;
use App\Models\Cuenta;
use App\Models\Concepto;
use App\Models\Cuentahead;
use App\Models\Ingregasto;
use Illuminate\Support\Facades\DB;
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
        $saldo = [
            'cxc_concepto_id'=>0, 
            'pago'=>0, 
            'id'=> 0,
            'grupo' => 0,
            'fecha' => null, 
            'con_descripcion'=>'', 
            'total_saldo'=>0
        ];

        return Inertia::render('Pagos/Index', ['socios' => $socios, 'cuentas' => $cuentas, 
                'filters' => $filters, 'socioSeleccionado' => $socioSeleccionado,
                'saldo'=> $saldo]);                   
    }

    public function infoPago($id){
        $ar = explode("|",$id);
        $idIg = $ar[0];         // ide del ingeso gasto
        $nroIg = $ar[1];        // Número de ingreso gasto
        $tipoIg = $ar[2];       // Tipo de Ingreso Gasto
        $socioId = $ar[3];      // Id del socio
        $user = Auth::user();   //  Id de la sociedad

        $ingregasto = Ingregasto::where('id',$idIg)
        ->first();

        $idcpt =  $ingregasto->iga_concepto_id; // Concepto

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
        $abonos = Abono::where('abo_socio_id', $id)
        ->where('abo_sociedad_id', $user->sociedad_id)
        ->where('abo_ingreso_id', $nroIg)
        ->join('conceptos', 'conceptos.id', '=', 'abonos.abo_concepto_id')
        ->select('abo_concepto_id', 'con_descripcion', 'abo_fecha', 'abo_descripcion', 
        'abo_saldo', 'abo_abono', 'abo_ingreso_id' )
        ->orderBy('abo_concepto_id')
        ->get(); 

        //  Trae los anticipos que tenga el socio
        $anticipos = Anticipo::where('ant_socio_id', $id)
        ->where('ant_ingreso', $nroIg )
        ->where('ant_saldo','>',0)
        ->select('ant_fecha', 'ant_detalle', 'ant_valor')
        ->get();
       
        // llama al informe para mostrar la información
        return Inertia::render('Ingregastos/Informe', ['socios' => $socios,  'sociedad' => $sociedad,
                               'ingregasto' => $ingregasto, 'abonos' => $abonos, 'anticipos' => $anticipos ]);
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

        $saldo = Cuenta::join('conceptos', 'conceptos.id', '=', 'cuentas.cxc_concepto_id')
            ->where('cxc_socio_id', $id)
            ->where('cxc_saldo', '>', 0)
            ->groupBy('cxc_concepto_id', 'con_descripcion')
            ->selectRaw('cxc_concepto_id, 0 as pago, 0 as id, 0 as grupo, null as fecha, con_descripcion, SUM(cxc_saldo) as total_saldo')
            ->get();

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
                'cxc_saldo',
                'cxc_concepto_id'
            )
            ->orderBy('con_titulo')
            ->orderBy('cxc_fecha')           
            ->paginate(10)
            ->withQueryString(); // Importante para que la paginación funcione con partial reloads

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
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
      
        $id;                    // id del socio
        $vltAnticipo = 0;       // valor anticipo a procesar
        $aplicado=0;            // Cuanto se aplica de los pagos
        $abono = 0;             // abonos que se digita por cada concepto
        $today = date("Y-m-d"); // hoy
        $detalle='';            // detalle para el abono 
        $sal2 = 0;              // lo que se paga en realidad por cada cuenta
        $consecIngre = 0;

        // Trae la empresa
        $sociedad = Sociedad::select(  'sdd_consecIngreso',  'sdd_saldo')
        ->where('id', $user->sociedad_id)
        ->first();
        $consecIngre = $sociedad ->sdd_consecIngreso;
             
        // Trae un anticipo si hay
        $anticipo = Anticipo::where('ant_sociedad_id', $user->sociedad_id)
        ->where('ant_socio_id', '=', $id)
        ->where('ant_saldo', '>', 0)     
        ->select('id', 'ant_saldo')
        ->first();

        // hay un anticipo
        if ($anticipo) {
            $vltAnticipo = $anticipo->ant_saldo;
            $anticipo->ant_saldo = 0;
            $anticipo->ant_estado = 'A';
            $anticipo->fill($request->input())->saveOrFail();
        }

        $datos = $request->all();  // lo digitado por el usuario (concpto y valor pago)



        $pago='';
       
        // recorre los pagos capturados por cada concepto
        foreach ($datos as $item) {
            if( $item['pago'] > 0){         // si hay abono para este concepto
                $cuentas = Cuenta::where('cxc_socio_id', $id)       // trae las cuentas de este concepto por socio
                ->where('cxc_saldo', '>', 0)
                ->where('cxc_concepto_id', '=', $item['cxc_concepto_id'])
                ->orderBy('cxc_fecha')
                ->get();

                $cuenta = $cuentas->all();

                $abono =  $item['pago'] + $vltAnticipo;  // abono neto digitado + anticipo
                $detalle='Abono por cuotas(s) ';
                $sal2 = 0;
                $aplicado=0;
                $anticipo = 'N';
                $ctrlIngreso = true;
 //   dd($cuenta);
                // Recorre cada cuenta por cada concepro
                foreach ($cuenta as $cta) {
                    $cxcid = $cta->id;
                    $temp = Cuenta::find($cxcid);
                    if ($abono > 0)
                    {
                        $pago = 0;
                        $cxc_saldo = $temp->cxc_saldo;           // guarda el saldo pora el informe de abonos
                        $detalle='Abono a cuota(s) ';
                        $vlr = $cta->cxc_saldo - $abono;        // aplica el abono
                        if ($vlr >= 0 )
                        {                        // No queda abono y Queda un saldo pora pagar
                            $sal2 = $abono;
                            $temp->cxc_saldo = $vlr;
                            $aplicado += $sal2;
                            $abono = 0;
                            $pago = $vlr;
                        }else
                        {
                            $sal2 = $temp->cxc_saldo;
                            $aplicado += $sal2;      // Queda abono para otra cuenta
                            $temp->cxc_saldo = 0;
                            $abono = $vlr * (-1);
                            $pago = $cta->cxc_saldo;
                        }
                        // actualiza la cuenta
                        $temp->fill($request->input())->saveOrFail();

                        // Trae el concepto y extrae el grupo
                        $cpto = Concepto::select('con_grupo')
                        ->where('id', $item['cxc_concepto_id'])
                        ->first();
                        $grupo = $cpto->con_grupo;

                        // Trae el heder de la cuenta y ajusta el saldo pagado
                        $temp = Cuentahead::where('id', $cta['cxc_head_id'])
                                ->first();
                        $temp->cxh_saldo -=  $sal2;   
                        $temp->fill($request->input())->saveOrFail();

                        // Crea un registro de abono pagado
                        $tmp = Abono::updateOrCreate(
                        ['abo_sociedad_id' => $user->sociedad_id, 
                        'abo_socio_id' => $id,
                        'abo_concepto_id' => $item['cxc_concepto_id'],
                        'abo_fecha' =>  $cta->cxc_fecha ,
                        'abo_descripcion' => $detalle,
                        'abo_saldo' => $cxc_saldo, 
                        'abo_abono' => $sal2,
                        'abo_ingreso_id' => 0]
                        );
                    } 

                }
                $this->creaIngregast( $id, $today, $detalle, $item['cxc_concepto_id'], $grupo, $aplicado, true, $anticipo);
             
                $sociedad = Sociedad::select(  'sdd_consecIngreso',  'sdd_saldo')
                ->where('id', $user->sociedad_id)
                ->first();
                $sociedad->sdd_consecIngreso = $consecIngre;
                $sociedad->sdd_saldo += $aplicado;
                $temp->fill($request->input())->saveOrFail();
            }

            //  Queda un anticipo por grabar  '',  ''
            if ($abono > 0){      
                $ctrlIngreso = false;
                $anticipo = 'S';
                $detalle = 'Anticipo por abonos en cuenta ' .  $today;          
                $tmp = Anticipo::updateOrCreate(
                ['ant_sociedad_id' => $user->sociedad_id, 
                'ant_socio_id' => $id,
                'ant_fecha' => $today,
                'ant_detalle' => $detalle,
                'ant_valor' => $abono, 
                'ant_saldo' => $abono,
                'ant_ingreso' => 0,
                'ant_estado' => 'I']
                );
                $this->creaIngregast( $id, $today, $detalle, $item['cxc_concepto_id'], $cta->cxc_grupo_id,$abono, false, $anticipo);
            }
        }
        return;
    }

        public function creaIngregast( $id, $today, $detalle, $concepto, $grupo, $aplicado, $consec, $anticipo )
    {
        $user = Auth::user();
        // Trae la empresa
        $sociedad = Sociedad::select(  'sdd_consecIngreso',   'sdd_saldo')
        ->where('id', $user->sociedad_id)
        ->first();
        $consecIngre = $sociedad->sdd_consecIngreso;
        
        $saldo = $sociedad->sdd_saldo + $aplicado;
        // Crea un registro de Ingresos y gastos
        if($consec){
            $consecIngre += 1;
        }
        $tmp = Ingregasto::updateOrCreate(
        ['iga_sociedad_id' => $user->sociedad_id, 
        'iga_socio_id' => $id,
        'iga_tipo' => 'I',
        'iga_numero' => $consecIngre,
        'iga_Fecha' => $today,
        'iga_concepto_id' => $concepto,
        'iga_detalle' =>  $detalle . ' ' . $today, 
        'iga_Documento'=> '0',
        'iga_credito' => 0,
        'iga_grupo' => $grupo,
        'iga_procesado' => 'N',  
        'iga_anticipo' => $anticipo,               
        'iga_debito' => $aplicado,
        'iga_idUsuario' => $user->sociedad_id]
        );

        $idCreado = $tmp->id; 

        Sociedad::where('id', $user->sociedad_id)
       ->update(['sdd_consecIngreso' => $consecIngre, 'sdd_saldo' => $saldo]);
    
        Abono::where('abo_ingreso_id',0)
        ->where('abo_socio_id', $id)
       ->update(['abo_ingreso_id' => $consecIngre]);

        Anticipo::where('ant_ingreso',0)
        ->where('ant_socio_id', $id)
       ->update(['ant_ingreso' => $consecIngre]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pagos $pagos)
    {
        //
    }
}
