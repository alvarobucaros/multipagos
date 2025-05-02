 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { useRef, useState, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import MiInput from '@/Components/MiInput';
import MiLista from '@/Components/MiLista';

export default function Empresa(props) {

    const user = usePage().props.auth.user;
 
    const [empresa, setEmpresa] = useState(props.empresas);
    const [operation, setOperation] = useState('1'); 

    // if (!empresa) {
    //     return <p>Cargando...</p>; // Muestra un mensaje de carga mientras `empresa` se carga
    // }
    
    const { data, setData } = useForm({
        id: empresa.id, 
        emp_nombre: empresa.emp_nombre,
        emp_direccion: empresa.emp_direccion,
        emp_ciudad: empresa.emp_ciudad,
        emp_tipodoc: empresa.emp_tipodoc,                        
        emp_nrodoc: empresa.emp_nrodoc,
        emp_telefono: empresa.emp_telefono,                         
        emp_email: empresa.emp_email,                         
        emp_logo: empresa.emp_logo,

    });

    const tipoDocOptions = [
        { value: '', label: '-- Seleccione una opción --' }, // O pción por defecto/placeholder
        { value: 'N', label: 'Nit' },
        { value: 'C', label: 'Cédula Ciudadanía' },
        { value: 'E', label: 'Cédula Extranjería' },
    ];

    const save = (e) =>{
        e.preventDefault();
        data.logo = fileName;
        if(operation === 1){  
            try {
                const response = Inertia.post(`/empresa`, data);
                alert('Datos actualizados exitosamente : '+data.id);
            } catch (error) {
                console.error('Error al crear la empresa:', error);
            }
        }
        else{      
            try {
                 const response = Inertia.put(`/empresa/${data.id}`, data);
                alert('Datos actualizados exitosamente');
              // console.log('Respuesta:', response);
            } catch (error) {
                console.error('Error al actualizar la empresa:', error);
            }
        }
    }
     
    const eliminar = (id, emp_nombre) =>{
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar la empresa '+id + ' '+emp_nombre,
            text:'Se perderá el empresa',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/empresa/${id}`, {
                    onSuccess: () => {
                        alert('empresa eliminada exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar la empresa:', errors);
                    },
                });
            }
        });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setData((Data) => ({
            ...Data,
            [name]: value,
        }));
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}   
        >
         
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
       
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                <h2 className="p-0 text-lg font-medium text-gray-900">
                    Nuestra Empresa
                </h2>
                <div className="bg-white rounded-lg shadow-xl p-2 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                    <form onSubmit={save}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                       
                        <MiInput  Id="emp_nombre" Type="text" Label="Nombre Empresa" OnChange={handleChange}
                         classNameI="md:col-span-2" maxLength ="100" data ={data.emp_nombre} required={true}></MiInput>
                        
                        <MiInput  Id="emp_direccion" Type="text" Label="Dirección" OnChange={handleChange}
                         classNameI="md:col-span-2" maxLength ="100" data ={data.emp_direccion} required={true}></MiInput>

                        <MiInput  Id="emp_ciudad" Type="text" Label="Ciudad" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.emp_ciudad} required={true}></MiInput>

                        <MiInput  Id="emp_telefono" Type="text" Label="Teléfono" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.emp_telefono} required={true}></MiInput>

                        <MiLista Id="emp_tipodoc"  Label="Tipo Documento"  data ={data.emp_tipodoc} 
                        options = {tipoDocOptions} OnChange={handleChange} required={true}></MiLista>

                        <MiInput  Id="emp_nrodoc" Type="text" Label="Nro Documento" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.emp_nrodoc} required={true}></MiInput>

                        <MiInput  Id="emp_email" Type="text" Label="Correo" OnChange={handleChange}
                         classNameI="md:col-span-2" maxLength ="100" data ={data.emp_email} required={true}></MiInput>
                   
                        <MiInput  Id="emp_logo" Type="text" Label="Logo" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.emp_logo} required={true}></MiInput>
                  
                        <br />   


                        <div className="border-t flex justify-end space-x-3">
                            <button
                                type="submit"

                                className="bg-blue-500 text-white px-4 py-1 mx-4 rounded mb-4"
                            >
                                Actualizar                            
                            </button>
                            <Link
                                href="/mimenu"
                                className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                                > Regreso
                            </Link>
                        </div>
                        <div style={{display:'none'}}>
                            <input type="text" id="id" name="id"
                                value='data.id' />
                        </div>
                    </div>

                    </form>
                </div>
            </div>
            </div>        
        </AuthenticatedLayout>
    );


}