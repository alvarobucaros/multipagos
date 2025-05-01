<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('emp_nombre', 100);
            $table->string('emp_direccion', 100)->nullable(); 
            $table->string('emp_ciudad', 100);
            $table->string('emp_tipodoc', 1);
            $table->string('emp_nrodoc', 20);
            $table->string('emp_telefono', 20);
            $table->string('emp_email', 100);
            $table->string('emp_logo', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
