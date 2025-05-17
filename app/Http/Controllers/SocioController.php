<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SocioController extends Controller
{
   /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       
        $user = Auth::user();
 
        $socios = Socio::where('soc_sociedad_id', $user->sociedad_id)
        ->orderBy('soc_tiposocio')
        ->orderBy('soc_nombre')
        ->paginate(10);
        return Inertia::render('Socios/Index', ['socios' => $socios]);
    }


    public function store(Request $request)
    {  
        $request-> validate([
            'soc_nombre' => 'required|max:100',
            'soc_telefono' => 'required|max:50',
            'soc_email' => 'required|max:50',
        ]);
         Socio::create($request->all());
        return redirect()->back()->with('success', 'Socio creado exitosamente.');
    }


    public function update(Request $request, $id)
    {
        $request-> validate([
            'soc_nombre' => 'required|max:100',
            'soc_telefono' => 'required|max:50',
            'soc_email' => 'required|max:50',
        ]);

        $socios = Socio::find($id);
        $socios->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Socio actualizado correctamente');
    }

  

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $socios = Socio::find($id);
        if (!$socios) {
            return response()->json(['message' => 'Post no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $socios->delete();

         return redirect()->back()->with('success','Socio eliminado correctamente');
        
    }

    
}



