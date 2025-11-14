"use client"

import Button from "@/components/Boton";
import Input from "@/components/Input";
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "../hooks/useConnection";
import styles from "./page.module.css";

export default function Crud() {
  const { url } = useConnection();
  const [nombre, setNombre] = useState("");
  const [id, setId] = useState(0);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mensajePopup, setMensajePopup] = useState("");
  const router = useRouter();

  function cambiarNombre() {
    let data = {
      nombre: nombre,
      id_jugador: id
    };
    console.log(data)
    fetch(url + "/cambiarNombre", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.res) {
          console.log(response);
          setMensajePopup("Cambiado con exito");
          setMostrarPopup(true);
        }
      });
  }

  function guardarNombre(event) {
    setNombre(event.target.value);
  }

  function guardarId(event) {
    setId(event.target.value);
  }

  function irHome() {
    let url = "/home?idLogged=3&user=admin";
    router.push(url);
  }

  return (
    <>
      <div className={styles.banner}>
        <h1>Bienvenido Administrador!</h1>
      </div>
      <div className={styles.container}>
        <h2>Cambiar nombre de un usuario:</h2>
        <label>Nombre de usuario nuevo:</label>
        <Input onChange={guardarNombre}></Input>
        <label>ID del jugador:</label>
        <Input onChange={guardarId}></Input>
        <Button onClick={cambiarNombre} text="Cambiar Nombre"></Button>
        <Button onClick={irHome} text="Volver al Inicio"></Button>
      </div>
      <PopUp
        open={mostrarPopup}
        tipo={null}
        onClose={() => {
          setMostrarPopup(false);
        }}
      ></PopUp>
    </>
  )
}