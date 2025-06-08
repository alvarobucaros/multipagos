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
        Schema::create('sociedades', function (Blueprint $table) {
            $table->id();
            $table->string('sdd_nombre', 100);
            $table->string('sdd_direccion', 100)->nullable(); 
            $table->string('sdd_ciudad', 100);
            $table->string('sdd_tipodoc', 1);
            $table->string('sdd_nrodoc', 20);
            $table->string('sdd_telefono', 20);
            $table->string('sdd_email', 100);
            $table->string('sdd_administra')->nullable();
            $table->string('sdd_logo', 100);
            $table->decimal('sdd_consecAjustes',12,2);
            $table->decimal('sdd_consecIngreso',12,2);
            $table->decimal('sdd_consecEgreso',12,2);
            $table->date('sdd_fchini');
            $table->string('sdd_estado',1);
            $table->decimal('sdd_saldo',12,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sociedades');
    }
};
