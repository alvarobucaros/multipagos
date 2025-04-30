<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';   
 
    protected $fillable = [
        'pos_grupo_id',
        'pos_titulo',
        'pos_descripcion',
        'pos_imagen',
        'pos_estado'
    ];

}
