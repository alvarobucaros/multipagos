import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {BrowserRouter as Router} from 'react-router-dom';
import { Route } from "react-router-dom";
import { useState, React } from 'react';
import Cards from '@/Components/Cards';
import { Head, Link , usePage} from '@inertiajs/react';
import { Button } from '@headlessui/react';
import Modal from '@/Components/Modal';

<link rel="stylesheet" href="assets/css/style.min.css"></link>

export default function Dashboard() {
    const user = usePage().props.auth.user;

    const [modal,setModal] = useState(true);

    const openModal = () =>{
        setModal(true);
    }

    const closeModal = () =>{
        setModal(false);
    }

    const [imagen, setImagen] = useState(['Trotamundos.png', 'Trabajando.jpg', 'pares.png']);
    const [titulo,setTitulo] = useState(['Grupo de mis productos', 'Subgrupo de productos', 'Productos']);

    const texto = ['Esto Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta  Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy dia de martes Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy en la noche tambié como es hoy',
        'Web Developer is the ultimate online web developer community. de hoy es un arreglo Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy de multiples cosas que Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy yo giro',
        'Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy dia de martes Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy en la noche tambié como es hoy',
        'Web Developer is the ultimate online web developer community. You will find articles, tutorials,  Mi arreglo está arreglado para que se muetren cosas que puden ser de utilidad en la fiesta de hoy questions and answers, jobs, tools, and more - all from web developers in the community!'
     ]  ;  
    
    return (
        <AuthenticatedLayout
 
        >
   
        <Head title="Proveedores" />
        {user.name ? ( 

<>

                    <div className="mt-2 bg-gray-200 m-px-1 p-2 rounded-xl">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="bg-green-100 rounded-xl m-px p-2 col-span-1 ">
                                <img src="../images/logo1.png" width="80" height="80" alt="Imagen" />
                            </div>
                            <div className="bg-yellow-100 rounded-xl m-px p-2 col-span-1 ">
                                <span className="text-xm font-bold">{titulo[0]}</span>                     
                            </div>
                            <div className="bg-blue-200 rounded-xl m-px p-2 col-span-10 ">
                                {texto[0].length > 300 ? (
                                <p> {texto[0].substring(0, 290)} &nbsp; 
                                
                                    <Button  onClick={() => setModal(true)} className='bg-red-300 rounded-xl '>&nbsp; Ver mas &nbsp; </Button>
                                </p>
                                ) : (
                                    <p>{texto[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>
           
            
                    <div className="mt-2 bg-gray-200 m-px-1 p-2 rounded-xl">
                        <div className="flex">
                            <div className="bg-green-100 rounded-xl m-px p-2">
                                <img src="../images/Trabajando.jpg" width="80" height="80" alt="Web Developer" />
                            </div>
                            <div className="bg-yellow-100 rounded-xl m-px p-2">
                                <span className="text-xm font-bold">MiltiBlog LARAVEL</span>                     
                            </div>
                            <div className="bg-blue-200 rounded-xl m-px p-2">
                            <p>{texto[1]}</p>
                                                    </div>
                        </div>
                    </div>

                    <div className="mt-2 bg-gray-200 m-px-1 p-2 rounded-xl">
                        <div className="flex">
                            <div className="bg-green-100 rounded-xl m-px p-2">
                                <img src="../images/pares.png" width="80" height="80" alt="Web Developer" />
                            </div>
                            <div className="bg-yellow-100 rounded-xl m-px p-2">
                                <span className="text-xm font-bold">Laravel uso controladoras</span>                     
                            </div>
                            <div className="bg-blue-200 rounded-xl m-px p-2">
                            <p>{texto[2]}</p>                            
                            </div>
                        </div>
                    </div>
           
          <Modal show={modal} onClose={closeModal}>
               
                <div className="flex flex-col items-center justify-center p-6">
                    <div className="content-center text-blue-700 font-bold"><h4 >{titulo[0]}</h4></div>
                    <div className="">{texto[0]}</div>
                        <button type="button"
                            className='bg-red-300 hover:bg-red-700 text-white font-bold py-1 px-1 rounded mt-4'
                            onClick={() => setModal(false)}
                        >
                            Cerrar
                        </button>
                </div>
          </Modal>

<br />
            {/* <div className="flex"  >
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 ">
                    <br className='my-2'/>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg flex flex-row ">
                        <Cards titulo={"GRUPOS DE PRODUCTOS"} detalle={"Grupos de productos que cotizan los Proveedores"} href={"/grupo"}/>
                        <Cards titulo={"SUB GRUPOS PRODUCTOS"} detalle={"Los grupos de productos se dividen en subgrupos para crear una cotización"} href={"/subgrupo"}/>
                        <Cards titulo={"PRODUCTOS"} detalle={"Definición genérica de productos que se van a cotizar"} href={"/producto"}/>
                    </div>
                    <br className='my-3'/>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg flex flex-row">
                        <Cards titulo={"PROVEEDORES"} detalle={"Persona naturales o jurídicas que provee productos o servicios"} href={"/proveedor"}/>
                        <Cards titulo={"COTIZACIONES"} detalle={"Relación de subgrupo de productos para que un proveedor presente un documento detallando los productos o servicios ofrecidos con sus precios y condiciones de venta"} href={"/cotizacion"}/>
                        <Cards titulo={"PARAMETROS"} detalle={"Ajustes a nuestra empresa"} href={"/parametro"}/>
                       
                        {user.role === 'Super' ? (<Cards titulo={"USUARIOS"} detalle={"Personas autorizadas para utlizar esta aplicación"} href={"/user"}/>  ) : (
                            
                            <p></p>  
                        )}
                    </div>
                </div>
            </div> */}
            </>
                ) : (
                'Debe autenticarse'
               )} 
        </AuthenticatedLayout>
    );
}
