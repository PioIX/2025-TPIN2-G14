# 🪼 Batalla Esponjosa - GRUPO 14 - 2025

**Batalla Esponjosa** es un juego digital para **dos jugadores**, basado en el clásico juego de mesa **Batalla Naval**, pero edición Bob Esponja.  
El objetivo es hundir todos los barcos del oponente antes de que él hunda los tuyos.

---

## Descripción general

Dos jugadores compiten entre sí en una partida por turnos.  
Cada uno coloca sus barcos en un tablero y por turnos, intenta adivinar las coordenadas de los barcos del rival disparando.

Se indica si el tiro fue **agua** o **hundido**, y el juego termina cuando uno de los jugadores logra destruir todos los barcos del otro.

---

## Funcionamiento
- En primera instancia el jugador ve una pagina de bienvenida, una vez todo listo pasa a la siguiente pantalla donde hace su inicio de sesion o registro.
- En caso de ser usuario CRUD, accede a una tercera pagina donde podra hacer modificaciones a la BBDD y luego volver al 'home' para poder jugar.
- Luego de registrarse/iniciar sesión, el usuario pasará a un 'lobby', donde estaran todos los jugadores, y ahi podra ir a ver las reglas del juego, ver un ranking global de puntajes o crear una partida con cualquier otro jugador en linea.
- Una vez aceptada la inviación por el otro jugador, pasaran a elegir la dificultad del juego, que determinará la cantidad de barcos que van a utilizar.
- Con todo seleccionado, los jugadores pasarán a la pantalla final, donde deberan colocar sus barcos y jugar!
- Al finlizar el juego les aparecerá un cartel indicando el ganador y a donde se quieran redirigir.

---

## Funcionalidades principales

### Inicio del juego
- Dos jugadores ingresan a su cuenta ya sea creandola o con una ya existente.
- Se crea una nueva partida, un jugador invita al otro, cuando esta invitacion se acepta inicia la partida.
- Eligen la dificultad de la partida.
- Cada jugador tiene su propio tablero.

### Preparación
- Cada jugador coloca sus barcos en un tablero (de A a J y del 1 al 10).
- Los barcos pueden colocarse de forma **horizontal o vertical**.
- El sistema **no permite superposiciones** entre barcos.

### Turnos
- El juego se desarrolla **por turnos**.
- En su turno, el jugador elige una **coordenada** del tablero rival para disparar.
- El sistema verifica:
  - Si hay un barco → **impacto**.
  - Si no hay un barco → **agua**.


### Fin del juego
- Gana el jugador que **hunde todos los barcos** del oponente.
- El sistema muestra:
  - El **ganador**.

---

**Desarrollado por:** Ignacio Iglesias - Joaquin Peralta - Ignacio Salvadori - Dolores Solá  
Colegio Pío IX – 5° Informática 2025
