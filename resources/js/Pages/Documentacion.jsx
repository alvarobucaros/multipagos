import { useState, React } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayoutDoc from '@/Layouts/AuthenticatedLayoutDoc';
import MiDocumento from '@/Components/MiDocumento';

export default function MiMenu(props) {
    const user = usePage().props.auth.user;


    const imagen = [
        '../images/empresa.png', 
        '../images/grupos.png',
        '../images/usuarios.png',
        '../images/postcolor.png',
        '../images/documentacion.png',];
 
    const texto = [
       
        'La empresa, Acá se personalizan los parámetros de la aplicación',
        'Los post se agrupan para darles un mejor manejo visual en categorías. Un grupo de publicaciones se definine como una categoría, una colección, o una serie de artículos relacionados por un tema específico. Puede definirse como un conjunto de publicaciones que siguen una secuencia o que desarrollan un tema a lo largo de varios artículos',
        'Esta aolicación tiene usuarios que acceden a los elementos del menú, estos pueden ser administradores o usuarios comunes. Los administradores tienen acceso a todas las opciones del menú, mientras que los usuarios comunes solo tienen acceso a las opciones de su rol.',
        'Un Post (o publicación) es una entidad que representa un artículo o contenido. Esta es la escencia de la aplicación, ya que es el elemento que se va a publicar en el blog.',
        'La documentación es esta guía de como utilizar las opciones de este menú que va apermitir alimentar el Blog',];  

    return (
        <AuthenticatedLayoutDoc
            auth={props.auth}
        >
        <Head title="Documentación" />
                    <Link
                        href="/mimenu"
                        className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                        > Regreso
                    </Link>
                    <span className='bg-blue-100'> DOCUMENTACION </span> 
            {user.name ? ( 

            <>
                {texto.map((itemTexto, index) => (
                    <MiDocumento key={index} texto={itemTexto} imagen={imagen[index]} />
                ))}

            </>
                ) : (
                'Debe autenticarse'
               )} 
        </AuthenticatedLayoutDoc>
        );
    }