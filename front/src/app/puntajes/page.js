"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/puntajes/page.module.css";
import { useConnection } from "../hooks/useConnection";

export default function Puntajes() {
    const [puntajes, setPuntajes] = useState([]);
    const router = useRouter();
    const { url } = useConnection();

    useEffect(() => {
        traerPuntajes();
    }, []);

    async function traerPuntajes() {
        try {
            const response = await fetch(url + "/traerPuntajes", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log(data);

            if (data.res) {
                setPuntajes(data.message);
            } else {
                alert("No se encontraron puntajes");
            }
        } catch (error) {
            console.error("Error en /traerPuntajes:", error);
            alert("Error al conectar con el servidor");
        }
    }

    const irAOtraPagina = () => {
        router.push("/bienvenida");
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.encabezado}>
                <h1 className={styles.tituloEncabezado}>RANKING BATALLA ESPONJOSA</h1>
            </div>

            <div className={styles.seccionPodio}>
                <div className={styles.contenedorPodio}>
                    {puntajes[1] && (
                        <div className={`${styles.tarjetaPodio} ${styles.segundoLugar}`}>
                            <div className={styles.numeroPosicion}>2</div>
                            <div className={styles.contenedorImagenJugador}>
                                <img src="/imagenes/segundoLugar.jpg" alt={puntajes[1].usuario} className={styles.imagenJugador} />
                            </div>
                            <div className={styles.infoJugador}>
                                <div className={styles.nombreJugador}>{puntajes[1].usuario}</div>
                                <div className={styles.puntosJugador}>
                                    <span className={styles.numeroPuntos}>{puntajes[1].partidas_ganadas}</span>
                                    <span className={styles.etiquetaPuntos}>PTS</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {puntajes[0] && (
                        <div className={`${styles.tarjetaPodio} ${styles.primerLugar}`}>
                            <div className={styles.numeroPosicion}>1</div>
                            <div className={styles.contenedorImagenJugador}>
                                <img src="/imagenes/primerLugar.avif" alt={puntajes[0].usuario} className={styles.imagenJugador} />
                            </div>
                            <div className={styles.infoJugador}>
                                <div className={styles.nombreJugador}>{puntajes[0].usuario}</div>
                                <div className={styles.puntosJugador}>
                                    <span className={styles.numeroPuntos}>{puntajes[0].partidas_ganadas}</span>
                                    <span className={styles.etiquetaPuntos}>PTS</span>
                                </div>
                            </div>
                            <div className={styles.corona}>👑</div>
                        </div>
                    )}

                    {puntajes[2] && (
                        <div className={`${styles.tarjetaPodio} ${styles.tercerLugar}`}>
                            <div className={styles.numeroPosicion}>3</div>
                            <div className={styles.contenedorImagenJugador}>
                                <img src="/imagenes/tercerLugar.jpg" alt={puntajes[2].usuario} className={styles.imagenJugador} />
                            </div>
                            <div className={styles.infoJugador}>
                                <div className={styles.nombreJugador}>{puntajes[2].usuario}</div>
                                <div className={styles.puntosJugador}>
                                    <span className={styles.numeroPuntos}>{puntajes[2].partidas_ganadas}</span>
                                    <span className={styles.etiquetaPuntos}>PTS</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {puntajes.length > 3 && (
                <div className={styles.seccionRanking}>
                    <h2 className={styles.tituloRanking}>CLASIFICACIÓN COMPLETA</h2>
                    <div className={styles.listaRanking}>
                        {puntajes.slice(3).map((puntaje, index) => (
                            <div key={puntaje.id_ganador} className={styles.itemRanking}>
                                <div className={styles.posicionRanking}>{index + 4}</div>
                                <div className={styles.nombreRanking}>{puntaje.usuario}</div>
                                <div className={styles.puntosRanking}>
                                    <span className={styles.numeroPuntosRanking}>{puntaje.partidas_ganadas}</span>
                                    <span className={styles.etiquetaPuntosRanking}>PTS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.contenedorBoton}>
                <button onClick={irAOtraPagina} className={styles.boton}>
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
}