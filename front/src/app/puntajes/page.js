"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/puntajes/page.module.css";


export default function Puntajes() {
    const router = useRouter();
    const irAOtraPagina = () => {
        router.back();
    };
    async function traer() {
        try {
            const response = await fetch("http://localhost:4000/traerPuntajes", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            // Primero necesitas parsear el JSON
            const data = await response.json();

            // Ahora sí puedes acceder a las propiedades
            if (data.res) {
                console.log(data.message); // Aquí están los ganadores
                // Hacer algo con los datos
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
                <button onClick={traer}>ñañañañañañña</button>
            </section>
            <section className={styles.center}>
                <button onClick={irAOtraPagina} className={styles.button}>¡Comenzar Juego!</button>
            </section>
        </>

    )
}