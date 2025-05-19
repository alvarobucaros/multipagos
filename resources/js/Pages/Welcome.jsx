import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion, appVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };
 
    return (
        <>
            <Head title="Welcomesss" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
  
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                            <img className='py-8' src="../images/logomp.png" alt="Logo empresa"  />
                            </div> 
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        // href={route('posts')}
                                        href="/post"
                                        className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
                                    >
                                        <p>con user</p>
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
                                    >
                                         <p>sin user</p>
                                        Dashboard
                                    </Link>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">

                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                           Versión v{appVersion} &#169; Laravel v{laravelVersion} (PHP v{phpVersion})
                           <p>
                           Power by: &nbsp; <a className='text-blue-600 dark:text-sky-400' href="https://www.aortizc.com.co/">aortizc  &nbsp;&#169;</a>
                           </p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
