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


                <div className='grid grid-cols-5 gap-4'>
                    <Link href="/grupo" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Grupos</h3>
                    </Link>
                    <Link href="/post" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Posts</h3>
                    </Link>
                    <Link href="/user" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Usuarios</h3>
                    </Link>
                    <Link href="/empresa" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Mi Empresa</h3>
                    </Link>
                    <Link href="/docs" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition duration-300">
                        <h3 className='text-center'>Documentación</h3>
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