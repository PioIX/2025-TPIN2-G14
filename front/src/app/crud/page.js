"use client"

import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "../hooks/useConnection";

export default function Crud() {
  const { url } = useConnection();
  const [nombre, setNombre] = useState("")
  const [id, setId] = useState(0)
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
          alert("Cambiado con exito");
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
      <Input onChange={guardarNombre}></Input>
      <Input onChange={guardarId}></Input>
      <Button onClick={cambiarNombre} text="Cambiar Nombre"></Button>
      <Button onClick={irHome} text="Ir a jugar"></Button>
    </>
  )
}