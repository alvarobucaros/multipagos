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
        Schema::create('abonos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('abo_sociedad_id');
            $table->unsignedBigInteger('abo_socio_id'); 
            $table->unsignedBigInteger('abo_concepto_id'); 
            $table->date('abo_fecha'); 
            $table->string('abo_descripcion',50); 
            $table->decimal('abo_saldo',12,2);
            $table->decimal('abo_abono',12,2);
            $table->integer('abo_ingreso_id');
            $table->timestamps();

            $table->foreign('abo_sociedad_id')
                ->references('id')
                ->on('sociedades')
                ->onDelete('cascade');
            $table->foreign('abo_socio_id')
                ->references('id')
                ->on('socios')
                ->onDelete('cascade');
            $table->foreign('abo_concepto_id')
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
        Schema::dropIfExists('abonos');
    }
};
