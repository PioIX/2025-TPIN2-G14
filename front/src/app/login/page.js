"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import styles from "@/app/login/page.module.css";
import PopUp from "@/components/PopUp";

export default function Login() {
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState("");
  const [mostrar, setMostrar] = useState("false");
  const [mail, setMail] = useState("false");
  const router = useRouter();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [inicio, setInicio] = useState(0);

  useEffect(() => {
    if (inicio === 1 || inicio === 2 || inicio === 3) {
      setMostrarPopup(true);
    }
  }, [inicio]);

  function guardarContraseña(event) {
    setContraseña(event.target.value);
  }
  function guardarContraseña2(event) {
    setContraseña(event.target.value);
  }
  function guardarNombre(event) {
    setNombre(event.target.value);
  }
  function guardarUser(event) {
    setUser(event.target.value);
  }
  function guardarUser2(event) {
    setUser(event.target.value);
  }
  function guardarMail(event) {
    setMail(event.target.value);
  }
  function guardarMail2(event) {
    setMail(event.target.value);
  }

  async function login() {
    let data = { user: user, contraseña: contraseña };

    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.idLogged == 3) {
          setInicio(1);
          setTimeout(() => {
            let url = "/crud?idLogged=" + response.idLogged + "&user=" + user;
            router.push(url);
          }, 2000);
        } else if (response.res) {
          setInicio(1);
          setTimeout(() => {
            let url = "/home?idLogged=" + response.idLogged + "&user=" + user;
            router.push(url);
          }, 2000);
        } else {
          setInicio(3);
        }
      });
  }

  async function register() {
    let data = {
      nombre: nombre,
      contraseña: contraseña,
      email: mail,
      user: user,
    };

    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.res) {
          setInicio(1);
          setTimeout(() => {
            let url = "/home?idLogged=" + response.idLogged + "&user=" + user;
            router.push(url);
          }, 2000);
        } else {
          setInicio(2);
        }
      });
  }

  function irRegister() {
    setMostrar(!mostrar);
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.contenedor}>
          <h2 className={styles.title}>Iniciar sesión</h2>
          <h3>Ingrese su nombre de usuario:</h3>
          <Input className="msj" onChange={guardarUser} placeholder={"Introduzca su nombre de usuario"} />
          <br></br>
          <br></br>
          <h3>Ingrese su contraseña:</h3>
          <Input className="msj" onChange={guardarContraseña} placeholder={"Introduzca su contraseña"} type={"password"} />
          <br></br>
          <br></br>
          <Button className="boton" onClick={login} text="Iniciar sesion" />
          <br></br>
          <br></br>
          <h3>¿No tenes cuenta? Registrate ahora!</h3>
          <br></br>
          <Button className="boton" onClick={irRegister} text="Registrarse" />
        </div>

        {!mostrar && (
          <div className={styles.contenedor}>
            <h2 className={styles.title}>Registrarse</h2>
            <h3>Ingrese su nombre:</h3>
            <Input className="msj" onChange={guardarNombre} placeholder={"Introduzca su nombre"} />
            <br></br>
            <br></br>
            <h3>Ingrese su nombre de usuario:</h3>
            <Input className="msj" onChange={guardarUser2} placeholder={"Introduzca su nombre de usuario"}/>
            <br></br>
            <br></br>
            <h3>Ingrese su email:</h3>
            <Input className="msj" onChange={guardarMail} placeholder={"Introduzca su mail"}/>
            <br></br>
            <br></br>
            <h3>Ingrese su contraseña:</h3>
            <Input className="msj" onChange={guardarContraseña2} type={"password"} placeholder={"Introduzca su contraseña"}/>
            <br></br>
            <br></br>
            <div className={styles.boton2}>
              <Button className="boton" onClick={register} text="Registrarse" />
            </div>
          </div>
        )}

        <PopUp
          open={mostrarPopup}
          tipo={inicio}
          onClose={() => {
            setMostrarPopup(false);
            setInicio(0);
          }}
        >
          {inicio === 1 ? (
            <div>
              <h1>¡Ingresaste con éxito!</h1>
              <img src="/imagenes/bobesponja-removebg.png" />
            </div>
          ) : inicio === 2 ? (
            <div>
              <h1>El usuario ya existe, vuelve a intentarlo.</h1>
              <img src="/imagenes/bobtriste-removebg.png" />
            </div>
          ) : inicio === 3 ? (
            <div>
              <h1>Usuario o contraseña incorrectos.</h1>
              <img src="/imagenes/bobtriste-removebg.png" />
            </div>
          ) : null}
        </PopUp>
      </div>
    </>
  );
}
