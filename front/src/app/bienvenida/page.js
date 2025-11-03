"use client"

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h1 className={styles.title}>Batalla Esponjosa</h1>
                <p className={styles.subtitle}>¿Listo para luchar en el océano de Fondo de Bikini?</p>

                <div className={styles.buttonContainer}>
                    <button className={styles.buttonStart} onClick={() => router.push('/login')}>¡Comienza la Batalla!</button>
                </div>
            </div>
        </div>
    );
}
