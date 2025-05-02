
import { useState, React } from 'react';

export default function MiDocumento({
    imagen = '',
    texto = '',
    ...props
}) {
    
    return (

    <div className="mt-2 bg-gray-100 m-px-1 p-2 rounded-xl">
        <div className="grid grid-cols-12 gap-4">
            <div className="bg-green-100 rounded-xl m-px p-2 col-span-1 mx-auto mr-2">
                <img src={imagen} width="50" height="50" alt="Imagen" />
            </div>
 
            <div className="bg-blue-200 rounded-xl m-px p-2 col-span-10 ">  
                <p>{texto}</p>      
            </div>
        </div> 
    </div>
 

    );
}