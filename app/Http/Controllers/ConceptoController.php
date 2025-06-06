<?php

namespace App\Http\Controllers;

use App\Models\Concepto;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConceptoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       
        $user = Auth::user();

        if (!$user || !$user->sociedad_id) {           
            return Inertia::render('Conceptos/Index', ['conceptos' => []]);
        }
         
        $conceptos = Concepto::where('con_sociedad_id', $user->sociedad_id)
        ->join('grupos', 'grupos.id', '=', 'conceptos.con_grupo')
        ->select('conceptos.id','con_sociedad_id','con_tipo','con_titulo','con_descripcion','con_fechaDesde',
                'con_fechaHasta','con_valorCobro','con_cuotas','con_valorCuota','con_grupo','grp_titulo',
                'con_aplica','con_estado')
        ->orderBy('con_tipo')
        ->orderBy('con_titulo')
        ->paginate(10);

        $grupos = Grupo::where('grp_sociedad_id', $user->sociedad_id)
        ->select('id', 'grp_titulo as opcion')
        ->orderBy('grp_titulo')
        ->get();

        return Inertia::render('Conceptos/Index', ['conceptos' => $conceptos, 'grupos' => $grupos]);
    }

    public function store(Request $request)
    {  
        $request-> validate([
            'con_titulo' => 'required|max:50',
            'con_descripcion' => 'required|max:200',
        ]);

        Concepto::create($request->all());
        return redirect()->back()->with('success', 'concepto creado exitosamente.');
    }


    public function update(Request $request, $id)
    {
        $conceptos = Concepto::find($id);
        $conceptos->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'concepto actualizado correctamente');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $concepto = Concepto::find($id);
        if (!$concepto) {
            return response()->json(['message' => 'Post no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $concepto->delete();

         return redirect()->back()->with('success','concepto eliminado correctamente');
        
    }

    
}