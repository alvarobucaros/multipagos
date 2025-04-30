<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subgrupo;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubgrupoController extends Controller
{
/**
     * Display a listing of the resource.
     */

     public function index()
    {
        $user = Auth::user();

        $subgrupos = Subgrupo::where('sgr_empresa_id', $user->empresa_id) 
        ->join('grupos', 'subgrupos.sgr_grupo_id', '=', 'grupos.id')
        ->select('grupos.id', 'grp_titulo','subgrupos.sgr_titulo', 'subgrupos.sgr_detalle', 
            'subgrupos.sgr_estado', 'subgrupos.id as subgrupo_id')  
        ->orderBy('sgr_titulo')  
        ->paginate(10);   

        $grupos = Grupo::where('grp_empresa_id', $user->empresa_id)
        ->select('id', 'grp_titulo')
        ->orderBy('grp_titulo')
        ->get();
    
        return Inertia::render('Subgrupos/Index', [
            'subgrupos' => $subgrupos,
            'grupos' => $grupos,
        ]);
    }


    public function store(Request $request)
    {  
        $request-> validate([
            'sgr_grupo_id' => 'required',
            'sgr_titulo' => 'required|max:50',
            'sgr_detalle' => 'required|max:200',
            'sgr_estado' => 'required',
        ]);

        Subgrupo::create($request->all());
        return redirect()->back()->with('success', 'Subgrupo creado exitosamente.');
    }


    public function update(Request $request, $id)
    {
        $subgrupos = Subgrupo::find($id);
        $subgrupos->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Subgrupo actualizado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subgrupo $subgrupo) // Route Model Binding
    {
         // Cargar la relación empresa
        $subgrupo->load('empresa:id,nombre');
        return response()->json($subgrupo);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subgrupo = Subgrupo::find($id);
        if (!$subgrupo) {
            return response()->json(['message' => 'Subgrupo no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $subgrupo->delete();

         return redirect()->back()->with('success','Subgrupo eliminado correctamente');
        
    }

    
}