"use client"

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Reglas() {

    const router = useRouter();
    const irAOtraPagina = () => {
        router.back();
    };
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Reglas de la Batalla Esponjosa</h2>

            <section className={styles.section}>
                <h3 className={styles.subtitle}>Objetivo del Juego</h3>
                <p className={styles.text}>
                    El objetivo de BATALLA ESPONJOSA es ser el primer jugador en hundir todos los barcos del rival.
                    Para ello, los jugadores deben disparar a las coordenadas del tablero rival y descubrir si han impactado algún barco.
                    El jugador que logre hundir todos los barcos, gana.
                </p>
            </section>

            <section className={styles.section}>
                <h3 className={styles.subtitle}>Preparación del Juego</h3>
                <p className={styles.text}>
                     Cada jugador tiene su propio tablero de 10x10 donde colocará sus barcos.
                     Los barcos pueden colocarse en horizontal o vertical, pero no se puede superponer ningún barco.
                </p>
                <ul className={styles.list}>
                    <li>1 barco de 5 casillas</li>
                    <li>1 barcos de 4 casillas</li>
                    <li>1 barcos de 3 casillas</li>
                    <li>2 barcos de 2 casillas</li>
                </ul>
                <p className={styles.text}>
                    Los jugadores colocan sus barcos sin que el oponente vea cómo lo hacen.
                    Una vez colocados todos los barcos, comienza el juego.
                </p>
            </section>

            <section className={styles.section}>
                <h3 className={styles.subtitle}>Turnos</h3>
                <p className={styles.text}>
                    - El juego se juega por turnos. Cada jugador, en su turno, selecciona una coordenada en el tablero rival para disparar.
                    - El sistema verificará si la coordenada seleccionada corresponde a un barco o no.
                </p>
                <ul className={styles.list}>
                    <li>Si el disparo acierta en un barco, el sistema indica "¡Tocado!"</li>
                    <li>Si el disparo hunde completamente un barco, el sistema indica "¡Hundido!"</li>
                    <li>Si el disparo no acierta, el sistema indica "¡Agua!"</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h3 className={styles.subtitle}>Fin del Juego</h3>
                <p className={styles.text}>
                    El juego termina cuando uno de los jugadores haya hundido todos los barcos del oponente.
                    El jugador que haya logrado hundir todos los barcos gana la partida.
                </p>
            </section>

            <section className={styles.center}>
                <button onClick={irAOtraPagina} className={styles.button}>¡Comenzar Juego!</button>
            </section>
        </div>
    );
}
