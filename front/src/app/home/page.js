"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/home/page.module.css";
import { useSocket } from "../hooks/useSocket";
import Image from "next/image";
import PopUp from "@/components/PopUp";
import { Poppins } from 'next/font/google'; 

export default function Home() {
  const searchParams = useSearchParams();
  const usuario = searchParams.get("user");
  const idLogged = searchParams.get("idLogged");
  const { socket, isConnected } = useSocket();
  const [usuariosEnLinea, setUsuariosEnLinea] = useState([]);
  const [nombresEnLinea, setNombresEnLinea] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState(null);
  const [partidaRequest, setPartidaRequest] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const router = useRouter();
  const [idPartida, setIdPartida] = useState(null);
  const [jugador1Nombre, setJugador1Nombre] = useState("");
  const [jugador2Nombre, setJugador2Nombre] = useState("");
  const [jugador1Id, setJugador1Id] = useState(null);
  const [jugador2Id, setJugador2Id] = useState(null);
  const [selectedImg2, setSelectedImg2] = useState(null);



  const selectedImgRef = useRef(selectedImg);
  useEffect(() => {
    selectedImgRef.current = selectedImg;
  }, [selectedImg]);

  const personajes = [
    "/imagenes/pablo.jpg",
    "/imagenes/flandua.jpg",
    "/imagenes/bergondi.jpg",
    "/imagenes/brendix.jpg",
    "/imagenes/sturla.jpg",
    "/imagenes/santi.jpg",
    "/imagenes/caro.jpg",
    "/imagenes/rivas.jpg",
    "/imagenes/pez.jpg",
    "/imagenes/estrella.jpg",
    "/imagenes/calamardo.jpg",
    "/imagenes/caracol.jpg",
    "/imagenes/bob.jpg",
    "/imagenes/ardilla.jpg",
    "/imagenes/cangrejo.jpg",
    "/imagenes/bichito.jpg",
  ];

  useEffect(() => {
    console.log("jugador1 id: ", jugador1Id);
  }, [jugador1Id]);

  useEffect(() => {
    if (selectedPlayerId) {
      try {
        const response = fetch("http://localhost:4000/getUsuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: selectedPlayerId }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.res) {
              const selectedUser = response.usuario[0].usuario;
              setSelectedPlayerName(selectedUser);
            }
          });
      } catch {
        console.log("error en getUsuario selected");
      }
    }
  }, [selectedPlayerId]);

  useEffect(() => {
    if (partidaRequest == true) {
      setMostrarPopup(true);
    }
  }, [partidaRequest]);

  useEffect(() => {
    if (!socket || !isConnected || !idLogged) return;

    console.log("Uniéndose a sala:", 0, "Usuario:", idLogged);
    socket.emit("joinRoom", {
      room: 0,
      userId: Number(idLogged),
    });

    socket.on("jugadores_en_linea", (data) => {
      console.log("Jugadores en línea:", data.jugadores);
      setUsuariosEnLinea(data.jugadores);
    });

    socket.on("partidaRequest", (data) => {
      console.log("Petición de partida recibida:", data);
      console.log(`${data.player1Name} te invitó a jugar. ID Partida: ${data.idPartida}`);
      if (Number(data.player2Id) == Number(idLogged)) {
        setJugador1Nombre(data.player1Name);
        setJugador1Id(data.player1Id);
        setJugador2Nombre(data.player2Name);
        setJugador2Id(data.player2Id);
        setSelectedImg(data.imagen1);
      }
      if (Number(data.player2Id) === Number(idLogged)) {
        setMostrarPopup(true);
      }
    });

    socket.on("recibir_idPartida", (data) => {
      if (idLogged == data.jugador2) {
        setIdPartida(data.partidaId);
      }
    });

    socket.on("recibir_imagen", (data) => {
      console.log(data, { jugador1Id, idLogged });
      if (data.player1Id == idLogged) {
        console.log("recibiendo imagen: ", data.imagen, "de jugador:", data.player1Id);
        setSelectedImg2(data.imagen);
      }
    });

    return () => {
      socket.emit("leaveRoom", { room: 0 });
      socket.off("jugadores_en_linea");
      socket.off("partidaRequest");
    };
  }, [socket, isConnected, idLogged]);

  useEffect(() => {
    if (usuariosEnLinea.length > 0) {
      jugadores();
    }
  }, [usuariosEnLinea]);

  useEffect(() => {
    if (
      selectedImg &&
      selectedImg2 &&
      idLogged == jugador1Id &&
      jugador1Id &&
      jugador2Id &&
      jugador1Nombre &&
      jugador2Nombre
    ) {
      const data = {
        jugador1: jugador1Id,
        jugador2: jugador2Id,
      };
      try {
        fetch("http://localhost:4000/crearPartida", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.res) {
              const nuevaPartidaId = response.idPartida;
              setIdPartida(nuevaPartidaId);
              if (socket && isConnected) {
                console.log("Partida numero: ", idPartida, "Creada por:", idLogged);
                socket.emit("enviar_partidaId", {
                  partidaId: nuevaPartidaId,
                  jugador2: jugador2Id,
                });
              }
            } else {
              console.log("Error al crear partida");
            }
          });
      } catch {
        console.log("error");
      }
    }
  }, [selectedImg, selectedImg2, idPartida, jugador1Id, jugador2Id, jugador1Nombre, jugador2Nombre]);

  useEffect(() => {
    if (selectedImg && selectedImg2 && idPartida && jugador1Id && jugador2Id && jugador1Nombre && jugador2Nombre) {
      socket.emit("leaveRoom", { room: 0 });
      console.log("Todos los datos listos, navegando...");
      let url =
        "/partida?idLogged=" +
        idLogged +
        "&jugador1Id=" +
        jugador1Id +
        "&jugador1Nombre=" +
        jugador1Nombre +
        "&jugador2Id=" +
        jugador2Id +
        "&jugador2Nombre=" +
        jugador2Nombre +
        "&img1=" +
        selectedImg +
        "&img2=" +
        selectedImg2 +
        "&idPartida=" +
        idPartida;
      router.push(url);
    }
  }, [selectedImg, selectedImg2, idPartida, jugador1Id, jugador2Id, jugador1Nombre, jugador2Nombre]);

  useEffect(() => {
    console.log("imagen elegida jugador 1:", selectedImg);
    console.log("jugador elegido por jugador 1:", selectedPlayerId);
  }, [selectedImg][selectedPlayerId]);

  function crearPartida() {
    if (!socket || !isConnected || !selectedPlayerId || !selectedImg) {
      alert("no seleccionaste nada");
      return;
    }
    if (socket && isConnected) {
      setJugador1Id(idLogged);
      setJugador2Id(selectedPlayerId);
      setJugador1Nombre(usuario);
      setJugador2Nombre(selectedPlayerName);
      console.log(idLogged, " ", selectedPlayerId);
      socket.emit("nuevaPartida", {
        jugador1Nombre: usuario,
        jugador2Nombre: selectedPlayerName,
        jugador1Id: idLogged,
        jugador2Id: selectedPlayerId,
        imagen1: selectedImg,
      });
      console.log("Informacion enviada a jugador 2");
    }
  }

  function unirseAPartida() {
    if (!selectedImg2) {
      alert("Elegí un personaje primero");
    }

    console.log({
      imagen: selectedImg2,
      jugador2Id: idLogged,
      jugador1Id: jugador1Id,
    });
    socket.emit("enviar_imagen", {
      imagen: selectedImg2,
      jugador2Id: idLogged,
      jugador1Id: jugador1Id,
    });
  }



  async function jugadores() {
    const usuariosCompletos = [];

    for (let i = 0; i < usuariosEnLinea.length; i++) {
      try {
        const response = await fetch("http://localhost:4000/getUsuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: usuariosEnLinea[i] }),
        });

        const data = await response.json();

        if (data.res) {
          usuariosCompletos.push({
            id: usuariosEnLinea[i],
            nombre: data.usuario[0].usuario,
          });
        }
      } catch (error) {
        console.log("Error en fetch:", error);
      }
    }

    setNombresEnLinea(usuariosCompletos);
  }

  function irReglas() {
    let url = "/reglas";
    router.push(url);
  }

  return (
    <>
      <section>
        <div className={styles.header}>
          <h1 >¡Bienvenido {usuario} a Batalla Esponjosa!  </h1>
          
        </div>
      </section>

      {/* === Secciones con imagen de fondo === */}
      <section className={styles.section1}>
        <div className={styles.contenedor}>
          <div className={styles.actionsGrid}>
            {/* Card: Crear partida (PopUp trigger) */}
            <PopUp
              boton={
                <button className={`${styles.cardButton} ${styles.cardCrear}`}>
                  <span className={styles.cardTitle}>Crear partida</span>
                </button>
              }
            >
              <div className={styles.crearPartidaPopup1}>
                <div className={styles.parte1}>
                  <h2 className={styles.titulo}>Crear partida</h2>
                  <h2 className={styles.text}>Elegí uno de los jugadores en línea:</h2>
                  <select
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className={styles.selectJugador}
                  >
                    <option className={styles.option} key={0} value={0}>
                      Sin seleccionar
                    </option>
                    {nombresEnLinea.length > 1 ? (
                      nombresEnLinea.map((nombre) => {
                        if (nombre.id !== Number(idLogged)) {
                          return (
                            <option className={styles.option} key={nombre.id} value={nombre.id}>
                              {nombre.nombre}
                            </option>
                          );
                        }
                      })
                    ) : (
                      <option className={styles.option}>No hay jugadores en línea</option>
                    )}
                  </select>
                </div>
              </div>

              <div className={styles.crearPartidaPopup2}>
                <h2 className={styles.text}>Elegí un personaje:</h2>
                <div className={styles.personajes}>
                  {personajes.map((personaje, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImg(personaje)}
                      className={`${styles.botonFoto} ${selectedImg === personaje ? styles.selected : ""}`}
                    >
                      <img src={personaje} alt={`Personaje ${index}`} className={styles.personaje} />
                    </button>
                  ))}
                </div>
                <div className={styles.crearP}>
                  <button className={styles.botonCrearPartida} onClick={crearPartida}>
                    Crear partida
                  </button>
                </div>
              </div>
            </PopUp>

            {/* Card: Ver puntajes */}
            <button className={`${styles.cardButton} ${styles.cardScores}`} onClick={scores}>
              <span className={styles.cardTitle}>Ver puntajes</span>
            </button>

            {/* Card: Ir a reglas */}
            <button className={`${styles.cardButton} ${styles.cardReglas}`} onClick={irReglas}>
              <span className={styles.cardTitle}>Ir a reglas</span>
            </button>
          </div>
        </div>
      </section>

      {/* Invitación recibida */}
      <PopUp
        open={mostrarPopup}
        tipo={null}
        onClose={() => {
          setMostrarPopup(false);
        }}
      >
        <div>
          <h2 className={styles.text}>¡{jugador1Nombre} te está invitando a una partida!</h2>
          <button className={styles.botonAceptar} onClick={unirseAPartida}>
            Aceptar
          </button>
        </div>

        <div className={styles.personajes}>
          {personajes.map((personaje, index) => (
            <button
              key={index}
              onClick={() => setSelectedImg2(personaje)}
              className={`${styles.botonFoto} ${selectedImg2 === personaje ? styles.selected : ""}`}
            >
              <img src={personaje} alt={`Personaje ${index}`} className={styles.personaje} />
            </button>
          ))}
        </div>
      </PopUp>
    </>
  );
}
