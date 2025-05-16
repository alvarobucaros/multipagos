<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sociedad;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP
use Inertia\Inertia;

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
            'sdd_consecRcaja' => 'required',
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
            'sdd_consecRcaja' => 'required',
            'sdd_consecEgreso' => 'required',
            'sdd_fchini' => 'required',
            'sdd_saldo' => 'required',
        ]);

        $sociedads = Sociedad::find($id);
        $sociedads->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Sociedad actualizado correctamente');
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