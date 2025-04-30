import React from 'react';
import { Head, Link } from '@inertiajs/react';


const Ejemplo = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Post En Construcción</h1>
            <form>
            <div className="flex justify-center items-center">
    <img className='py-8' src="../images/Trabajando.jpg" alt="Espera trabajar"  />
    <div><p>Mucho trabajar en esto!!!</p></div>
    </div>
            </form>
            <Link
                href="/dashboard"
                className="text-white bg-blue-400 hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            > Al Menú
            </Link>
        </div>
    );
};

export default Ejemplo;
