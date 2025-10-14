"use client"
import styles from './Input.module.css'
export default function Input(props) {
    return(
        <>
            <input className={styles.msj} type={props.type} onChange={props.onChange} placeholder={"Escribiendo..."}></input>
        </>
    )
}