import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import Pagination from '@/Components//Pagination';
import react, {useState, useEffect } from 'react';
import { Head ,useForm, usePage, router, Link} from '@inertiajs/react';

import MiSelectDinamico from '@/Components/MiSelectDinamico';

export default function Index({ auth, socios: sociosList, cuentas: initialCuentas, 
    socioSeleccionado: initialSocio, saldo: saldos, filters }) {



    const { props } = usePage();

    const [selectedSocioId, setSelectedSocioId] = useState(props.filters?.socio_id || '');

    const cuentas = props.cuentas || initialCuentas;

    const socioSeleccionado = props.socioSeleccionado || initialSocio;

    const saldo = props.saldo || saldos;

    const user = usePage().props.auth.user;
 
    const [socios, setSocios] = useState(props.socios);

   const xsaldos = [
        { cxc_concepto_id: 0, con_descripcion: 'Concepto 1', total_saldo: 560030}, 
        { cxc_concepto_id: 3, con_descripcion: 'Concepto 2', total_saldo: 45000},
        { cxc_concepto_id: 5, con_descripcion: 'Concepto 3', total_saldo: 9000},
    ];

   // saldo = xsaldo;

    useEffect(() => {
        setSelectedSocioId(props.filters?.socio_id || '');
    }, [props.filters]);

    const { data,setData,delete:destroy,post,put,
    processing,reset,errors} = useForm({        
        id:'',
        soc_sociedad_id:user.sociedad_id,
        soc_tiposocio: '',
        soc_nombre: '',
        soc_direccion: '',
        soc_ciudad: '',
        soc_telefono: '',
        soc_email: '',
        soc_tipodoc: '',
        soc_nrodoc: '',
        soc_estado: '',    
    });
         

    const [role, setRole] = useState(user.role) 

    const handleBuscaPago = (id) =>{
        if (id === '') {
            return;
        }
        Inertia.post(`/pagoCual/${id}`);
    };
    
    const handleSocioChange = (e) => {
        const socioId = e.target.value;
        setSelectedSocioId(socioId); // Actualiza el estado local del select

        if (socioId) {
            // Usamos router.visit (o Inertia.visit) con el método POST
            // y las opciones para partial reload.
            // La URL debe ser la que definiste en tus rutas de Laravel.
            router.visit(route('pago.showCuales', socioId), { // Asume que tienes configurado ziggy para 'route()'
                                                             // o usa `/pagoCual/${socioId}` directamente
                method: 'post', // La ruta es POST
                preserveState: true, // Mantiene el estado del componente (ej. otros campos de formulario)
                preserveScroll: true, // Mantiene la posición del scroll
                only: ['cuentas', 'socioSeleccionado', 'filters'], // Solo estas props se actualizarán
                onSuccess: page => {
                    // Opcional: Algo que hacer después de una carga exitosa
                    // Las props 'cuentas' y 'socioSeleccionado' ya se habrán actualizado
                    // en 'props' de usePage() y por ende en las variables 'cuentas' y 'socioSeleccionado'
                    console.log('Cuentas cargadas:', page.props.cuentas);
                },
                onError: errors => {
                    console.error('Error al buscar pagos:', errors);
                }
            });
        } else {
            // Si se deselecciona, podrías limpiar la tabla o recargar la vista sin filtro
            router.visit(route('pago.index'), { // Asumiendo que 'pago.index' es la ruta de esta página
                preserveState: true,
                preserveScroll: true,
                only: ['cuentas', 'socioSeleccionado', 'filters'],
            });
        }
    };

//  Métodos de la vista


    function handleChange(e) {
        const { name, value } = e.target;
        setData((Data) => ({
            ...Data,
            [name]: value,
        }));
    }

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
    
    function inicial(){
        if(socioSeleccionado !== null){
            let suma=0;
            if (cuentas.data.length > 0){
               
              for (var i = 0; i < cuentas.length; i++)
              {
                suma += cuentas.data[i].cxc_saldo;
                }
            return (suma);
            };
        }
    }

    // alert(inicial());

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}            
        >
            <Head title="Registro de Pagos" />
            
            <div className="p-6">

               <Link
                  href="/mimenu"
                  className="bg-green-500 text-white px-4 py-1 mx-4 rounded mb-4"
                  > Regreso
              </Link>
            <span className='bg-blue-100'>PAGO CUENTAS POR COBRAR :</span> 
            <div className="bg-blue-100 grid v-screen place-items-center py-1">
                <div>
                <MiSelectDinamico 
                    Id="id"  Label="Socio" data ={data.id} onClick={handleBuscaPago(data.id)}
                    listas = {sociosList} OnChange={handleSocioChange} required={true}>
                </MiSelectDinamico> 
                </div>
                {socioSeleccionado && (
                    <div className="grid grid-flow-col grid-cols-4 gap-4">             
                        <div >
                            <span>Cuentas por pagar de: <strong> {socioSeleccionado.soc_nombre}</strong> {saldo[0]}</span>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <tr>
                                <th>Concepto</th>
                                <th>saldo actual</th>
                                <th>pago</th>
                            </tr>
                        </table>
                        <tbody className="bg-white divide-y divide-gray-200">

                                {xsaldos.map((xsaldo) => (
                                    <tr key={xsaldos.cxc_concepto_id}>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{xsaldo.con_descripcion}</td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{xsaldo.total_saldo}</td>
                                   </tr>
                                ))}


                        </tbody>

                        <div> 
                            <button
                                href="/mimenu"
                                className="bg-blue-500 text-white px-4 py-1 mx-4 rounded mb-4"
                                > Aplicar pago
                            </button>
                        </div>

                    </div>
                )}

                {/* Tabla para mostrar las cuentas */}
                {cuentas && cuentas.data && cuentas.data.length > 0 ? (
                    <div className="mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cuentas.data.map((cuenta) => (
                                    <tr key={cuenta.id}>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{cuenta.id}</td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{cuenta.con_titulo}</td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{cuenta.con_descripcion}</td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(cuenta.cxc_fecha).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{parseFloat(cuenta.cxc_valor).toFixed(2)}</td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{parseFloat(cuenta.cxc_saldo).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Paginación para las cuentas */}
                        {cuentas.links && <Pagination links={cuentas.links} />}
                    </div>
                ) : (
                    selectedSocioId && cuentas && <p className="mt-4">No hay cuentas por pagar para el socio seleccionado.</p>
                )}
                {!selectedSocioId && <p className="mt-4">Seleccione un socio para ver sus cuentas.</p>}
            </div>
                </div>
            
        {/* </AuthenticatedLayout> */}
 
        </AuthenticatedLayout>
    );
}
