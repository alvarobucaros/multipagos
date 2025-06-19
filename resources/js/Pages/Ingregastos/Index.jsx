import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import Modal from '@/Components/Modal';
import { useRef, useState, useEffect, React } from 'react';
import { Head ,useForm, usePage, Link} from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components//Pagination';
import MiInput from '@/Components/MiInput';
import MiLista from '@/Components/MiLista';
import MiSelectDinamico from '@/Components/MiSelectDinamico';
import { ReportesIG } from '@/Utils/ReportesIG';


export default function Ingregasto(props) {
    const user = usePage().props.auth.user;
    const [modal,setModal] = useState(false);
    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    const [conceptos, setConceptos] = useState(props.conceptos);

    const [socios, setSocios] = useState(props.socios);

    const [sociedad, setSociedad] = useState(props.sociedad);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({
        id:'',
        iga_sociedad_id:user.sociedad_id,
        iga_socio_id:'',
        iga_tipo: '',
        iga_numero: '', 
        iga_Fecha: '', 
        iga_concepto_id: '',
        iga_detalle: '', 
        iga_Documento: '',
        iga_debito: '',
        iga_credito: '',
        iga_grupo: '', 
        iga_procesado: '',
        iga_anticipo:'',
        iga_idUsuario:user.id,   
    });
 
    const [role, setRole] = useState(user.role) 

    const openModal = (op) =>{
        setModal(true);
        setOperation(op);
        if(op === 1){
            setTitle('Añadir: Ingreso, gasto o Ajuste');
            setData({iga_sociedad_id:user.sociedad_id, iga_socio_id:'', iga_tipo:'', iga_numero:'0', 
                iga_Fecha:'', iga_concepto_id:'', iga_detalle:'', iga_Documento:'0', iga_debito:'', 
                iga_credito:'', iga_grupo:'1', iga_procesado:'N', iga_anticipo:'N', iga_idUsuario:user.id}); 
        }
        else{
            setTitle('Modificar ingregasto');    
        }
    }

    const closeModal = () =>{
        setModal(false);
    }

    const enDesarrollo = (op) =>{
            alert('En desarrollo '+op)
    }

    const tipoIgaOptions = [
        { value: '', label: '-- Seleccione una opción --' }, 
        { value: 'I', label: 'Ingresos' },
        { value: 'G', label: 'Gasto' },
        { value: 'A', label: 'Ajuste' },
    ];

    const tipoIga = {
        I: 'Ingresos',
        G: 'Gasto',
        A: 'Ajuste',
        S: 'Saldo parcial',
    };

    const save = (e) =>{
        e.preventDefault();
         if(validate()){
            if(operation === 1){  // Crear nuevo ingreso / gasto
                try {
                    const response = Inertia.post(`/ingregasto`, data);
                    alert('Datos actualizados exitosamente');
                    console.log('Respuesta:', response);
                } catch (error) {
                    console.error('Error al crear el ingregasto:', error);
                }
            }
            else{       // Actualiza ingreso / gasto existente
                try {
                    const response = Inertia.put(`/ingregasto/${data.id}`, data);
                    alert('Datos actualizados exitosamente');
                    console.log('Respuesta:', response);
                } catch (error) {
                    console.error('Error al actualizar el ingreso / gasto:', error);
                }
                setModal(false);
            }
        }else{
            alert('Error en la validación de datos ');
        }
    }

    const [loading, setLoading] = useState(false);

    const imprimir = (id, tipo, numero, socioId, anticipo) => {
        if(anticipo === 'N'){
            if(tipo !== 'A'){
                setLoading(true); // Deshabilita el botón y muestra un spinner, por ejemplo
              
                id=id + '|'+ numero + '|' + tipo +'|' +socioId
                // Llama a la ruta de Laravel que creamos
                axios.get(route('sociedad.datosIngreGasto', {id:id})) // Usamos el helper de rutas de Ziggy (incluido en Inertia)
                    .then(response => {
                        // Si la llamada es exitosa, response.data contiene el JSON
                        const { sociedad } = response.data;
                        const { socios } = response.data;
                        const {ingregasto} = response.data;
                        const {abonos} = response.data;
                        const {anticipos} = response.data;
                        // Llama a la función que genera el PDF con los datos recibidos
                        ReportesIG(sociedad, socios, ingregasto, abonos, anticipos);
                        alert('Reporte generado exitosamente');
                    })
                    .catch(error => {
                        // Manejo de errores
                        console.error("Error al obtener los datos para el reporte:", error);
                        alert("No se pudo generar el reporte. Inténtalo de nuevo.");
                    })
                    .finally(() => {
                        setLoading(false); // Vuelve a habilitar el botón
                    });
            }
        else{
            alert('Los ajustes no se imprimen')
        }
        }else{
            alert ('Este es un anticipo.Para imprimirlo vaya a anticipos')
        }
    };

    const imprimirOld = (id, tipo, numero, socioId, anticipo) => {
        if(anticipo === 'N'){
            if(tipo !== 'A'){
                id=id + '|'+ numero + '|' + tipo +'|' +socioId
                const response = Inertia.get(`/infoPago/`+id);
                }
                else{
                    alert('Los ajustes no se imprimen')
                }
            }else{
                alert ('Este es un anticipo.Para imprimirlo vaya a anticipos')
            }
    }     

    const eliminar = (id, tipo, numero, concepto, procesado) =>{
        var tipoAux = tipoIga[tipo]
       if(procesado === 'S'){
            alert('!! Este registro no se puede borra por que está en firme cuando se actualizaron saldos')
            return;
       }
        const alerta = Swal.mixin({ buttonsStyling:true});
            alerta.fire({
            title:'Seguro de eliminar el  ' + tipoAux + ' id ' +id + '  Nro.  ' + numero + ' detalle ' + concepto,
            text:'Se perderá el Ingreso / gasto',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i>No, Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                Inertia.delete(`/ingregasto/${id}`, {
                    onSuccess: () => {
                        alert(' Ingreso / gasto eliminado exitosamente.');
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar el  Ingreso / gasto:', errors);
                    },
                });
            }
        });
    }

    const [tipoSeleccionado, setTipoSeleccionado] = useState("I");

    const [conceptosFiltrados, setConceptosFiltrados] = useState([]);


    const recalculo = () =>{
        alert('Calculo');
        Inertia.post(`/recalculoSaldo`);
    }


    // métodos de la vista

    function validate() {
        if(data.iga_debito === ''){data.iga_debito = '0';}
        if(data.iga_credito === ''){data.iga_credito = '0';}
        if(data.iga_numero === ''){data.iga_numero = '0';}
        data.iga_debito = parseFloat(data.iga_debito) || 0;
        data.iga_credito = parseFloat(data.iga_credito) || 0;
        data.iga_numero = parseInt(data.iga_numero) || 0;
        if(data.iga_Fecha === ''){data.iga_Fecha = new Date().toISOString().split('T')[0];} // Asigna la fecha actual si está vacía
        if(data.iga_concepto_id === ''){data.iga_concepto_id = '1'}
        return(true);
    }


    function handleTipoChange(event) {
        const tipo = event.target.value;
        setTipoSeleccionado(tipo);
        setConceptosFiltrados(conceptos.filter(conceptos => conceptos.con_tipo === tipo));
    };

    function handleChange(e) {
        const { name, value } = e.target;
            if(name === 'iga_tipo'){    //  Filtra los conceptos según el tipo seleccionado
                setTipoSeleccionado(value);
                setConceptosFiltrados(conceptos.filter(conceptos => conceptos.con_tipo === value));
                if(value === 'I' ){data.iga_numero = sociedad[0].sdd_consecIngreso + 1;}
                if(value === 'G' ){data.iga_numero = sociedad[0].sdd_consecEgreso + 1;}
                if(value === 'A' ){data.iga_numero = sociedad[0].sdd_consecAjustes + 1;}
            }
        setData((Data) => ({
            ...Data,
            [name]: value
        }
    ));
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}            
        >
            <div className="p-6">
                {role !== 'User' && (
                    <> 
                        <button
                            className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
                            onClick={() => openModal(1)}
                            > Crear Ingreso/gasto 
                        </button>
                    </>
                )}
                <Link
                    href="/mimenu"
                    className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                    > Regreso
                </Link>   
                <span className='bg-blue-100'> INGRESOS Y GASTOS </span> 
                <span className='bg-blue-100 px-12 text-center'>  SALDO : {parseFloat(sociedad[0].sdd_saldo).toLocaleString('es-CO')} </span>
                <button
                    onClick={() => enDesarrollo('C')}
                    className="bg-cyan-500 text-white px-4 py-1 mx-4 rounded mb-4"
                    > Cierre parcial
                </button> 
                <button
                    onClick={() => recalculo() }
                    className="bg-violet-500 text-white px-4 py-1 mx-4 rounded mb-4"
                    > Recálculo de saldo
                </button> 
                <div className="bg-white grid v-screen place-items-center py-1">
                    <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                            <tr key={0} className='bg-gray-100'>
                                <th className='px-2 py-1'>#</th>
                                <th className='px-2 py-1'>TIPO</th>
                                <th className='px-2 py-1'>NRO</th>
                                <th className='px-2 py-1'>FECHA</th>
                                <th className='px-2 py-1'>NR DOC</th>
                                <th className='px-2 py-1'>TERCERO</th>
                                <th className='px-2 py-1'>CONCEPTO</th>                               
                                <th className='px-2 py-1'>DETALLE</th>
                                <th className='px-2 py-1'>DEBITO</th>
                                <th className='px-2 py-1'>CREDITO</th>
                                <th className='px-2 py-1' colSpan={3}>COMANDOS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {props.ingregastos.data.map((ingregasto) => (
                                <tr key={ingregasto.id}>
                                    <td className='border border-gray-400 px-2 py-1'>{ingregasto.id}</td>
                                    <td className='border border-gray-400 px-2 py-1'>
                                        {tipoIga[ingregasto.iga_tipo] || 'Desconocido'}
                                    </td>
                                    <td className='border border-gray-400 px-2 py-1'>{ingregasto.iga_numero}</td>
                                    <td className='border border-gray-400 px-2 py-1'>{ingregasto.iga_Fecha}</td>
                                      <td className='border border-gray-400 px-2 py-1'>{ingregasto.iga_Documento}</td> 
                                    <td className='border border-gray-400 px-2 py-1'>{ingregasto.soc_nombre}</td>
                                    <td className='border border-gray-400 px-2 py-1'>{ingregasto.con_descripcion}</td>                                    
                                    <td className='border border-gray-400 px-2 py-1'>{ingregasto.iga_detalle}</td>
                                    <td className='border border-gray-400 px-2 py-1 text-right'>{parseFloat(ingregasto.iga_debito).toLocaleString('es-CO')}</td> 
                                    <td className='border border-gray-400 px-2 py-1 text-right'>{parseFloat(ingregasto.iga_credito).toLocaleString('es-CO')}</td>
                                    
                                    {role !== 'User' && (
                                                <> {/* <-- Fragmento  para agrupar los td */}
                                            <td className='border border-gray-400 px-2 py-1'>
                                                <button
                                                className="bg-yellow-500 hover:bg-orange-500 text-white px-2 py-1 rounded"
                                                onClick={() => {
                                                    setData(ingregasto); // Precarga los datos en el formulario
                                                    setTimeout(() => openModal(0), 0);                                         
                                                }}
                                                >
                                                Editar
                                                </button>
                                            </td>
                                            
                                       
                                            <td className='border border-gray-400 px-2 py-1'>
                                                { ingregasto.iga_anticipo === 'N' && ingregasto.iga_tipo !== 'A' ? (   
                                                    <button className='bg-cyan-500 hover:bg-blue-500 text-white font-bold py-1 px-1 rounded'
                                                    onClick={() => imprimir(ingregasto.id,ingregasto.iga_tipo, ingregasto.iga_numero, ingregasto.iga_socio_id, ingregasto.iga_anticipo)}>   
                                                    Imprimir
                                                    </button>
                                                ) : null}
                                            </td>
                                        
                                            <td className='border border-gray-400 px-2 py-1'>
                                                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                                onClick={() => eliminar(ingregasto.id,ingregasto.iga_tipo, ingregasto.iga_numero, ingregasto.iga_detalle, ingregasto.iga_procesado)}>   
                                                Eliminar
                                                </button>
                                            </td>
                                            </>
                                        )}                           
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination class="mt-6" links={props.ingregastos.links} />
                </div>

                <Modal show={modal} onClose={closeModal}>
                    <h2 className="p-3 text-lg font-medium text-gray-900">
                        {title} 
                    </h2>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                        <form onSubmit={save}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
                                <MiLista Id="iga_tipo"  Label="Tipo"  data ={data.iga_tipo} 
                                options = {tipoIgaOptions} OnChange={handleChange} required={true}></MiLista>
                                                            
                                <br />  

                                <MiInput  Id="iga_Fecha" Type="date" Label="Fecha" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.iga_Fecha} required={true}  
                                OnChange = {handleChange} ></MiInput>
            
                                <MiInput  Id="iga_Documento" Type="text" Label="Documento soporte" onChange={handleChange}
                                classNameI="" maxLength ="50" data ={data.iga_Documento} required={false}  
                                OnChange = {handleChange} ></MiInput>

                                <MiSelectDinamico 
                                    Id="iga_concepto_id"  Label="Concepto"  data ={data.iga_concepto_id}
                                    listas = {conceptosFiltrados} OnChange={handleChange} required={false}>
                                </MiSelectDinamico>

                                <MiSelectDinamico 
                                    Id="iga_socio_id"  Label="Tercero"  data ={data.iga_socio_id}
                                    listas = {socios} OnChange={handleChange} required={false}>
                                </MiSelectDinamico>                                

                                <MiInput  Id="iga_detalle" Type="text" Label="Descripción" onChange={handleChange}
                                classNameI="md:col-span-2" maxLength ="150" data ={data.iga_detalle} required={true}
                                OnChange = {handleChange} ></MiInput>

                                {data.iga_tipo === 'I' || data.iga_tipo === 'A'  ? (
                                    <>
                                        <MiInput  Id="iga_debito" Type="text" Label="Ingreso, Ajuste o saldo DB" onChange={handleChange}
                                        classNameI="" maxLength ="20" data ={data.iga_debito} required={false}  
                                        OnChange = {handleChange} ></MiInput>
                                    </>
                                    ) : null}
    

                                {data.iga_tipo === 'G' || data.iga_tipo === 'A'   ? (
                                    <>
                                        <MiInput  Id="iga_credito" Type="text" Label="Gastos, Ajuste o Sado CR" onChange={handleChange}
                                        classNameI="" maxLength ="20" data ={data.iga_credito} required={false}  
                                        OnChange = {handleChange} ></MiInput>
                                    </>
                                    ) : null}
    
                                <div className="flex justify-end">
                                    <button type="button"
                                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded'
                                        onClick={() => setModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button processing={processing} 
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold mx-3 py-1 px-1 rounded'>
                                            Guardar
                                    </button>
                                </div>
                            </div>                      
                        </form>
                    </div>
                </Modal>    
            </div>
        </AuthenticatedLayout>
       
    );
}