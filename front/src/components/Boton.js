"use client"
import styles from "./Boton.module.css";
export default function Button(props){
    return(
        <>
            <button className={styles.boton} onClick={props.onClick}>{props.text}</button>
        </>
    )
}