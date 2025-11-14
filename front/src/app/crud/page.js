"use client";

import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "../hooks/useConnection";

export default function Crud() {
  const { url } = useConnection();
  const [usuario, setUsuario] = useState("");
  const [id, setId] = useState(0);
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
          alert("Cambiado con éxito");
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
          alert("Tablas reiniciadas correctamente");
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
    let url = "/home?idLogged=3&user=admin";
    router.push(url);
  }

  return (
    <>
      <Input onChange={guardarUsuario} />
      <Input onChange={guardarId} />

      <Button onClick={cambiarUsuario} text="Cambiar nombre usuario" />
      <Button onClick={reiniciarTablas} text="Reiniciar Tablas" />
      <Button onClick={irHome} text="Ir a jugar" />
    </>
  );
}
