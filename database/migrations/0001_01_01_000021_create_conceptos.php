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
        Schema::create('conceptos', function (Blueprint $table) { 
            $table->id();
            $table->unsignedBigInteger('con_sociedad_id');
            $table->string('con_tipo');
            $table->string('con_titulo');
            $table->string('con_descripcion');
            $table->date('con_fechaDesde')->nullable();
            $table->date('con_fechaHasta')->nullable();
            $table->decimal('con_valorCobro',12,2);
            $table->decimal('con_cuotas',12,2);
            $table->decimal('con_valorCuota',12,2);
            $table->string('con_grupo');
            $table->string('con_aplica');
            $table->string('con_estado');
            $table->timestamps();

            $table->foreign('con_sociedad_id')
                ->references('id')
                ->on('sociedades')
                ->onDelete('cascade');
        });
       
    }

    /**  
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conceptos');
             
    }
};
