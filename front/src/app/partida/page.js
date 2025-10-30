'use client' 
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import Image from 'next/image';
import PopUp from "@/components/PopUp";
import styles from "@/app/partida/page.module.css"
import Button from "@/components/Boton";

const coordenadasUtilizadas = [] // aca se van pushenado las cordenadas usadas x todoslos barcos de tu tablero
const destructor1 = 2;
const destructor2 = 2;
const crucero = 3;
const acorazado = 4;
const portaAviones = 5;
const coordDestructor1 = []
const coordDestructor2 = []
const coordCrucero = []
const coordAcorazado = []
const coordPortaAviones = [] //aca se pushean las coordeanadas cuandop ubicas tus barcos
//se comparan entre el length de los barcos y el array de las
//coordenadas, para saber cuando termine de seleccionar los 
//casilleros de un barco y asi aparece la imagen en pantalla 
const barcosInfo = [
    { nombre: 'destructor1', largo: 2, img: '/imagenes/destructorV.png', imgH: '/imagenes/destructorH.png', id: 0 },
    { nombre: 'destructor2', largo: 2, img: '/imagenes/destructorV.png', imgH: '/imagenes/destructorH.png', id: 1 },
    { nombre: 'crucero', largo: 3, img: '/imagenes/cruceroV.png', imgH: '/imagenes/cruceroH.png', id: 2 },
    { nombre: 'acorazado', largo: 4, img: '/imagenes/acorazadoV.png', imgH: '/imagenes/acorazadoH.png', id: 3 },
    { nombre: 'portaAviones', largo: 5, img: '/imagenes/portaAvionesV.png', imgH: '/imagenes/portaAvionesH.png', id: 4 }
];

const matriz = [
    ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"],
    ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"],
    ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10"],
    ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10"],
    ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10"],
    ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9", "I10"],
    ["J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10"]
];

export default function pagina() {
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
    const [barcosContrincante, setBarcosContrincante] = useState(null);
    const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState([]);
    const [primerCasilla, setPrimerCasilla] = useState(null);
    const [confirmado, setConfirmado] = useState(false); 
    const esJugador1 = Number(idLogged) === Number(id1);
    const [miTurno, setMiTurno] = useState(id1);
    const primerTurno = Number(idLogged) === Number(id1);
    let mensajeAtaca = ""

    function obtenerCasilla(e) {
        const id = e.target.id;
        if (coordenadasSeleccionadas.length == 0) {
            setPrimerCasilla(id)
        }
        setCoordenadasSeleccionadas(prev => [...prev, id]); // Agrega nuevas coordenadas al arreglo
        // hacer algo con el id
    }

    function detectarOrientacion(casillas) {
        if (casillas.length <= 1) return 'horizontal'; // Por defecto

        const coords = casillas.map(c => ({
            letra: c.charCodeAt(0),
            numero: parseInt(c.slice(1))
        }));

        // Verificar si todas tienen la misma letra (horizontal)
        const mismaFila = coords.every(c => c.letra === coords[0].letra);
        if (mismaFila) return 'horizontal';

        // Verificar si todas tienen el mismo número (vertical)
        const mismaColumna = coords.every(c => c.numero === coords[0].numero);
        if (mismaColumna) return 'vertical';

        // Si no son ni horizontal ni vertical, retornar null (inválido)
        return null;
    }

    useEffect(() => {
        
    })
    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", idPartida, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: idPartida,
            userId: Number(idLogged)
        });
        socket.on("recibir_barcos", data => {
            if (data.emisor != idLogged) {
                console.log("Barcos recibidos de ", data.emisor, ": ", data.barcos);
                setBarcosContrincante(data.barcos);
            }
        });
        socket.on("aceptar_turno", data => {
            console.log("ñañañañañañañañ")
            if (data.receptor == Number(idLogged)) {
                setMiTurno(data.receptor)
                console.log("Es mi turno")
            }
        })

    })
    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;
        //cambiar de turno cada vez que hace disparo 
        if (idLogged == id2) {
            socket.emit("cambiar_turno", {
                receptor: id1,
                emisor: idLogged,
                room: idPartida
            })
            console.log("Ya no es mi turno, es de: ", id1)
            setMiTurno(id1)
        } else if (idLogged == id1) {
            socket.emit("cambiar_turno", {
                receptor: id2,
                emisor: idLogged,
                room: idPartida
            })
            console.log("Ya no es mi turno, es de: ", id2)
            setMiTurno(id2)
        }

    }, [selectedCasillaEnemy])
    useEffect(() => {
        console.log(coordenadasSeleccionadas);
        console.log("primer casilla: ", primerCasilla);
        console.log("Barco: ", selectedBarco);

        if (selectedBarco && coordenadasSeleccionadas.length === selectedBarco.largo) {
            // Detectar orientación automáticamente
            const orientacionDetectada = detectarOrientacion(coordenadasSeleccionadas);

            if (!orientacionDetectada) {
                alert("Las casillas deben ser contiguas en línea recta (horizontal o vertical)");
                setCoordenadasSeleccionadas([]);
                setPrimerCasilla(null);
                return;
            }

            // Validar que las casillas sean contiguas
            const sonContiguas = validarCasillasContiguas(coordenadasSeleccionadas, orientacionDetectada);

            if (!sonContiguas) {
                alert("Las casillas deben ser consecutivas sin espacios");
                setCoordenadasSeleccionadas([]);
                setPrimerCasilla(null);
                return;
            }
            // Encontrar el botón de la primera casilla
            const primerBoton = document.getElementById(primerCasilla);
            if (primerBoton) {
                // Obtener el div contenedor (casillero) del botón
                const primerCasillero = primerBoton.parentElement;

                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'absolute';
                imgContainer.style.top = '0';
                imgContainer.style.left = '0';
                imgContainer.style.zIndex = '10';
                imgContainer.style.pointerEvents = 'none';

                // Calcular el tamaño según orientación DETECTADA
                if (orientacionDetectada === 'horizontal') {
                    imgContainer.style.width = `calc(${selectedBarco.largo} * 100%)`;
                    imgContainer.style.height = '100%';
                } else {
                    imgContainer.style.width = '100%';
                    imgContainer.style.height = `calc(${selectedBarco.largo} * 100%)`;
                }

                // Crear y agregar la imagen según orientación DETECTADA
                const img = document.createElement('img');
                img.src = orientacionDetectada === 'horizontal' ? selectedBarco.imgH : selectedBarco.img;
                img.alt = selectedBarco.nombre;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'fill';

                imgContainer.appendChild(img);

                // Agregar posición relativa al casillero para que funcione el absolute
                primerCasillero.style.position = 'relative';
                primerCasillero.appendChild(imgContainer);

                // Deshabilitar los botones usados y marcarlos visualmente
                coordenadasSeleccionadas.forEach(coord => {
                    const btn = document.getElementById(coord);
                    if (btn) {
                        btn.disabled = true;
                        btn.style.backgroundColor = 'rgba(0, 100, 200, 0.2)';
                    }
                });
            }

            // Guardar el barco colocado
            setBarcosColocados(prev => [...prev, {
                barco: selectedBarco,
                coordenadas: [...coordenadasSeleccionadas],
                primeraCasilla: primerCasilla,
                orientacion: orientacionDetectada,
                coordenadas: coordenadasSeleccionadas
            }]);
            // Resetear para el siguiente barco
            setCoordenadasSeleccionadas([]);
            setPrimerCasilla(null);
            setSelectedBarco(null);
            setSelectedBarcoId(null);

            console.log("Barco colocado en orientación:", orientacionDetectada);
        }
    }, [coordenadasSeleccionadas, selectedBarco, primerCasilla]);


    useEffect(() => {
        for (let i = 0; i < barcosInfo.length; i++) {
            if (barcosInfo[i].id == selectedBarcoId) {
                setSelectedBarco(barcosInfo[i])
            }
        }

    }, [selectedBarcoId])

    function obtenerCasillaEnemy(e) {
        if (miTurno == idLogged) {
            const id = e.target.id;
            setSelectedCasillaEnemy(id)
            console.log(id, " enemigo"); // A1-enemy, B2-enemy, etc.
        }

        // hacer algo con el id
    }

    function verSelectedBarco() {

    }
    function validarCasillasContiguas(casillas, orientacion) {
        if (casillas.length <= 1) return true;

        // Extraer letra y número de cada casilla
        const coords = casillas.map(c => ({
            letra: c.charCodeAt(0),
            numero: parseInt(c.slice(1))
        }));

        if (orientacion === 'horizontal') {
            // Verificar misma fila y números consecutivos
            const mismaFila = coords.every(c => c.letra === coords[0].letra);
            const numerosOrdenados = coords.map(c => c.numero).sort((a, b) => a - b);
            const consecutivos = numerosOrdenados.every((num, i) =>
                i === 0 || num === numerosOrdenados[i - 1] + 1
            );
            return mismaFila && consecutivos;
        } else {
            // Verificar misma columna y letras consecutivas
            const mismaColumna = coords.every(c => c.numero === coords[0].numero);
            const letrasOrdenadas = coords.map(c => c.letra).sort((a, b) => a - b);
            const consecutivas = letrasOrdenadas.every((letra, i) =>
                i === 0 || letra === letrasOrdenadas[i - 1] + 1
            );
            return mismaColumna && consecutivas;
        }
    }

    async function confirmar() {
        if (barcosColocados.length != 5) {
            alert("Poné los 5 barcos primero");
            return;
        }

        const body = {
            id_partida: idPartida,
            id_jugador: idLogged,
            barcos: barcosColocados.map(barco => ({
                longitud: barco.barco.largo,
                impactos: 0,
                coordenadas: barco.coordenadas
            }))
        };

        try {
            const res = await fetch("http://localhost:4000/agregarBarco", {
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
            jugador2: esJugador1 ? Number(id2) : Number(id1),
            barcos: barcosColocados,
            jugador1: Number(idLogged)
        });
    }

    let mensajeHeader = "Ubicá tus barcos, seleccionando un barco y luego las casillas"; 
    if (barcosColocados.length == 5 && !confirmado) {
        mensajeHeader = "No te olvides de apretar Confirmar";
    }
    if (confirmado) {
        mensajeHeader = "¡A jugar!";
    }
    if (miTurno == idLogged) {
        mensajeAtaca = "¡Tu turno!"
    }else{
        mensajeAtaca = "Turno Rival"
    }

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

                    </div>
                    <div className={styles.tablero}>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="A1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="B1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="C1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="D1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="E1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="F1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="G1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="H1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="I1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="J1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
