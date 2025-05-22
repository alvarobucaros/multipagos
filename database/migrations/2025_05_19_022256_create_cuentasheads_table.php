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
        Schema::create('cuentashead', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('cxh_sociedad_id');
            $table->unsignedBigInteger('cxh_concepto_id');  
            $table->string('cxh_detalle',100);          
            $table->decimal('cxh_valor',12,2);
            $table->integer('cxh_cuotas');
            $table->integer('cxh_grupo');
            $table->date('cxh_fchinicio');
            $table->string('cxh_nrocxc');
            $table->decimal('cxh_total',12,2);
            $table->decimal('cxh_saldo',12,2);
            $table->timestamps();
            $table->foreign('cxh_sociedad_id')
                ->references('id')
                ->on('sociedades')
                ->onDelete('cascade');
            $table->foreign('cxh_concepto_id')
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
        Schema::dropIfExists('cuentasheads');
    }
};
