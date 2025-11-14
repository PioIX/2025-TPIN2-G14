"use client";

import Button from "@/components/Boton";
import Input from "@/components/Input";
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "../hooks/useConnection";
import styles from "./page.module.css";

export default function Crud() {
  const { url } = useConnection();
  const [usuario, setUsuario] = useState("");
  const [id, setId] = useState(0);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mensajePopup, setMensajePopup] = useState("");
  const router = useRouter();

  function cambiarUsuario() {
    let data = {
      usuario: usuario,
      id_jugador: id,
    };

    fetch(url + "/cambiarUsuario", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.res) {
          console.log(response);
          setMensajePopup("Usuario cambiado con exito");
          setMostrarPopup(true);
        }
      });
  }

  function reiniciarTablas() {
    fetch(url + "/reiniciarTablas", {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.res) {
          setMensajePopup("Tablas reiniciadas correctamente")
          setMostrarPopup(true)
        } else {
          alert("Error reiniciando las tablas");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error en la petición");
      });
  }

  function guardarUsuario(event) {
    setUsuario(event.target.value);
  }

  function guardarId(event) {
    setId(event.target.value);
  }

  function irHome() {
    let url = "/login";
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
        <Input onChange={guardarUsuario} />
        <label>ID del jugador:</label>
        <Input onChange={guardarId}></Input>
        <Button onClick={cambiarUsuario} text="Cambiar nombre usuario" />
        <h2>Reiniciar base de datos: </h2>
        <Button onClick={reiniciarTablas} text="Reiniciar Tablas" />
        <Button onClick={irHome} text="Volver al Inicio"></Button>
      </div>
      <PopUp
        open={mostrarPopup}
        tipo={null}
        onClose={() => {
          setMostrarPopup(false);
        }}
      >{mensajePopup}</PopUp>
    </>
  );
}
