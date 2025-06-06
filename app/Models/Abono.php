<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abono extends Model
{
      use HasFactory;

    protected $table = 'abonos';

    protected $fillable = [
        'id', 
        'abo_sociedad_id',
        'abo_socio_id',
        'abo_concepto_id',
        'abo_fecha',
        'abo_descripcion',
        'abo_saldo',
        'abo_abono',
        'abo_ingreso_id',
    ];
}
