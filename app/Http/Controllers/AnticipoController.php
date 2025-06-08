<?php

namespace App\Http\Controllers;

use App\Models\Anticipo;
use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Para respuestas HTTP 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnticipoController extends Controller
{
    /**
     * Display  a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
 
        $anticipos = Anticipo::where('ant_sociedad_id', $user->sociedad_id)
        ->join('socios', 'socios.id', '=', 'anticipos.ant_socio_id')
        ->orderBy('ant_socio_id')
        ->orderBy('ant_fecha', 'desc')
        ->select('anticipos.id', 'anticipos.ant_fecha', 'anticipos.ant_detalle', 'anticipos.ant_socio_id',
        'anticipos.ant_valor', 'anticipos.ant_saldo', 'ant_estado' , 'socios.soc_nombre')
        ->paginate(10);

        $socios = Socio::where('soc_sociedad_id', $user->sociedad_id)
        ->where('soc_tiposocio','S')
        ->select('id', 'soc_nombre as opcion')
        ->orderBy('soc_nombre')
        ->get();

        return Inertia::render('Anticipos/Index', ['anticipos' => $anticipos, 'socios' => $socios]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
      
    }

    private function validate($request)
    {
        return $request->validate([
            'ant_fecha' => 'required|date',
            'ant_valor' => 'required|numeric|min:0',
            'ant_saldo' => 'required|numeric|min:0',
            'ant_detalle' => 'required|max:200',
            'ant_sociedad_id' => 'required|exists:sociedades,id',
            'ant_socio_id' => 'required|exists:socios,id',  
            'ant_estado' => 'required',   
            'ant_ingreso' => 'required',      
        ]);
    }

    public function store(Request $request)
    {  
         $validatedData = $this->validate($request);

        // Validación personalizada
        if ($request['ant_valor'] > 0) {
            $request['ant_saldo'] = $request['ant_valor'];
        }

        try {
            Anticipo::create($validatedData);
            return redirect()->back()->with('success', 'Anticipo creado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un problema al crear el anticipo.');
        }
    }
    
    public function update(Request $request, $id)
    {
        $anticipos = Anticipo::find($id);
        $anticipos->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'anticipos actualizado correctamente');
    }

    public function updateAnt(Request $request, $id){
        $anticipos = Anticipo::find($id);
        if (!$anticipos) {
            return response()->json(['message' => 'Anticipo no encontrado'], 404);
        }   
        try {
            $anticipos->update(['ant_estado' => 'A']); // Solo actualiza el estado
            return redirect()->back()->with('success', 'anticipos actualizado correctamente');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el estado', 'error' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $anticipo = Anticipo::find($id);
        if (!$anticipo) {
            return response()->json(['message' => 'Anticipo no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $anticipo->delete();

         return redirect()->back()->with('success','Anticipo eliminado correctamente'); 
    }
}