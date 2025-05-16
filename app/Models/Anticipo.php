<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anticipo extends Model
{
    use HasFactory;

    protected $table = 'anticipos';

    protected $fillable = [
        'id', 
        'ant_sociedad_id',
        'ant_socio_id',
        'ant_Fecha',
        'ant_detalle',
        'ant_valor',
        'ant_saldo'
    ];

}
