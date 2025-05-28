<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingregasto extends Model
{
    use HasFactory;

    protected $table = 'ingregastos';

    protected $fillable = [
    'iga_sociedad_id', 'iga_socio_id', 'iga_tipo', 'iga_numero', 
    'iga_Fecha', 'iga_concepto_id', 'iga_detalle', 'iga_Documento', 
    'iga_debito', 'iga_credito', 'iga_grupo', 'iga_procesado', 'iga_idUsuario'
    ];
   
}
