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
     
        Schema::create('cuentas', function (Blueprint $table) { 
            $table->id();
            $table->unsignedBigInteger('cxc_sociedad_id');
            $table->unsignedBigInteger('cxc_socio_id');
            $table->unsignedBigInteger('cxc_concepto_id');
            $table->integer('cxc_idGrupo');
            $table->date('cxc_fechaProceso');
            $table->decimal('cxc_valor',12,2);
            $table->decimal('cxc_saldo',12,2);
            $table->string('cxc_activa');
            $table->timestamps();
            $table->foreign('cxc_sociedad_id')
                ->references('id')
                ->on('sociedades')
                ->onDelete('cascade');
            $table->foreign('cxc_socio_id')
                ->references('id')
                ->on('socios')
                ->onDelete('cascade');
            $table->foreign('cxc_concepto_id')
                ->references('id')
                ->on('conceptos')
                ->onDelete('cascade');                
        });
    }

    /**  
     * Reverse the migrations.
     */
    public function down(): void
    {
      
        Schema::dropIfExists('cuentascobrar');           
    }
};
