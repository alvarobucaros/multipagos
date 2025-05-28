<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Grupo;
use App\Models\Empresa;
use App\Models\Sociedad;
use Illuminate\Http\Response; // Para respuestas HTTP
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {

       return Inertia::render('Auth/Index');
  
    }

    public function indexDoc()
    {        
        return Inertia::render('Documentacion');
    }

    public function indexMenu()
    {        
        $user = Auth::user();

        $sociedad = Sociedad::select( 'sdd_nombre', 'sdd_logo', 'sdd_estado')
        ->where('id', $user->sociedad_id)
        ->get();

        return Inertia::render('MiMenu', [ 'sociedad' => $sociedad]);
    }
      
    public function indexPost()
    {

      // Recupera post por orden desc a la fecha de creación 
            
        $posts = Post::where('posts.id','>',0) 
        ->join('grupos', 'posts.pos_grupo_id', '=', 'grupos.id')
        ->select('posts.id', 'pos_titulo','grupos.grp_titulo', 'posts.pos_descripcion', 
            'posts.pos_estado', 'posts.pos_imagen' ) 
        ->orderBy('posts.created_at', 'desc') 
        ->orderBy('grp_titulo')
        ->orderBy('pos_titulo')  
        ->paginate(6);   

        $empresa = Empresa::first();
        if (!$empresa) {
            $empresa = new Empresa();
        }

        return Inertia::render('Dashboard', [
            'posts' => $posts, 'empresa' => $empresa,
        ]);
    }

    public function store(Request $request)
    {  
        $request-> validate([
            'pos_grupo_id' => 'required',
            'pos_titulo' => 'required|max:50',
            'pos_descripcion' => 'required',
            'pos_estado' => 'required',
        ]);
    

        Post::create($request->all());
        return redirect()->back()->with('success', 'POst creado exitosamente.');
    }

    
    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        $post->fill($request->input())->saveOrFail();
        return redirect()->back()->with('success', 'Post actualizado correctamente');
    }
    
      
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['message' => 'Post no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $post->delete();

            return redirect()->back()->with('success','post eliminado correctamente');
        
    }
        
}
 
