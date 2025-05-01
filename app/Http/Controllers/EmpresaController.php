<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP
use Inertia\Inertia;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $empresa = Empresa::first();
       
        if (!$empresa) {
            $empresa = new Empresa();
        }
   
        return Inertia::render('Empresas/Index',['empresas'=>$empresa]); 
    
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $empresa = Empresa::first();
   
        if ($empresa) {
            return response()->json($empresa, 200);
        } else {
            return response()->json(['message' => 'Empresa not found'], 404);
        }
    }
    
  
    public function store(Request $request)
    {  
        $request-> validate([
            'emp_nombre' => 'required|max:100',
            'emp_direccion' => 'required|max:100',
            'emp_ciudad' => 'required|max:100',
            'emp_tipodoc' => 'required|max:100',
            'emp_nrodoc' => 'required|max:100',
            'emp_telefono' => 'required|max:100',
            'emp_email' => 'required|max:100',
        ]);

        Empresa::create($request->all());
        return redirect()->back()->with('success', 'Empresa creado exitosamente.');
    }


    public function update(Request $request, $id)
    {
        $request-> validate([
            'emp_nombre' => 'required|max:100',
            'emp_direccion' => 'required|max:100',
            'emp_ciudad' => 'required|max:100',
            'emp_tipodoc' => 'required|max:100',
            'emp_nrodoc' => 'required|max:100',
            'emp_telefono' => 'required|max:100',
            'emp_email' => 'required|max:100',
        ]);

        $empresas = Empresa::find($id);
        $empresas->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Empresa actualizado correctamente');
    }

  

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $empresas = Empresa::find($id);
        if (!$empresas) {
            return response()->json(['message' => 'Empresa no encontrada'], Response::HTTP_NOT_FOUND);
        }
        $empresas->delete();

         return redirect()->back()->with('success','Empresa eliminada correctamente');
        
    }

    
}