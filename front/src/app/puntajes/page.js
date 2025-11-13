"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/puntajes/page.module.css";
import { useConnection } from "../hooks/useConnection";

export default function Puntajes() {
    const [puntajes, setPuntajes] = useState([]);
    const router = useRouter();
    const { url } = useConnection();

    const irAOtraPagina = () => {
        router.back();
    };

    useEffect(() => {
        traer();
    }, []);

    async function traer() {
        try {
            const response = await fetch(url + "/traerPuntajes", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log(data);

            if (data.res) {
                console.log(data.message);
                setPuntajes(data.message);
            } else {
                alert("No se encontraron puntajes");
            }
        } catch (error) {
            console.error("Error en /traerPuntajes:", error);
            alert("Error al conectar con el servidor");
        }
    }

    return (
        <>
            <section className={styles.section1}>
                <h1>Historial de juegos:</h1>

                {/* Podio de los 3 primeros lugares */}
                <div className={styles.top3}>
                    {/* Primer lugar */}
                    <div className={`${styles.driver} ${styles.first}`}>
                        <div className={styles.driverImgContainer}>
                            <img
                                src="/imagenes/bichito.jpg"
                                alt="Lando Norris"
                                className={styles.driverImg}
                            />
                        </div>
                        <p className={styles.driverName}>Lando Norris</p>
                        <p className={styles.driverPoints}>25 PT</p>
                    </div>

                    {/* Segundo lugar */}
                    <div className={`${styles.driver} ${styles.second}`}>
                        <div className={styles.driverImgContainer}>
                            <img
                                src="/imagenes/bichito.jpg"
                                alt="Oscar Piastri"
                                className={styles.driverImg}
                            />
                        </div>
                        <p className={styles.driverName}>Oscar Piastri</p>
                        <p className={styles.driverPoints}>18 PT</p>
                    </div>

                    {/* Tercer lugar */}
                    <div className={`${styles.driver} ${styles.third}`}>
                        <div className={styles.driverImgContainer}>
                            <img
                                src="/imagenes/bichito.jpg"
                                alt="Nico Hulkenberg"
                                className={styles.driverImg}
                            />
                        </div>
                        <p className={styles.driverName}>Nico Hulkenberg</p>
                        <p className={styles.driverPoints}>15 PT</p>
                    </div>
                </div>

                {/* Otros pilotos */}
                <div className={styles.others}>
                    {puntajes.slice(3).map((puntaje, index) => (
                        <div key={index} className={styles.otherDriver}>
                            <p className={styles.otherDriverName}>{puntaje.usuario}</p>
                            <p className={styles.otherDriverTeam}>
                                {puntaje.equipo} - {puntaje.partidas_ganadas} PT
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.center}>
                <button onClick={irAOtraPagina} className={styles.button}>
                    ¡Comenzar Juego!
                </button>
            </section>
        </>
    );
}
