<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingregasto extends Model
{
    use HasFactory;

    protected $table = 'ingregastos';

    protected $fillable = [
        'id', 
        'iga_sociedad_id',       
        'iga_idsocio',
        'iga_tipo', // I=Ingreso, G=Gasto, A=Aguste
        'iga_numero',
        'iga_Fecha',
        'iga_concepto_id',
        'iga_detalle',
        'iga_Documento',
        'iga_debito',
        'iga_credito',
        'iga_grupo',
        'iga_procesado',  // A=Activo, I=Inactivo
        'iga_idUsuario',
        'created_at',
        'updated_at'
    ];

}
