<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gruposocio extends Model
{
    use HasFactory;

    protected $table = 'gruposocios';

    protected $fillable = [
        'gsc_socio_id', 
        'gsc_grupo_id'
    ];


}
