<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use App\Models\Socio;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       
        $user = Auth::user();
 
        $grupos = Grupo::orderBy('grp_titulo')->paginate(10); 
        return Inertia::render('Grupos/Index', ['grupos' => $grupos]);
    }

    public function store(Request $request)
    {  
        $request-> validate([
            'grp_titulo' => 'required|max:50',
            'grp_detalle' => 'required|max:200',
        ]);

        Grupo::create($request->all());
        return redirect()->back()->with('success', 'Grupo creado exitosamente.');
    }

    public function storeAct(Request $request){
        $sociosData = $request->all();
        $grupoId = $sociosData[0];
        $socios = $sociosData[1];

        // Crea lista de socios a agregar a gruposocios
        foreach ($socios as $row){
            if (is_array($row)){
                foreach($row as $socio){
                    if($socio['ok'] == 1){
                        $ids[] = $socio['id'];
                    }
                }
            }
        }

        // Elimina los socios de gruposocios que tienen el grupoId
        DB::table('gruposocios')->where('gsc_grupo_id', $grupoId)->delete();

        // Agrega los nuevos socios a gruposocios
        foreach ($ids as $socioId) {
            DB::table('gruposocios')->insert([
                'gsc_grupo_id' => $grupoId,
                'gsc_socio_id' => $socioId,
            ]);
        }

       // dd($ids);
    }

    public function update(Request $request, $id)
    {
        $grupos = Grupo::find($id);
        $grupos->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Grupo actualizado correctamente');
    }

    public function updatePart($id){

        $user = Auth::user();
        $grupoId = $id;
        $sociedadId =  $user->sociedad_id;

        $grupos = Grupo::find($id);  //tabla grupos para mostarr información
        
        $query = "
            SELECT id, soc_nombre, 0 as ok FROM socios 
            WHERE soc_tiposocio = 'S' 
            AND soc_sociedad_id = ? 
            AND socios.id NOT IN (SELECT gsc_socio_id FROM gruposocios WHERE gsc_grupo_id = ?) 
            UNION 
            SELECT id, soc_nombre, 1 as ok FROM socios 
            WHERE soc_tiposocio = 'S' 
            AND soc_sociedad_id = ? 
            AND socios.id IN (SELECT gsc_socio_id FROM gruposocios WHERE gsc_grupo_id = ?)
        ";

        $socios = DB::select($query, [$sociedadId, $grupoId, $sociedadId, $grupoId]);
 
        return Inertia::render('Grupos/IndexPart', ['socios' => $socios, 'grupos' => $grupos]);
      
  }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $grupo = Grupo::find($id);
        if (!$grupo) {
            return response()->json(['message' => 'Post no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $grupo->delete();

         return redirect()->back()->with('success','Grupo eliminado correctamente');
        
    }

    
}