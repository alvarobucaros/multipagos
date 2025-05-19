<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cuentahead extends Model
{
    use HasFactory;

    protected $table = 'cuentashead';

    protected $fillable = [
        'cxh_sociedad_id',
        'cxh_concepto_id',
        'cxh_detalle',
        'cxh_valor', 
        'cxh_cuotas', 
        'cxh_fchinicio',
        'cxh_nrocxc',        
        'cxh_total',
        'cxh_saldo'
    ];

    public function sociedad()
    {
        return $this->belongsTo(Sociedad::class, 'cxh_sociedad_id');
    }
}