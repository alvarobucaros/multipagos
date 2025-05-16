<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sociedad extends Model
{
    use HasFactory;

     protected $table = 'sociedades';

    // Hay muchos usuarios en la empresa.
     
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    
    // Hay muchos conceptos en la empresa.

    public function conceptos(): HasMany
    {
        return $this->hasMany(concepto::class);
    }
    
    // Hay muchos grupos en la empresa.

    public function grupos(): HasMany
    {
        return $this->hasMany(grupo::class);
    }

    // Hay muchos grupos en la empresa.

    public function socios(): HasMany
    {
        return $this->hasMany(socio::class);
    }

      // Hay muchos Ingresos y gastos en la empresa.

    public function ingregastos(): HasMany
    {
        return $this->hasMany(ingregasto::class);
    }

    protected $fillable = [
        'sdd_nombre',
        'sdd_direccion',
        'sdd_ciudad',
        'sdd_tipodoc',
        'sdd_nrodoc',
        'sdd_telefono',
        'sdd_email',
        'sdd_observaciones',
        'sdd_logo',
        'sdd_consecAjustes',
        'sdd_consecRcaja',
        'sdd_consecEgreso',
        'sdd_fchini',
        'sdd_estado',
        'sdd_saldo',
    ];
}