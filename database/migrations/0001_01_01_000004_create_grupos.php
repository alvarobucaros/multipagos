<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations..
     */
    public function up(): void
    {
        Schema::create('grupos', function (Blueprint $table) { 
            $table->id();       
            $table->unsignedBigInteger('grp_sociedad_id');
            $table->string('grp_titulo');
            $table->text('grp_detalle');
            $table->string('grp_estado');          
            $table->timestamps(); 

            $table->foreign('grp_sociedad_id')
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
        Schema::dropIfExists('grupos');                     
    }
};
