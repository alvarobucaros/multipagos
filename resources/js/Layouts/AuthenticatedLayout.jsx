
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuthenticatedLayout({ header, children, empresa=[] }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [u, setU] = useState(0);
    const [error, setError] = useState(null);
 


    return (
     
        <div className="min-h-screen bg-green-100 ">

            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                    <div className="flex h-16 justify-between ">
                        <div className="flex content-around">
                            <div className="flex items-center space-x-4 rounded-lg ">
    
                                <img src={`/images/logomp.png`} alt="Logo Empresa" className="w-40 h-10" />
                                <div className='wx-4'>
                                    <h2 className="text-lg text-center font-semibold text-gray-800">{empresa.emp_nombre} </h2>
                                    <p className="text-center  text-gray-600">{empresa.emp_eslogan}</p>
                                
                                </div>
                                <div>  <h2 className='text-lg text-green-600 font-bold'> MULTI <strong>PAGOS</strong> </h2></div>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
     
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                        <p>Header</p>
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
