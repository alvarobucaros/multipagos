<?php

namespace Database\Seeders;

use App\Models\User;
 use App\Models\Empresa;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       
         Empresa::factory()->create([
            'emp_nombre' => 'EMPRESA DE PRUEBAS SAS',
            'emp_direccion' => 'Avenida nacional # 55 - 22',
            'emp_ciudad' => 'Santa Lucía',
            'emp_tipodoc' => 'N',
            'emp_nrodoc' => '9800545221',
            'emp_telefono' => '601 357 22 22',
            'emp_email' => 'test@com.co',
            'emp_logo' => 'logo.png',
            'emp_eslogan' => 'Empresa que se presta para mis pruebas',
         ]);

        User::factory()->create([
            'name' => 'Administrador para pruebas',
            'email' => 'admin@com.co',
            'empresa_id' => 1,
            'password' => 'Admin123',
            'role' => 'super'
        
        ]);
    }
}
