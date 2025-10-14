"use client"

import { useState } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import styles from "./page.module.css"

export default function Login() {
    const [contraseña, setContraseña] = useState("");
    const [nombre, setNombre] = useState("");
    const [user, setUser] = useState("");
    const [mostrar, setMostrar] = useState("false");
    const [mail, setMail] = useState("false");

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

    //hay que hacer un componente popup para que quede mejor que el alert que queda re croto
    async function login() {
        let data = {
            user: user,
            contraseña: contraseña,
        };

        fetch('http://localhost:4000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if (response.res) {
                    console.log(response)
                    //popup no alert
                    alert("Ingresaste con exito");
                    router.push("/home?idLogged=${response.idLogged}&user=${response.user}");
                } else {
                    //popup no alert
                    alert("Número de teléfono o contraseña incorrectos");

                }
            })

    }
    async function register() {
        let data = {
            nombre: nombre,
            contraseña: contraseña,
            email: mail,
            user: user
        };

        fetch('http://localhost:4000/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if (response.res) {
                    //popup no alert
                    alert("Cuenta creada con exito");
                    router.push("/home?idLogged=${response.idLogged}&user=${user}");
                } else {
                    //popup no alert
                    alert("El usuario ya existe");
                }
            })
    }


    function irRegister() {
        setMostrar(!mostrar)
    }

    return (
        <>
            <div className={styles.contenedor}>
                <h2>Iniciar sesioón</h2>
                <br></br>
                <h3>Ingrese su nombre de usuario: </h3>
                <Input onChange={guardarUser}></Input>
                <br></br>
                <br></br>
                <h3>Ingrese su contraseña: </h3>
                <Input onChange={guardarContraseña} type={"password"}></Input>
                <Button onClick={login} text="Iniciar sesion"></Button>
                <br></br>
                <br></br>
                <h3>¿No tenes cuenta? Registrate ahora!</h3>
                <br></br>
                <Button onClick={irRegister} text="Ir a registrarse"></Button>
            </div>
            {!mostrar && (
                <div className={styles.contenedor}>
                    <h2>Registrarse</h2>
                    <br></br>
                    <h3>Ingrese su nombre: </h3>
                    <Input onChange={guardarNombre}></Input>
                    <br></br>
                    <br></br>
                    <h3>Ingrese su nombre de usuario: </h3>
                    <Input onChange={guardarUser2}></Input>
                    <br></br>
                    <br></br>
                    <h3>Ingrese su email: </h3>
                    <Input onChange={guardarMail}></Input>
                    <br></br>
                    <br></br>
                    <h3>Ingrese su contraseña: </h3>
                    <Input onChange={guardarContraseña2} type={"password"}></Input>
                    <br></br>
                    <br></br>

                    <Button onClick={register} text="Registrarse"></Button>
                </div>

            )}</>
    )
}
