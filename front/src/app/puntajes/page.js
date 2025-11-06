"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/puntajes/page.module.css";


export default function Puntajes() {
    const router = useRouter();
    const irAOtraPagina = () => {
        router.back();
    };
    return (

        <>
            <section className={styles.section1}>
                 <h1>Historial de juegos:</h1>
            </section>
            <section className={styles.center}>
                <button onClick={irAOtraPagina} className={styles.button}>¡Comenzar Juego!</button>
            </section>
        </>

    )
}