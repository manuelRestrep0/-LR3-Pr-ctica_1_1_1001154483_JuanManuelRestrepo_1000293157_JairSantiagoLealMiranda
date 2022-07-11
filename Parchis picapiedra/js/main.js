var informacion = document.getElementById("Informacion"); // objeto html que contiene la informacion
var dado1  = document.getElementById("Dado1"); // objeto html que contiene el valor del dado 1
var dado2  = document.getElementById("Dado2"); // objeto html que contiene el valor del dado 2
let jugadores = ["red", "green", "yellow", "blue"]; // array con los colores de los jugadores
let finDeJuego = false; // varibale boolean que pregunta si el juego ya termino o no 
let tableroDeJuego // variable que contiene el tablero de juego
let numeroFichas // variable que contiene el numero de fichas que tiene cada jugador
let numeroJugadores // variable que contiene el numero de jugadores que participaran en el juego

let getQueryVariable =(variable)=> { // funcion que obtiene los datos de la url mandada por la anterior pagina 
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

let tirarDado = () => { // funcion que retorna un numero aleatorio entre 1 y 6
    return 5;//Math.floor(Math.random() * 6) + 1;
}
asignarColoresInputs = (color)  =>{ // funcion que asigna los colores a los inputs de los dados
    let inputs = document.querySelectorAll("input");
    for(let i = 0; i < inputs.length; i++){
        inputs[i].style.color = color;
    }
}
let tiro = (i) => {   // funcion que ejecuta un tiro de los jugadores y devuelve el puntaje sacado con sus dados 
    let jugador = jugadores[i]; 
    asignarColoresInputs(jugador); // se asigna el color del jugador al input de los dados
    valor1 = tirarDado();
    valor2 = tirarDado();
    informacion.value = `Turno de ${jugador}`;
    dado1.value = valor1;
    dado2.value = valor2;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(valor1 + valor2);
        }, 2000);
    }
    )
}

let primeroEnJugar = async (numeroJugadores) => { // funcion que determina quien empieza el juego y retorna el turno
    let obtenidos = []; // array que contiene los valores obtenidos por los jugadores
    let i = 0;
    while(i < numeroJugadores){ // ciclo que hace que cada jugador haga un tiro y guarde el valor obtenido en el array
        obtenidos.push(await tiro(i))
        i++
    }
    let mayor = Math.max(...obtenidos); // se obtiene el valor mayor del array
    let jugador = jugadores[obtenidos.indexOf(mayor)]; // se obtiene el jugador que obtuvo el valor mayor
    informacion.value = `Empieza ${jugador}`; // se muestra en la pagina el jugador que empieza el juego
    dado1.value = 0; // se reinician los dados
    dado2.value = 0; // se reinician los dados
    return new Promise((resolve, reject) => { // return asincrono que retorna el turno del jugador que empieza el juego
        setTimeout(() => { //
            resolve(obtenidos.indexOf(mayor));
        }, 1000);
    })
}
let siguienteTurno = async (turno, i) => {//funcion recursiva que hace ejecuta el turno del jugador 
    // recibe el turno del jugador y numero de pares seguidos que tiene el jugador del turno
    let esTurno = jugadores[turno]; // Se obtiene el color del jugador que tiene el turno
    asignarColoresInputs(esTurno); // se asigna el color del jugador al input de los dados
    informacion.value = `turno ${esTurno}`; // se muestra en la pagina el turno del jugador
    let jugador = tableroDeJuego.getJugadores()[turno]; // se obtiene el jugador que tiene el turno
    if(!jugador.getSalio()){ // si el jugador aun no ha sacado las fichas de la carcel 
        for (let j = 0; j < 2; j++) { // se hace un ciclo que hace que el jugador tira dos veces
            if(!jugador.getSalio()){ // pero solo lo hace si el jugador aun no ha sacado las fichas de la carcel
                let valorDado1 = tirarDado(); // se obtiene el valor del dado 1
                let valorDado2 = tirarDado(); // se obtiene el valor del dado 2
                dado1.value = valorDado1; // se muestra en la pagina el valor del dado 1
                dado2.value = valorDado2; // se muestra en la pagina el valor del dado 2
                await tableroDeJuego.mover(turno, valorDado1, valorDado2,false); //se ejecuta mover de el objeto tablero
            }
        }
    }
    let valorDado1 = tirarDado(); // se hace un tiro para determinar el valor del dado 1
    let valorDado2 = tirarDado(); // se hace un tiro para determinar el valor del dado 2
    dado1.value = valorDado1; // se muestra en la pagina el valor del dado 1
    dado2.value = valorDado2; // se muestra en la pagina el valor del dado 2

    if(valorDado1 == valorDado2){ // si saco par, aumenta el numero de pares sacados del jugador
        i++
    }else{ // si no, se reinicia el numero de pares sacados seguidos del jugador
        i = 0;
    }
    finDeJuego = await tableroDeJuego.mover(turno, valorDado1, valorDado2,i == 3); // se ejecuta mover de el objeto tablero
    
    if(i == 3){ // se reinicia el numero de pares sacados seguidos del jugador si ya llego a 3 
        i = 0;
    }    
    
    if(finDeJuego){ // si el juego ya termino, se muestra en la pagina el ganador
        alert("fin de juego, gano el jugador " + esTurno);
        window.open("../index.html", "_self"); // se cierra la pagina y vuelve a la pagina principal
        return;
    }
    if(valorDado1 == valorDado2){ //si sacor par, se ejecuta de forma recursiva pero con el mismo turno
        await siguienteTurno(turno,i);
    }else{ // si no, se ejecuta de forma recursiva pero con el siguiente siguiente jugador
        turno = (turno + 1) % numeroJugadores; // se obtiene el siguiente jugador de forma circular
        await siguienteTurno(turno,i);

    }

}

(async () => { // funcion main que se ejecuta al cargar la pagina
    numeroJugadores = getQueryVariable("numeroJugadores")*1;// variable que contiene el numero de jugadores
    numeroFichas = getQueryVariable("numeroFichas")*1; // variable que contiene el numero de fichas por jugador
    tableroDeJuego = new Tablero(numeroJugadores, numeroFichas);  // objeto tablero de juego 
    let turno = await primeroEnJugar(numeroJugadores); //se ejecuta la funcion que nos dice cual es el primero en jugar y se guarda en una variable
    siguienteTurno(turno,0); // se ejecuta la funcion que hace mover el juego 
})();




