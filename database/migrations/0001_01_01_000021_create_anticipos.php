<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void    {
             
        Schema::create('anticipos', function (Blueprint $table) {  
            $table->id();
            $table->unsignedBigInteger('ant_sociedad_id');
            $table->unsignedBigInteger('ant_socio_id');
            $table->date('ant_fecha');
            $table->string('ant_detalle',200);
            $table->decimal('ant_valor',12,0);
            $table->decimal('ant_saldo',12,0);
            $table->string('ant_estado', 1);
            $table->integer('ant_ingreso', 1);
            $table->timestamps();

            $table->foreign('ant_sociedad_id')
                ->references('id')
                ->on('sociedades')
                ->onDelete('cascade');
            $table->foreign('ant_socio_id')
                ->references('id')
                ->on('socios')
                ->onDelete('cascade');
        });             
        
    }

 

    /**  
     * Reverse the migrations.
     */
    public function down(): void
    {  
        Schema::dropIfExists('anticipos');        
    }
};
