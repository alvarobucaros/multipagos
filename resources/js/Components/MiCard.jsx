
import { useState, React } from 'react';
import Modal from '@/Components/Modal';

export default function MiCard({
    imagen = '',
    titulo = '',
    texto = '',
    ...props
}) {

    const [modal,setModal] = useState(false);

    const openModal = () =>{
        setModal(true);
    }

    const closeModal = () =>{
        setModal(false);
    }
    
    return (


    <div className="mt-2 bg-gray-200 m-px-1 p-2 rounded-xl">
        <div className="grid grid-cols-12 gap-4">
            <div className="bg-green-100 rounded-xl m-px p-2 col-span-1 ">
                <img src={imagen} width="80" height="80" alt="Imagen" />
            </div>
            <div className="bg-yellow-100 rounded-xl m-px p-2 col-span-1 ">
                <span className="text-xs font-bold">{titulo}</span>                     
            </div>
            <div className="bg-blue-200 rounded-xl m-px p-2 col-span-10 ">
                {texto.length > 300 ? (
                <p> {texto.substring(0, 290)} &nbsp; 
                
                    <button  onClick={() => setModal(true)} className='bg-red-300 rounded-xl '>&nbsp; Ver mas &nbsp; </button>
                </p>
                ) : (
                    <p>{texto}</p>
                )}
            </div>
        </div>
 
        <Modal show={modal} onClose={closeModal}>            
            <div className="flex flex-col items-center justify-center p-6">
                <div className="content-center text-blue-700 font-bold"><h4 >{titulo}</h4></div>
                <div className="">{texto}</div>
                <button type="button"
                    className='bg-red-300 hover:bg-red-700 text-white font-bold py-1 px-1 rounded mt-4'
                    onClick={() => setModal(false)}
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    </div>
 

    );
}