<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    use HasFactory;

    protected $table = 'cuentas';

    protected $fillable = [
        'cxc_head_id', 
        'cxc_socio_id', 
        'cxc_concepto_id',
        'cxc_grupo_id',
        'cxc_fecha',
        'cxc_valor',
        'cxc_saldo'
    ];

    public function sociedad()
    {
        return $this->belongsTo(Sociedad::class, 'cxc_sociedad_id');
    }
}