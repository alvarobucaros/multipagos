<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';

    protected $fillable = [
        'emp_nombre',
        'emp_direccion',
        'emp_ciudad',
        'emp_tipodoc',
        'emp_nrodoc',
        'emp_telefono',
        'emp_email',
        'emp_logo',
    ];


}