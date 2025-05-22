import React from 'react';
import { Head,usePage, Link } from '@inertiajs/react';
import AuthenticatedLayoutMenu from '@/Layouts/AuthenticatedLayoutDoc';

export default function MiMenu(props) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayoutMenu
            auth={props.auth}
        >
            <div className="p-6">
                <div className='grid grid-cols-8 gap-4'>
                    <Link href="/grupo" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Grupos</h3>
                    </Link>
                    <Link href="/socio" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Terceros</h3>
                    </Link>
                    <Link href="/concepto" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Conceptos</h3>
                    </Link>

                    <Link href="/cuentahead" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Cuentas Cobro</h3>
                    </Link>
                    <Link href="/pago" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Pagos</h3>
                    </Link>
                    <Link href="/ingregasto" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Ingreso Gasto</h3>
                    </Link>
                    <Link href="/anticipo" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Anticipos</h3>
                    </Link>                    
                    <Link href="/sociedad/1" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Mi Empresa</h3>
                    </Link>
                </div>
            </div>
            <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                <p>Versión 1.0.0 &nbsp;&nbsp;2025 &nbsp;  &nbsp;Laravel&nbsp; PHP </p>
                 Power by: &nbsp; <a className='text-blue-600 dark:text-sky-400' href="https://www.aortizc.com.co/">aortizc  &nbsp;&#169;</a>
            </footer>
        </AuthenticatedLayoutMenu>
    );
}