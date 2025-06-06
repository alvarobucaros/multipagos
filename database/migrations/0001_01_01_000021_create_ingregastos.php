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
        Schema::create('ingregastos', function (Blueprint $table) {  
            $table->id();
            $table->unsignedBigInteger('iga_sociedad_id');
            $table->unsignedBigInteger('iga_socio_id');
            $table->string('iga_tipo',1);
            $table->integer('iga_numero');
            $table->date('iga_Fecha');
            $table->integer('iga_concepto_id');
            $table->string('iga_detalle');
            $table->string('iga_Documento');
            $table->decimal('iga_debito',12,0);
            $table->decimal('iga_credito',12,0);
            $table->integer('iga_grupo');
            $table->string('iga_procesado',1);  
            $table->integer('iga_idUsuario');
            $table->timestamps();
            $table->foreign('iga_sociedad_id')
                ->references('id')
                ->on('sociedades')
                ->onDelete('cascade');
            $table->foreign('iga_socio_id')
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
        Schema::dropIfExists('ingregastos');   
    }
};
