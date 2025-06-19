 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { useRef, useState, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import MiInput from '@/Components/MiInput';
import MiLista from '@/Components/MiLista';
import MiTextArea from '@/Components/MiTextArea';
import axios from 'axios'; // Importa axios
import { ReportesPDF } from '@/Utils/ReportesPDF'; // Importa la función del PDF

export default function Sociedad(props) {

    const user = usePage().props.auth.user;
 
    const [sociedad, setSociedad] = useState(props.sociedad);
    const [operation, setOperation] = useState('1'); 

    const [visible, setVisible] = useState(false);
    const [verMenu, setVerMenu] = useState(true);
  
    const { data, setData } = useForm({
        id: sociedad.id, 
        sdd_nombre: sociedad.sdd_nombre,
        sdd_direccion: sociedad.sdd_direccion,
        sdd_ciudad: sociedad.sdd_ciudad,
        sdd_tipodoc: sociedad.sdd_tipodoc,                        
        sdd_nrodoc: sociedad.sdd_nrodoc,
        sdd_telefono: sociedad.sdd_telefono,                         
        sdd_email: sociedad.sdd_email,                         
        sdd_logo: sociedad.sdd_logo,
        sdd_administra: sociedad.sdd_administra,
        sdd_consecAjustes: sociedad.sdd_consecAjustes,
        sdd_consecIngreso: sociedad.sdd_consecIngreso,
        sdd_consecEgreso: sociedad.sdd_consecEgreso,
        sdd_fchini: sociedad.sdd_fchini,
        sdd_estado: sociedad.sdd_estado,
        sdd_saldo: sociedad.sdd_saldo
    });

    const tipoDocOptions = [
        { value: '', label: '-- Seleccione una opción --' }, 
        { value: 'N', label: 'Nit' },
        { value: 'C', label: 'Cédula Ciudadanía' },
        { value: 'E', label: 'Cédula Extranjería' },
    ];

    const estadoOptions = [
        { value: '', label: '-- Selecciona un estado --' }, 
        { value: 'A', label: 'Activo' },
        { value: 'I', label: 'Inactivo' },
    ];

    const save = (e) =>{
        e.preventDefault();
        data.logo = fileName;
        if(operation === 1){  
            try {
                const response = Inertia.post(`/sociedad`, data);
                alert('Datos actualizados exitosamente : '+data.id);
            } catch (error) {
                console.error('Error al crear la sociedad:', error);
            }
        }
        else{      
            try {
                const response = Inertia.put(`/sociedad/${data.id}`, data);
                alert('Datos actualizados exitosamente');
            } catch (error) {
                console.error('Error al actualizar la sociedad:', error);
            }
        }
    }
     
    const eliminar = (id, sdd_nombre) =>{
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar la sociedad '+id + ' '+sdd_nombre,
            text:'Se perderá el sociedad',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/sociedad/${id}`, {
                    onSuccess: () => {
                        alert('sociedad eliminada exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar la sociedad:', errors);
                    },
                });
            }
        });
    }

    const informes = (tipo) => {
        const response = Inertia.put(`/infoSociedad/`+tipo);
    }

    const ayudas = () => {
        const response = Inertia.put(`/ayudas/`);
    }

    /// ************************
    /// Generación del PDF de la sociedad
    
    const [loading, setLoading] = useState(false); // Estado para mostrar feedback al usuario

    const generarReporte = (tipo) => {
        setLoading(true); // Deshabilita el botón y muestra un spinner, por ejemplo

        // Llama a la ruta de Laravel que creamos
        axios.get(route('sociedad.datosSociedad', {tipo:tipo})) // Usamos el helper de rutas de Ziggy (incluido en Inertia)
            .then(response => {
                // Si la llamada es exitosa, response.data contiene el JSON
                const { sociedad } = response.data;
                
                // Llama a la función que genera el PDF con los datos recibidos
                ReportesPDF(sociedad);
            })
            .catch(error => {
                // Manejo de errores
                console.error("Error al obtener los datos para el reporte:", error);
                alert("No se pudo generar el reporte. Inténtalo de nuevo.");
            })
            .finally(() => {
                setLoading(false); // Vuelve a habilitar el botón
            });
    };

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
       { visible && (
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                <h2 className="p-0 text-lg font-medium text-gray-900">
                    Nuestra sociedad
                </h2>
                <div className="bg-white rounded-lg shadow-xl p-2 w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                    <form onSubmit={save}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             
                        <MiInput  Id="sdd_nombre" Type="text" Label="Nombre sociedad" OnChange={handleChange}
                         classNameI="md:col-span-2" maxLength ="100" data ={data.sdd_nombre} required={true}></MiInput>
                        
                        <MiInput  Id="sdd_direccion" Type="text" Label="Dirección" OnChange={handleChange}
                         classNameI="md:col-span-2" maxLength ="100" data ={data.sdd_direccion} required={true}></MiInput>

                        <MiInput  Id="sdd_ciudad" Type="text" Label="Ciudad" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_ciudad} required={true}></MiInput>

                        <MiInput  Id="sdd_telefono" Type="text" Label="Teléfono" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_telefono} required={true}></MiInput>

                        <MiLista Id="sdd_tipodoc"  Label="Tipo Documento"  data ={data.sdd_tipodoc} 
                        options = {tipoDocOptions} OnChange={handleChange} required={true}></MiLista>

                        <MiInput  Id="sdd_nrodoc" Type="text" Label="Nro Documento" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_nrodoc} required={true}></MiInput>

                        <MiInput  Id="sdd_email" Type="text" Label="Correo" OnChange={handleChange}
                         classNameI="md:col-span-2" maxLength ="100" data ={data.sdd_email} required={true}></MiInput>
                   
                        <MiInput  Id="sdd_logo" Type="text" Label="Logo" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_logo} required={true}></MiInput>

                         <img src={`/logos/$data.sdd_logo}`} alt="Logo Empresa" className="w-30 h-30" />
                  
                        <MiTextArea  Id="sdd_administra"  Label="Nombre sociedad" OnChange={handleChange} Rows="2" Cols="50"
                         className="md:col-span-2" maxLength ="100" data ={data.sdd_administra} required={true}></MiTextArea>
                       

                        <MiInput  Id="sdd_consecAjustes" Type="text" Label="Consec Ajustes" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_consecAjustes} required={true}></MiInput>

                        <MiInput  Id="sdd_consecIngreso" Type="text" Label="Consec Ingresos" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_consecIngreso} required={true}></MiInput>

                        <MiInput  Id="sdd_consecEgreso" Type="text" Label="Consec Egresos" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_consecEgreso} required={true}></MiInput>

                        <MiInput  Id="sdd_saldo" Type="text" Label="Saldo actual" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_saldo} required={true}></MiInput>

                        <MiInput  Id="sdd_fchini" Type="date" Label="Fecha Inicio" OnChange={handleChange}
                         classNameI="" maxLength ="50" data ={data.sdd_fchini} required={true}></MiInput>

                        <MiLista Id="sdd_estado"  Label="Tipo Documento"  data ={data.sdd_estado} 
                        options = {estadoOptions} OnChange={handleChange} required={true}></MiLista>

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
       )}{ null }
        { verMenu && (

            <div className="absolute inset-x-0 top-0 h-16 p-6">
                      
                <div className='grid grid-cols-7 gap-4'>
                           
                    {/* <button
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                        onClick={() => informes('LG')}
                        > Listado de Grupos 
                    </button> */}
            <button
                className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => generarReporte('LG')}
                disabled={loading} // El botón se deshabilita mientras se genera
            > 
                {loading ? 'Generando...' : 'Listado de Grupos'}
            </button>
                    <button
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                        onClick={() => informes('CC')}
                        > Informe Cuentas por Cobrar 
                    </button>
                    <button
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                        onClick={() => informes('IG')}
                        > Informe Ingreso y Gasto 
                    </button>
                    <button
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                        onClick={() => informes('CA')}
                        > Resumen Cartera
                    </button>
                    <button
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                        onClick={() => {setVisible(true); setVerMenu(false)}}
                        > Parámetros
                    </button> 
                    <button
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                        onClick={() => ayudas()}
                        > Ayudas
                    </button>  
                    <Link
                        href="/mimenu"
                       className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-300 transition duration-300"
                    > Regreso
                </Link>   
                </div>
            </div>
            )}{ null }
        
        </div>        
        </AuthenticatedLayout>
    );


}