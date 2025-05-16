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
        Schema::create('socios', function (Blueprint $table) {
            $table->id();
             $table->unsignedBigInteger('soc_sociedad_id');
		    $table->string('soc_tiposocio');
            $table->string('soc_nombre');
            $table->string('soc_direccion');
            $table->string('soc_ciudad');
            $table->string('soc_telefono');
            $table->string('soc_email')->unique();
            $table->string('soc_tipodoc');
            $table->string('soc_nrodoc');
            $table->string('soc_estado'); 
            $table->timestamps();

            
            $table->foreign('soc_sociedad_id')
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
        Schema::dropIfExists('socios');
    }
};
