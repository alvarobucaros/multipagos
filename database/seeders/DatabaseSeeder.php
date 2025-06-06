<?php

namespace Database\Seeders;

use App\Models\Grupo;
use App\Models\User;
 use App\Models\Sociedad;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       
         Sociedad::factory()->create([
      
            'id' => 1,
            'sdd_nombre' => 'EMPRESA DE PRUEBAS SAS',
            'sdd_direccion' => 'Avenida Nacional # 55 - 22',
            'sdd_ciudad' => 'Santa Lucía',
            'sdd_tipodoc' => 'N',
            'sdd_nrodoc' => '9800545221',
            'sdd_telefono' => '601 357 22 22',
            'sdd_email' => 'test@com.co',
            'sdd_logo' => 'logo.png',
            'sdd_observaciones' => 'Esta es una empresa de pruebas',       
            'sdd_consecAjustes' => '0',
            'sdd_consecIngreso' => '0',
            'sdd_consecEgreso' => '0',
            'sdd_fchini'  => '2025-01-01',
            'sdd_estado' => 'A',
            'sdd_saldo' => '0',   
         ]);

        User::factory()->create([
            'name' => 'Administrador para pruebas',
            'email' => 'admin@com.co',
            'sociedad_id' => 1,
            'password' => 'Admin123',
            'role' => 'super',
        ]);
            Grupo::factory()->create([
            'id' => 1,
            'grp_titulo' => 'Todos',
            'grp_detalle' => 'Todos los socios',
            'grp_estado' => 'A',
            'grp_sociedad_id' => 1,    
        ]);
    }
}
