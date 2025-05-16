<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Concepto extends Model
{
    use HasFactory;

    protected $table = 'conceptos';

    protected $fillable = [
        'con_sociedad_id', 
        'con_tipo',  // I=Ingreso, E=Egreso, A=Ajustes, S=Saldo, C=Cuota
        'con_titulo',
        'con_descripcion', 
        'con_fechaDesde',
        'con_fechaHasta',
        'con_valorCobro',
        'con_cuotas',
        'con_valorCuota',
        'con_grupo',
        'con_aplica', // T=Todos, G=Grupo, 
        'con_estado'  // A=Activo, I=Inactivo
    ];
    
     public function sociedad()
    {
        return $this->belongsTo(Sociedad::class, 'con_sociedad_id');
    }
}

