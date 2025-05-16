<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupos';

    protected $fillable = [
        'grp_sociedad_id', 
        'grp_titulo', 
        'grp_detalle', 
        'grp_estado'];

    public function sociedad()
    {
        return $this->belongsTo(Sociedad::class, 'grp_sociedad_id');
    }
}
