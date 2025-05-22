import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import Modal from '@/Components/Modal';
import { useRef, useState, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components//Pagination';
import MiInput from '@/Components/MiInput';
import MiLista from '@/Components/MiLista';

export default function Grupo(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const [grupos, setGrupos] = useState(props.grupos);

    const [socios, setSocios] = useState(props.socios);

    const chunkArray = (arr, size) => {
        return arr.reduce((acc, _, i) => 
        (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc), []);
    };

    // Agrupar los datos en grupos de 3
    const [groupedData, setGroupedData] = useState(chunkArray(socios, 3));

    const [role, setRole] = useState(user.role) 

    const handleChange = (socioId) => {
        setGroupedData(prevGroupedData => {
            // Mapeamos sobre las filas
            return prevGroupedData.map(row => {
                // Mapeamos sobre los items de cada fila
                return row.map(item => {
                    if (item.id === socioId) {
                        // Si encontramos el socio, creamos un nuevo objeto item
                        // con la propiedad 'ok' invertida (0 a 1, 1 a 0)
                        return { ...item, ok: item.ok === 1 ? 0 : 1 };
                    }
                    // Si no es el socio, lo devolvemos sin cambios
                    return item;
                });
            });
        });
    }
    
//  Métodos de la vista

    function actualizaGrupo() {
        const miArray = [grupos.id, groupedData];
        try {
            const response = Inertia.post(`/grupoAct`, miArray);
            alert('Grupos actualizados exitosamente');
            console.log('Respuesta:', response);
        } catch (error) 
        {
            console.error('Error al crear el grupo:', error);
        }
    } 
    
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}            
        >
            <div className="p-6">
            {role !== 'User' && (
                <> 
                    <button   onClick={() => actualizaGrupo()}
                        className="bg-blue-500 text-white px-4 py-1 rounded mb-4"                        
                        > Actualizar Grupo 
                    </button>
                </>
            )}
            <Link
                href="/grupo"
                className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                > Regreso a grupos
            </Link>
            <span className='bg-blue-100'>CLIENTES DEL GRUPO : {grupos.grp_titulo}</span> 
            <div className="bg-blue-100 grid v-screen place-items-center py-1">

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", width: "80%" }}>
                {groupedData.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: "contents" }}>
                    {row.map((item) => (
                        <div key={item.id} style={{ border: "1px solid black", padding: "4px", textAlign: "left" }}>                        
                        <input type="checkbox" onChange={() => handleChange(item.id)}  defaultChecked={item.ok === 1} /> {item.soc_nombre}  
                        </div>
                    ))}
                    </div>
                ))}
            </div>

    </div>
        </div>
        </AuthenticatedLayout>
    );
}
