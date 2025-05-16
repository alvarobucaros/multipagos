<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Socio extends Model
{
    use HasFactory;

    protected $table = 'socios';

    protected $fillable = [
       'id',       
       'soc_sociedad_id',
       'soc_tiposocio',  // S=Socio, T=Tercero
       'soc_nombre',
       'soc_direccion',
       'soc_ciudad',
       'soc_telefono',
       'soc_email',
       'soc_tipodoc',  // C=Cédula, E=Cédula extranjero, N=NIT
       'soc_nrodoc',
       'soc_estado' // A=Activo, I=Inactivo
    ];

    public function sociedad()
    {
        return $this->belongsTo(Sociedad::class, 'soc_sociedad_id');
    }
}