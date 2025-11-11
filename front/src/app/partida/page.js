'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import Image from 'next/image';
import PopUp from "@/components/PopUp";
import styles from "@/app/partida/page.module.css"
import Button from "@/components/Boton";
import { useConnection } from "../hooks/useConnection";

const coordenadasUtilizadas = []
const destructor1 = 2;
const destructor2 = 2;
const crucero = 3;
const acorazado = 4;
const portaAviones = 5;
const coordDestructor1 = []
const coordDestructor2 = []
const coordCrucero = []
const coordAcorazado = []
const coordPortaAviones = []
const barcosInfo = [
    { nombre: 'destructor1', largo: 2, img: '/imagenes/destructorV.png', imgH: '/imagenes/destructorH.png', id: 0 },
    { nombre: 'destructor2', largo: 2, img: '/imagenes/destructorV.png', imgH: '/imagenes/destructorH.png', id: 1 },
    { nombre: 'crucero', largo: 3, img: '/imagenes/cruceroV.png', imgH: '/imagenes/cruceroH.png', id: 2 },
    { nombre: 'acorazado', largo: 4, img: '/imagenes/acorazadoV.png', imgH: '/imagenes/acorazadoH.png', id: 3 },
    { nombre: 'portaAviones', largo: 5, img: '/imagenes/portaAvionesV.png', imgH: '/imagenes/portaAvionesH.png', id: 4 }
];

export default function pagina() {
    const { url } = useConnection();
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();
    const nombre1 = searchParams.get("jugador1Nombre");
    const nombre2 = searchParams.get("jugador2Nombre");
    const id1 = searchParams.get("jugador1Id");
    const id2 = searchParams.get("jugador2Id");
    const img1 = searchParams.get("img1");
    const img2 = searchParams.get("img2");
    const idPartida = searchParams.get("idPartida");
    const idLogged = searchParams.get("idLogged");
    const [selectedCasilla, setSelectedCasilla] = useState("");
    const [selectedCasillaEnemy, setSelectedCasillaEnemy] = useState("");
    const [selectedBarco, setSelectedBarco] = useState(null);
    const [selectedBarcoId, setSelectedBarcoId] = useState(null);
    const [barcosColocados, setBarcosColocados] = useState([]);
    const [barcosContrincante, setBarcosContrincante] = useState([]);
    const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState([]);
    const [primerCasilla, setPrimerCasilla] = useState(null);
    const [confirmado, setConfirmado] = useState(false);
    const [coordenadasContrincante, setCoordenadasContrincante] = useState([]);
    const esJugador1 = Number(idLogged) === Number(id1);
    const [miTurno, setMiTurno] = useState(Number(id1));
    const primerTurno = Number(idLogged) === Number(id1);
    const [casillasUsadas, setCasillasUsadas] = useState([]);
    const [partidaIniciada, setPartidaIniciada] = useState(false);
    const [disparosRecibidos, setDisparosRecibidos] = useState(0);
    const [barcosListos, setBarcosListos] = useState(1);
    const [barcosListosContrincante, setBarcosListosContricante] = useState(1);
    const [partidaTerminada, setPartidaTerminada] = useState(1);
    let mensajeAtaca = "";



    function obtenerCasilla(e) {
        const id = e.target.id;
        if (coordenadasSeleccionadas.length == 0) {
            setPrimerCasilla(id)
        }
        setCoordenadasSeleccionadas(prev => [...prev, id]);
        //setCasillasUsadas(prev => [...prev, id]);
    }
    //orientacion
    function detectarOrientacion(casillas) {
        if (casillas.length <= 1) return 'horizontal';

        const coords = casillas.map(c => ({
            letra: c.charCodeAt(0),
            numero: parseInt(c.slice(1))
        }));

        const mismaFila = coords.every(c => c.letra === coords[0].letra);
        if (mismaFila) return 'horizontal';

        const mismaColumna = coords.every(c => c.numero === coords[0].numero);
        if (mismaColumna) return 'vertical';

        return null;
    }
    //iniciar partida
    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        const handlePartidaIniciada = (data) => {
            if (data.idPartida == idPartida) {
                setPartidaIniciada(true)
            }
        };

        socket.on("partida_iniciada", handlePartidaIniciada);

        return () => {
            socket.off("partida_iniciada", handlePartidaIniciada);
        };
    }, [socket, isConnected, idLogged, idPartida])
    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        const handleRecibirDisparo = (data) => {
            console.log("📨 Disparo recibido:", data);

            if (data.receptor == Number(idLogged)) {
                const mensaje = data.impactado
                    ? `¡Te impactaron en ${data.casilla}!`
                    : `Fallaron en ${data.casilla} (agua)`;
                alert(mensaje);

                /*const btn = document.getElementById(data.casilla);
                if (btn) {
                    btn.style.backgroundColor = data.impactado ? 'red' : 'blue';
                    btn.disabled = true;
                }*/
                const btn = document.getElementById(data.casilla);
                if (btn) {
                    const cell = btn.parentElement;
                    cell.style.backgroundColor = data.impactado ? 'red' : 'blue';
                    btn.disabled = true;
                }


            }

            if (data.emisor == Number(idLogged)) {
                /*const btnEnemy = document.getElementById(`e-${data.casilla}`);
                if (btnEnemy) {
                    btnEnemy.style.backgroundColor = data.impactado ? 'red' : 'blue';
                    btnEnemy.disabled = true;
                }*/
                const btnEnemy = document.getElementById(`e-${data.casilla}`);
                if (btnEnemy) {
                    const cellEnemy = btnEnemy.parentElement;
                    cellEnemy.style.backgroundColor = data.impactado ? 'red' : 'blue';
                    btnEnemy.disabled = true;
                }


            }


        };

        socket.on("recibir_disparo", handleRecibirDisparo);
        setDisparosRecibidos(prev => prev + 1)
        chequearDisparos();
        finalizarPartida();
        return () => {
            socket.off("recibir_disparo", handleRecibirDisparo);
        };
    }, [socket, isConnected, idLogged]);

    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;
        socket.on("recibir_listo", data => {
            if (idLogged != data.idJugador) {
                setBarcosListosContricante(data.listo)
            }
        }
        )
    }, [socket, isConnected, idLogged])
    //turnos
    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", idPartida, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: idPartida,
            userId: Number(idLogged)
        });
        /*socket.on("recibir_barcos", data => {
            if (data.emisor != idLogged) {
                console.log("Barcos recibidos de ", data.emisor, ": ", data.barcos);
                setBarcosContrincante(data.barcos);
            }
        });*/
        socket.on("aceptar_turno", data => {
            if (data.receptor == Number(idLogged)) {

                setMiTurno(data.receptor)
                console.log("Es mi turno")
                //chequearDisparos();
                //finalizarPartida();
            }
        })

    }, [socket, isConnected, idLogged, idPartida])
    //casillas
    /*useEffect(() => {
        console.log(coordenadasSeleccionadas);
        console.log("primer casilla: ", primerCasilla);
        console.log("Barco: ", selectedBarco);

        if (selectedBarco && coordenadasSeleccionadas.length === selectedBarco.largo) {
            const orientacionDetectada = detectarOrientacion(coordenadasSeleccionadas);

            if (!orientacionDetectada) {
                alert("Las casillas deben ser contiguas en línea recta (horizontal o vertical)");
                setCoordenadasSeleccionadas([]);
                setPrimerCasilla(null);
                return;
            }

            const sonContiguas = validarCasillasContiguas(coordenadasSeleccionadas, orientacionDetectada);

            if (!sonContiguas) {
                alert("Las casillas deben ser consecutivas sin espacios");
                setCoordenadasSeleccionadas([]);
                setPrimerCasilla(null);
                return;
            }
            const primerBoton = document.getElementById(primerCasilla);
            if (primerBoton) {
                const primerCasillero = primerBoton.parentElement;

                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'absolute';
                imgContainer.style.top = '0';
                imgContainer.style.left = '0';
                imgContainer.style.zIndex = '10';
                imgContainer.style.pointerEvents = 'none';

                if (orientacionDetectada === 'horizontal') {
                    imgContainer.style.width = `calc(${selectedBarco.largo} * 100%)`;
                    imgContainer.style.height = '100%';
                } else {
                    imgContainer.style.width = '100%';
                    imgContainer.style.height = `calc(${selectedBarco.largo} * 100%)`;
                }

                const img = document.createElement('img');
                img.src = orientacionDetectada === 'horizontal' ? selectedBarco.imgH : selectedBarco.img;
                img.alt = selectedBarco.nombre;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'fill';

                imgContainer.appendChild(img);

                primerCasillero.style.position = 'relative';
                primerCasillero.appendChild(imgContainer);

                coordenadasSeleccionadas.forEach(coord => {
                    const btn = document.getElementById(coord);
                    if (btn) {
                        btn.disabled = true;
                        btn.style.backgroundColor = 'rgba(0, 100, 200, 0.2)';
                    }
                });
            }

            setBarcosColocados(prev => [...prev, {
                barco: selectedBarco,
                coordenadas: [...coordenadasSeleccionadas],
                primeraCasilla: primerCasilla,
                orientacion: orientacionDetectada,
                coordenadas: coordenadasSeleccionadas
            }]);
            setCoordenadasSeleccionadas([]);
            setPrimerCasilla(null);
            setSelectedBarco(null);
            setSelectedBarcoId(null);

            console.log("Barco colocado en orientación:", orientacionDetectada);
        }
    }, [coordenadasSeleccionadas, selectedBarco, primerCasilla]);*/
    useEffect(() => {
        console.log(coordenadasSeleccionadas);
        console.log("primer casilla: ", primerCasilla);
        console.log("Barco: ", selectedBarco);

        if (selectedBarco && coordenadasSeleccionadas.length === selectedBarco.largo) {
            const orientacionDetectada = detectarOrientacion(coordenadasSeleccionadas);

            if (selectedBarco && coordenadasSeleccionadas.length === selectedBarco.largo) {
                const orientacionDetectada = detectarOrientacion(coordenadasSeleccionadas);

                if (!orientacionDetectada) {
                    alert("Las casillas deben ser contiguas en línea recta (horizontal o vertical)");
                    // ✅ LIMPIAR estado visual de los botones seleccionados incorrectamente
                    coordenadasSeleccionadas.forEach(coord => {
                        const btn = document.getElementById(coord);
                        if (btn) {
                            btn.disabled = false;
                            btn.style.backgroundColor = '';
                        }
                    });
                    setCoordenadasSeleccionadas([]);
                    setPrimerCasilla(null);
                    return;
                }

                const sonContiguas = validarCasillasContiguas(coordenadasSeleccionadas, orientacionDetectada);

                if (!sonContiguas) {
                    alert("Las casillas deben ser consecutivas sin espacios");
                    // ✅ LIMPIAR estado visual de los botones seleccionados incorrectamente
                    coordenadasSeleccionadas.forEach(coord => {
                        const btn = document.getElementById(coord);
                        if (btn) {
                            btn.disabled = false;
                            btn.style.backgroundColor = '';
                        }
                    });
                    setCoordenadasSeleccionadas([]);
                    setPrimerCasilla(null);
                    return;
                }

                const primerBoton = document.getElementById(primerCasilla);
                if (primerBoton) {
                    const primerCasillero = primerBoton.parentElement;

                    const imgContainer = document.createElement('div');
                    imgContainer.style.position = 'absolute';
                    imgContainer.style.top = '0';
                    imgContainer.style.left = '0';
                    imgContainer.style.zIndex = '10';
                    imgContainer.style.pointerEvents = 'none';

                    if (orientacionDetectada === 'horizontal') {
                        imgContainer.style.width = `calc(${selectedBarco.largo} * 100%)`;
                        imgContainer.style.height = '100%';
                    } else {
                        imgContainer.style.width = '100%';
                        imgContainer.style.height = `calc(${selectedBarco.largo} * 100%)`;
                    }

                    const img = document.createElement('img');
                    img.src = orientacionDetectada === 'horizontal' ? selectedBarco.imgH : selectedBarco.img;
                    img.alt = selectedBarco.nombre;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'fill';

                    imgContainer.appendChild(img);

                    primerCasillero.style.position = 'relative';
                    primerCasillero.appendChild(imgContainer);

                    coordenadasSeleccionadas.forEach(coord => {
                        const btn = document.getElementById(coord);
                        if (btn) {
                            btn.disabled = true;
                            btn.style.backgroundColor = 'rgba(0, 100, 200, 0.2)';
                        }
                    });
                }

                // ✅ AGREGAR a casillasUsadas SOLO cuando el barco se colocó correctamente
                setCasillasUsadas(prev => [...prev, ...coordenadasSeleccionadas]);
                const coordsOrdenadas = [...coordenadasSeleccionadas].sort((a, b) => {
                    const letraA = a.charCodeAt(0);
                    const letraB = b.charCodeAt(0);
                    const numA = parseInt(a.slice(1));
                    const numB = parseInt(b.slice(1));

                    return letraA - letraB || numA - numB;
                });

                setBarcosColocados(prev => [...prev, {
                    barco: selectedBarco,
                    coordenadas: coordsOrdenadas, // solo esta
                    primeraCasilla: primerCasilla,
                    orientacion: orientacionDetectada
                }]);


                setCoordenadasSeleccionadas([]);
                setPrimerCasilla(null);
                setSelectedBarco(null);
                setSelectedBarcoId(null);

                console.log("Barco colocado en orientación:", orientacionDetectada);
            }
        }
    }, [coordenadasSeleccionadas, selectedBarco, primerCasilla]);

    //seleccionar barco
    useEffect(() => {
        for (let i = 0; i < barcosInfo.length; i++) {
            if (barcosInfo[i].id == selectedBarcoId) {
                setSelectedBarco(barcosInfo[i])
            }
        }

    }, [selectedBarcoId])
    //probando
    function verCoordenadas() {
        console.log(coordenadasContrincante)
    }
    //atacar
    async function obtenerCasillaEnemy(e) {
        if (partidaIniciada === false) {
            alert("Espera a que el otro jugador coloque sus barcos")
            return;

        }
        if (Number(miTurno) !== Number(idLogged)) {
            alert("No es tu turno perrito paciencia")
            return;
        }
        /*const id = e.target.id;
        setSelectedCasillaEnemy(id);
        socket.emit("enviar_disparo", {
            room: idPartida,
            emisor: idLogged,
            receptor: esJugador1 ? id2 : id1,
            casilla: id
        })*/
        //probando
        const id = e.target.id;    // ahora id = e-A1
        // pero enviás solo la coordenada real
        socket.emit("enviar_disparo", {
            room: idPartida,
            emisor: idLogged,
            receptor: esJugador1 ? id2 : id1,
            casilla: id.replace("e-", "")
        });
        let idBD = id.replace("e-", "")
        console.log(id, " enemigo");
        const data = {
            id_partida: idPartida,
            coordenada: idBD,
            id_jugador: idLogged,
        }
        try {
            const response = await fetch(url + "/disparo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (response.res == true) {
                console.log("disparado")
                //finalizarPartida();
            }
        } catch (error) {
            console.error("Error en /agregarBarco:", error);
            alert("Error al conectar con el servidor");
        }
        console.log("enviando barcos al contrincante");
        setTimeout(() => {
            const nuevoTurno = esJugador1 ? id2 : id1;

            socket.emit("cambiar_turno", {
                receptor: nuevoTurno,
                emisor: idLogged,
                room: idPartida
            });

            setMiTurno(Number(nuevoTurno));
            console.log("🔄 Turno cambiado a:", nuevoTurno);
        }, 500);

    }
    function validarCasillasContiguas(casillas, orientacion) {
        if (casillas.length <= 1) return true;

        const coords = casillas.map(c => ({
            letra: c.charCodeAt(0),
            numero: parseInt(c.slice(1))
        }));

        if (orientacion === 'horizontal') {
            const mismaFila = coords.every(c => c.letra === coords[0].letra);
            const numerosOrdenados = coords.map(c => c.numero).sort((a, b) => a - b);
            const consecutivos = numerosOrdenados.every((num, i) =>
                i === 0 || num === numerosOrdenados[i - 1] + 1
            );
            return mismaFila && consecutivos;
        } else {
            const mismaColumna = coords.every(c => c.numero === coords[0].numero);
            const letrasOrdenadas = coords.map(c => c.letra).sort((a, b) => a - b);
            const consecutivas = letrasOrdenadas.every((letra, i) =>
                i === 0 || letra === letrasOrdenadas[i - 1] + 1
            );
            return mismaColumna && consecutivas;
        }
    }
    //confirmar barcos colocados
    async function confirmar() {
        if (barcosColocados.length != 5) {
            alert("Poné los 5 barcos primero");
            return;
        }
        setBarcosListos(2);
        const body = {
            id_partida: idPartida,
            id_jugador: idLogged,
            barcos: barcosColocados.map(barco => ({
                longitud: barco.barco.largo,
                impactos: 0,
                coordenadas: barco.coordenadas.sort((a, b) => {
                    const letraA = a.charCodeAt(0);
                    const letraB = b.charCodeAt(0);
                    const numA = parseInt(a.slice(1));
                    const numB = parseInt(b.slice(1));
                    return letraA - letraB || numA - numB;
                })
            }))

        };

        try {
            const res = await fetch(url + "/agregarBarco", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            setConfirmado(true);
            alert("Barcos guardados con éxito");
        } catch (error) {
            console.error("Error en /agregarBarco:", error);
            alert("Error al conectar con el servidor");
        }
        console.log("enviando barcos al contrincante");
        socket.emit("enviar_barcos", {
            room: idPartida,
            jugador: idLogged,
            casillas: casillasUsadas,
            barcos: barcosColocados
        });
        socket.emit("barcos_listos", {
            room: idPartida,
            jugadorId: idLogged,
            esListo: 3,
        })
    }
    //mensajes encabezado
    let mensajeHeader = "Ubicá tus barcos, seleccionando un barco y luego las casillas";
    if (barcosColocados.length == 5 && !confirmado) {
        mensajeHeader = "No te olvides de apretar Confirmar";
    }
    if (confirmado) {
        mensajeHeader = "¡A jugar!";
    }
    if (miTurno == idLogged) {
        mensajeAtaca = "¡Tu turno!"
    } else {
        mensajeAtaca = "Turno Rival"
    }
    //ver barcos hundidos
    function chequearDisparos(texto) {
        console.log(texto)
        if (Number(id1) === Number(idLogged)) {
            console.log("CHEQUEAR DISPARO JUGADOR 1")

            async function probarImpactos1() {
                try {
                    let info = {
                        id_jugador: idLogged,
                        id_partida: idPartida
                    }
                    const response = await fetch(url + "/impactosJ1", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    });

                    const data = await response.json();
                    console.log("Respuesta de /impactos:", data);

                    if (data.res) {
                        console.log("Impactos obtenidos:", data.impactos);
                    } else {
                        console.log("Error al llamar /impactos:");
                        //alert("Error");
                    }
                } catch (error) {
                    console.log("Error al llamar /impactos:", error);
                    //alert("Error al conectar con el servidor");
                }
            }
            probarImpactos1();
        } else {

            console.log("CHEQUEAR DISPARO JUGADOR 2")

            async function probarImpactos2() {
                try {
                    let info = {
                        id_jugador: idLogged,
                        id_partida: idPartida
                    }
                    const response = await fetch(url + "/impactosJ2", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    });

                    const data = await response.json();
                    console.log("Respuesta de /impactos:", data);

                    if (data.res) {
                        console.log("Impactos obtenidos:", data.impactos);
                    } else {
                        //alert("Error");
                        console.log("Error al llamar /impactos:");
                    }
                } catch (error) {
                    console.log("Error al llamar /impactos:", error);
                    //alert("Error al conectar con el servidor");
                }
            }
            probarImpactos2();
        }

    }
    //partida termina bien
    async function finalizarPartida() {
        let info = {
            id1: id1,
            id2: id2,
            id_partida: idPartida
        }
        try {
            const response = await fetch(url + "/terminarPartida", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            })
            const data = await response.json();

            if (data.res) {
                alert("partida finalizada")
                setPartidaTerminada(2);
            }
        } catch (error) {
            console.log("error")
            alert("error")
        }
    }
    //terminar partida
    /*useEffect(() => {
        const finalizarPartida = async () => {
            if (!id1 || !id2 || !idPartida) return;

            const datos = {
                id_partida: idPartida,
                id1: id1,
                id2: id2
            };

            try {
                const response = await fetch(url + "/terminarPartida", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                });

                const data = await response.json();

                if (data.res) {
                    alert("La partida ha terminado correctamente.");
                } else {
                    alert("Hubo un error al finalizar la partida.");
                }
            } catch (error) {
                console.error("Error al finalizar la partida:", error);
                alert("Error en la conexión al servidor.");
            }
        };
        finalizarPartida();
    }, [idPartida, id1, id2]);*/

    return (
        <>
            <section className={styles.header}>
                <h1>
                    {mensajeHeader} - {mensajeAtaca}
                </h1>
                <br></br>
            </section>
            <section className={styles.juego}>
                {/* Tablero del jugador loggeado (izquierda) */}
                <div className={styles.tableroContainer}>

                    <div className={styles.encabezadoTablero}>
                        <img src={esJugador1 ? img1 : img2} className={styles.imgPerfil} alt="Mi avatar" />
                        <div className={styles.nombre}>
                            <h2>{esJugador1 ? nombre1 : nombre2}</h2>
                            <p>Mi tablero</p>
                        </div>
                        {barcosListos === 2 ? (<div className={styles.checkmark}>✓</div>) : (<div></div>)

                        }
                    </div>

                    <div className={styles.tablero}>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="A1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="B1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="C1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="D1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="E1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="F1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="G1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="H1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="I1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="J1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J10" onClick={obtenerCasilla}></button></div>
                        </div>
                    </div>
                </div>
                <div id="barcos" className={styles.barcosContainer}>
                    {barcosInfo.map((barco, index) => {
                        const barcoYaColocado = barcosColocados.some(b => b.barco.id === index);

                        return (
                            <button
                                className={`
                    ${selectedBarcoId === index ? styles.botonBarcoSeleccionado : styles.botonBarco}
                    ${barcoYaColocado ? styles.barcoUtilizado : ''}
                `}
                                key={index}
                                onClick={() => !barcoYaColocado && setSelectedBarcoId(index)}
                                disabled={barcoYaColocado}
                            >
                                <img
                                    src={barco.img}
                                    alt={`barco ${index}`}
                                />
                            </button>
                        );
                    })}
                    <button className={styles.botonConfirmar} onClick={confirmar}>Confirmar</button>
                </div>
                {/* Tablero del oponente (derecha) */}
                <div className={styles.tableroContainer}>
                    <div className={styles.encabezadoTablero}>
                        <img src={esJugador1 ? img2 : img1} className={styles.imgPerfil} alt="Avatar oponente" />
                        <div className={styles.nombre}>
                            <h2>{esJugador1 ? nombre2 : nombre1}</h2>
                            <p>Tablero enemigo</p>
                        </div>
                        {barcosListosContrincante === 3 ? (<div className={styles.checkmark}>✓</div>) : (<div></div>)

                        }

                    </div>
                    <div className={styles.tablero} id="tablero-enemigo">
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-A1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-A10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-B1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-B10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-C1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-C10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-D1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-D10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-E1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-E10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-F1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-F10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-G1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-G10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-H1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-H10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-I1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-I10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>

                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="e-J1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="e-J10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                    </div>

                </div>
                {partidaTerminada == 2 ? (
                    <>
                        <PopUp>
                            <div>Felicidades! Ganaste la partida!</div>
                        </PopUp>
                    </>
                ) : partidaTerminada == 3 ? (
                    <>
                        <PopUp>
                            <div>{idGanador} ganó la partida! Qué lástima! </div>
                        </PopUp>
                    </>

                ) : (null)}
            </section>
        </>
    )
}
