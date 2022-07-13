class Tablero {
    constructor(numeroJugadores, numeroFichas) {
        this.casillas = []; // array de casillas totales del juego
        this.casas = []; // guarda las casas/carcel de cada color
        this.jugadores = []; // guarda los jugadores del juego
        this.triplePar = false; // boolean para saber si se ha hecho triple par
        this.numeroJugadores = numeroJugadores; // numero de jugadores del juego
        this.numeroFichas = numeroFichas; // numero de fichas del juego
        this.eleccion = false; // boolean para saber si se ha apretado un boton (necesario para el movimiento de fichas)
        this.dado1ValorActual; // valor del dado 1
        this.dado2ValorActual; // valor del dado 2
        for (var i = 1; i <= 12; i++) { // crea las casillas del juego y les asigna un objeto html
            if (i % 3 == 1) {
                this.casillas[i] = new Casilla(true, false, document.querySelector(`.f${i}`), 5, 10);
            }
            else {
                if (i % 3 == 2) {
                    this.casillas[i] = new Casilla(false, true, document.querySelector(`.f${i}`), 7, 12);
                }
                else {
                    this.casillas[i] = new Casilla(false, true, document.querySelector(`.f${i}`), 5, 12);
                }
            }
        }
        let colores = ["red", "green", "yellow", "blue"]; // array de colores de las fichas y su orden en el tablero
        for (var i = 0; i < numeroJugadores; i++) { // crea los jugadores, casas y fichas del juego y les asigna un objeto html
            this.casas[i] = new Casilla();
            this.casas[i].setHTML(document.querySelector(`.casa-${colores[i]}`));
            this.jugadores.push(new Jugador(colores[i], this.numeroFichas));
            for (var j = 0; j < this.numeroFichas ; j++) {
                if (i == 0) {
                    this.jugadores[i].fichas[j].setCasillaActual(this.casillas[1]);
                    this.casas[0].addFicha(this.jugadores[i].fichas[j]);
                }
                if (i == 1) {
                    this.jugadores[i].fichas[j].setCasillaActual(this.casillas[4]);
                    this.casas[1].addFicha(this.jugadores[i].fichas[j]);
                }
                if (i == 2) {
                    this.jugadores[i].fichas[j].setCasillaActual(this.casillas[7]);
                    this.casas[2].addFicha(this.jugadores[i].fichas[j]);
                }
                if (i == 3) {
                    this.jugadores[i].fichas[j].setCasillaActual(this.casillas[10]);
                    this.casas[3].addFicha(this.jugadores[i].fichas[j]);
                }
            }
        }
    }
    getCasillas() {
        return this.casillas;
    }
    setCasillas(casillas) {
        this.casillas = casillas
    }
    getJugadores() {
        return this.jugadores;
    }
    setJugadores(jugadores) {
        this.jugadores = jugadores;
    }

    /* funciones principales del juego*/


    async mover(turno, dado1, dado2, triplePar) { // funcion para hacer los movientos de las fichas del jugador de turno
        let jugador = this.jugadores[turno]; // jugador de turno
        this.triplePar = triplePar; // se guarda si el jugaro tiene triple par
        this.dado1ValorActual = dado1; // se guarda el valor del dado1
        this.dado2ValorActual = dado2; // se guarda el valor del dado2
        if (this.fichasEnCarcel(jugador) && dado1 == dado2) { // pregunta si el jugador tiene fichas en la carcel y saco par 
            let trato = await this.sacarFichasCarcel(jugador) // ejecuta la funcion sacar fichas de la carcel
            if (trato) { // si el jugador decidio sacar fichas de la carcel, los movientos que hace terminan y la funcion finaliza
                return new Promise((resolve) => { // return con forma asincrona 
                    resolve()
                })
            }
        }
        let i = 1; //indice para saber en que ficha esta el jugador
        let a = document.getElementById("Informacion").value;
        for (let ficha of jugador.fichas) { // se recorre las fichas del jugador
            if (ficha.getEnJuego()) { // si la ficha esta en juego
                document.getElementById("Informacion").value = a + ` ficha ${i}`;
                if (this.estaCasillaFinal(ficha)) { // pregunta si la ficha esta en la casilla final de su color
                    if (dado1 + dado2 == 8) { // pregunta si los dados suman 8, significa que la ficha puede salir del juego
                        await this.moverFinal(ficha, this.dado1ValorActual * 1, this.dado2ValorActual * 1, jugador); // se ejecuta la funcion para sacar la ficha del tablero
                    }
                }
                else { // si la ficha no esta en la casilla final de su color, se mueve de forma normal
                    await this.moverFicha(ficha, this.dado1ValorActual * 1, this.dado2ValorActual * 1,jugador ); // se ejecuta la funcion para mover la ficha
                }
                i = i + 1;
            }
        }
        this.triplePar = false; // se resetea el triple par
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (jugador.fichas.length == 0) { // si un jugador no tiene fichas, devuelve true
                    resolve(true);
                }
                resolve(false) // si el jugador tiene fichas, devuelve false
            }, 1500);
        })
    }


    getCasa(color) { // devuelve la casa del color pasado por parametro
        let colores = ["red", "green", "yellow", "blue"];
        let index = colores.indexOf(color);
        return this.casas[index];
    }
    comer(ficha, casilla, salida) { //funcion para que una ficha coma dentro de una casilla, recibe 
        //la ficha que esta comiendo, la casilla en la que se quiere comer y si la ficha esta saliendo de la carcel
        let color = ficha.getColor();
        let aux = [];
        let casa;
        if (casilla.esSalida && !salida) { // si la casilla es una salida y la ficha no es esta saliendo de la carcel, se detiene la funcion
            return
        }

        for (let otraFicha of casilla.getFichas()) {// se recorre la fichas de la casilla 
            if (otraFicha.getColor() != color) { // si la ficha es de otro color, se guarda en un array auxiliar
                aux.push(otraFicha);
            }
        }
        for (let otraFicha of aux) { // se recorre el array auxiliar, sabiendo que cada ficha adentro debe ser llevada a la carcel 
            casilla.quitarFicha(otraFicha);
            casa = this.getCasa(otraFicha.getColor());
            casa.addFicha(otraFicha); // se envia a la casa del color de la ficha
            otraFicha.setCasillaActual(casa);
            otraFicha.setEnJuego(false);// y se pone que no esta en juego
        }
    }

    estaCasillaFinal(ficha) { // devuelve true si la ficha esta en la casilla final de su color
        let color = ficha.getColor();
        let casilla = ficha.getCasillaActual();
        switch (color) { // segun el color de la ficha, se comprueba si esta en la casilla final
            case "red":
                if (casilla == this.casillas[12]) {
                    return true;
                }
                else {
                    return false;
                }
                break;
            case "green":
                if (casilla == this.casillas[3]) {
                    return true;
                }
                else {
                    return false;
                }
                break;
            case "yellow":
                if (casilla == this.casillas[6]) {
                    return true;
                }
                else {
                    return false;
                }
                break;
            case "blue":
                if (casilla == this.casillas[9]) {
                    return true;
                }
                else {
                    return false;
                }
                break;
        }
    }

    moverFicha(ficha, dado1, dado2,jugador) { // funcion para mover una ficha, 
        //recibe la ficha que se quiere mover, los dados y el jugador que la mueve
        let funcionSiguiente1; // variable para guardar la funcion para mover a una casilla siguiente
        let funcionSiguiente2; // variable para guardar la funcion para mover a dos casillas siguientes
        let funcionFinal; // variable para guardar la funcion para sacar la ficha del juego
        let posicionFicha = this.casillas.indexOf(ficha.getCasillaActual()); // se guarda la posicion de la ficha en el tablero
        let aux = ficha.getCasillaActual(); //variable auxiliar para guardar la casilla actual de la ficha
        let posicionFicha1 = (posicionFicha + 1) % 12; // posicion de la casilla siguiente a la ficha
        let posicionFicha2 = (posicionFicha + 2) % 12; // posicion de la casilla que esta a dos posiciones de la ficha
        if (posicionFicha1 == 0) {// si la posicion de la ficha es 0, se le suma 1 para que no se salga del tablero
            posicionFicha1 = 12;
        }
        if (posicionFicha2 == 0) {// si la posicion de la ficha es 0, se le suma 1 para que no se salga del tablero
            posicionFicha2 = 12;
        }
        let Siguiente1 = this.casillas[posicionFicha1]; // la casilla siguiente a la ficha
        let Siguiente2 = this.casillas[posicionFicha2]; // la casilla que esta a dos posiciones de la ficha
        let casillaFinal = document.querySelector(".final"); // selecciona la casilla final del tablero entero
        let boton = document.createElement("button"); // boton para elegir no mover esta ficha 
        boton.classList.add("button");
        boton.innerHTML = "Pasar de ficha";
        document.querySelector(".inputs").appendChild(boton);
        ficha.getHtml().innerText = "X";
        if (dado1 != Siguiente1.getValores()[0] && dado1 != Siguiente1.getValores()[1] && dado2 != Siguiente1.getValores()[0] && dado2 != Siguiente1.getValores()[1] && dado1 + dado2 != Siguiente1.getValores()[0] && dado1 + dado2 != Siguiente1.getValores()[1] && !this.triplePar) {
           // se pregunta si existe movimiento valido con los dados actuales para la ficha actual, si no existe, se ejectuta esto
            setTimeout(() => { // funcion asincrona que se ejecuta despues de 2 segundos se termina la funcion 
                ficha.getHtml().innerText = ""; 
                document.querySelector(".inputs").removeChild(boton);;
                this.eleccion = true; //cuando esta variable es true, la funcion termina automaticamente
            }, 2000);
        } else { // si exste movimiento valido, se ejecuta esto
            boton.addEventListener("click", () => { // se añade un evento al boton para que se pueda elegir no mover la ficha
                Siguiente1.getHTML().removeEventListener("click", funcionSiguiente1);
                Siguiente2.getHTML().removeEventListener("click", funcionSiguiente2);
                casillaFinal.removeEventListener("click", funcionFinal);
                Siguiente1.getHTML().classList.remove("button");
                Siguiente2.getHTML().classList.remove("button");
                casillaFinal.classList.remove("button");
                ficha.getHtml().innerText = "";
                document.querySelector(".inputs").removeChild(boton);
                this.eleccion = true; // cuando esta variable sea true, la funcion termina automaticamente
            }
            );
        }
        if (dado1 == Siguiente1.getValores()[0] || dado2 == Siguiente1.getValores()[0] || dado1 + dado2 == Siguiente1.getValores()[0]) {
            // se pregunta si la ficha se puede mover a la siguiente casilla con los dados actuales, si se puede, se ejecuta esto
            let casilla = Siguiente1.getHTML();
            casilla.className += " button";
            casilla.addEventListener('click', funcionSiguiente1 = () => { // se añade un evento a la casilla siguiente a la ficha, cuando se de click la ficha  se mueve
                this.comer(ficha, Siguiente1,false);
                aux.quitarFicha(ficha);
                Siguiente1.addFicha(ficha);
                ficha.setCasillaActual(Siguiente1);
                if (this.dado1ValorActual + this.dado2ValorActual == Siguiente1.getValores()[0]) {
                    this.dado1ValorActual = 0;
                    this.dado2ValorActual = 0;
                }
                if (this.dado1ValorActual == Siguiente1.getValores()[0]) {
                    this.dado1ValorActual = 0;
                }
                if (this.dado2ValorActual == Siguiente1.getValores()[0]) {
                    this.dado2ValorActual = 0;
                }
                document.getElementById("Dado1").value = this.dado1ValorActual;
                document.getElementById("Dado2").value = this.dado2ValorActual;
                casilla.classList.remove("button");
                Siguiente1.getHTML().classList.remove("button");
                Siguiente2.getHTML().classList.remove("button");
                casillaFinal.classList.remove("button");

                ficha.getHtml().innerText = "";
                document.querySelector(".inputs").removeChild(boton);
                Siguiente1.getHTML().removeEventListener("click", funcionSiguiente1);
                Siguiente2.getHTML().removeEventListener("click", funcionSiguiente2);
                casillaFinal.removeEventListener("click", funcionFinal);

                this.eleccion = true; // como se movio la ficha, se termina el moviento 

            });

        }
        if (dado1 == Siguiente2.getValores()[1] || dado2 == Siguiente2.getValores()[1] || dado1 + dado2 == Siguiente2.getValores()[1]) {
         // se pregunta si la ficha se puede mover dos casillas adelante con los dados actuales, si se puede, se ejecuta esto   
            let casilla = Siguiente2.getHTML();
            casilla.className += " button";
            casilla.addEventListener('click', funcionSiguiente2 = () => { //se añade un evento a la casilla en cuestion, cuando se de click la ficha se mueve
                this.comer(ficha, Siguiente2,false);
                aux.quitarFicha(ficha);
                Siguiente2.addFicha(ficha);
                ficha.setCasillaActual(Siguiente2);
                if (this.dado1ValorActual + this.dado2ValorActual == Siguiente2.getValores()[1]) {
                    this.dado1ValorActual = 0;
                    this.dado2ValorActual = 0;
                }
                if (this.dado1ValorActual == Siguiente2.getValores()[1]) {
                    this.dado1ValorActual = 0;
                }
                if (this.dado2ValorActual == Siguiente2.getValores()[1]) {
                    this.dado2ValorActual = 0;
                }
                document.getElementById("Dado1").value = this.dado1ValorActual;
                document.getElementById("Dado2").value = this.dado2ValorActual;
                casilla.classList.remove("button");
                Siguiente1.getHTML().classList.remove("button");
                Siguiente2.getHTML().classList.remove("button");
                casillaFinal.classList.remove("button");

                ficha.getHtml().innerText = "";
                document.querySelector(".inputs").removeChild(boton);
                Siguiente1.getHTML().removeEventListener("click", funcionSiguiente1);
                Siguiente2.getHTML().removeEventListener("click", funcionSiguiente2);
                casillaFinal.removeEventListener("click", funcionFinal);

                this.eleccion = true; // como se movio la ficha, se termina el moviento
            });
        }
        if(this.triplePar){ // aqui pregunta si se saco triple par, si se saco, se ejecuta esto
            this.dado1ValorActual = 0;
            this.dado2ValorActual = 0;
            casillaFinal.className += " button";
            casillaFinal.addEventListener('click', funcionFinal = () => { // se añade un evento a la casilla final, cuando se de click la ficha sale del juego
                this.triplePar = false;
                aux.quitarFicha(ficha);
                jugador.quitarFicha(ficha);
                casillaFinal.appendChild(ficha.getHtml());
                ficha.getHtml().innerText = "";
                this.dado1ValorActual = 0;
                this.dado2ValorActual = 0;
                document.getElementById("Dado1").value = this.dado1ValorActual;
                document.getElementById("Dado2").value = this.dado2ValorActual;
                casillaFinal.classList.remove("button");
                Siguiente1.getHTML().classList.remove("button");
                Siguiente2.getHTML().classList.remove("button");
                document.querySelector(".inputs").removeChild(boton);
                Siguiente1.getHTML().removeEventListener("click", funcionSiguiente1);
                Siguiente2.getHTML().removeEventListener("click", funcionSiguiente2);
                casillaFinal.removeEventListener("click", funcionFinal);
                this.eleccion = true; // como se movio la ficha, se termina el moviento
            });
        }

        return new Promise(resolve => { // haciendo el return de esta forma se puede ejecutar el codigo de forma asincrona
            //cuando se de clickea el boton se termina la funcion
            let myInterval = setInterval(() => {
                if (this.eleccion) {// pregunta si ya se toma una decicion cada milisegundo, si se toma, se ejecuta esto
                    clearInterval(myInterval);
                    this.eleccion = false;
                    resolve();
                }
            }, 1);

        });
    }


    sacarFichasCarcel(jugador) { // funcion que saca todas las fichas del jugador enviado de la carcel
        //la funcion retorna un boolean que dice si se sacaron las fichas o no
        let botonSacar = document.createElement("button");
        let botonNoSacar = document.createElement("button");
        let des = false;
        let des1;
        botonSacar.className = "button";
        botonSacar.innerHTML = "Sacar fichas de la carcel";
        document.querySelector(".inputs").appendChild(botonSacar);
        let funcionSacar
        botonSacar.addEventListener("click", funcionSacar = () => { // si el jugador elige sacar fichas de la carcel, se ejecuta esto
            jugador.setSalio(true);
            let fichas = jugador.getFichas();
            for (let ficha of fichas) {
                if (!ficha.getEnJuego()) {
                    ficha.setEnJuego(true);
                    let aux = ficha.getCasillaActual();
                    aux.quitarFicha(ficha);
                    switch (ficha.getColor()) { 
                        case "red":
                            this.casillas[1].addFicha(ficha);
                            this.comer(ficha, this.casillas[1],true);
                            ficha.setCasillaActual(this.casillas[1]);
                            break;
                        case "green":
                            this.casillas[4].addFicha(ficha);
                            this.comer(ficha, this.casillas[4],true);
                            ficha.setCasillaActual(this.casillas[4]);
                            break;
                        case "yellow":
                            this.casillas[7].addFicha(ficha);
                            this.comer(ficha, this.casillas[7],true);
                            ficha.setCasillaActual(this.casillas[7]);
                            break;
                        case "blue":
                            this.casillas[10].addFicha(ficha);
                            this.comer(ficha, this.casillas[10],true);
                            ficha.setCasillaActual(this.casillas[10]);
                            break;
                    }

                }
            }
            document.querySelector(".inputs").removeChild(botonSacar);
            document.querySelector(".inputs").removeChild(botonNoSacar);
            botonNoSacar.removeEventListener("click", funcionNoSacar);
            botonSacar.removeEventListener("click", funcionSacar);
            des = true;
            des1 = true;

        });
        botonNoSacar.className = "button";
        botonNoSacar.innerHTML = "No sacar fichas de la carcel";
        document.querySelector(".inputs").appendChild(botonNoSacar);
        let funcionNoSacar;
        botonNoSacar.addEventListener("click", funcionNoSacar = () => { // si el jugador elige no sacar fichas de la carcel, se ejecuta esto
            document.querySelector(".inputs").removeChild(botonSacar);
            document.querySelector(".inputs").removeChild(botonNoSacar);
            botonNoSacar.removeEventListener("click", funcionNoSacar);
            botonSacar.removeEventListener("click", funcionSacar);
            des = true;
            des1 = false;
        });
        return new Promise(resolve => {
            let myInterval = setInterval(() => {
                if (des) {
                    clearInterval(myInterval);
                    des = false;
                    resolve(des1);
                }
            }, 1);

        });
    }

    moverFinal(ficha, dado1, dado2, jugador) { // funcion para sacar una ficha del tablero

        let funcion;
        let boton = document.createElement("button");
        boton.classList.add("button");
        boton.innerHTML = "Pasar de ficha";
        document.querySelector(".inputs").appendChild(boton);
        ficha.getHtml().innerText = "X";
        if (dado1 + dado2 == 8) { // si los dados suman 8, significa que la ficha puede salir del juego
            boton.addEventListener("click", () => { // boton para no mover esta ficha y pasar a la siguiente
                ficha.getHtml().innerText = "";
                document.querySelector(".inputs").removeChild(boton);
                casilla.classList.remove("button");
                casilla.removeEventListener("click", funcion);
                this.eleccion = true;
            });
            let casilla = document.querySelector(".final")
            //añade a casilla la clase button
            casilla.className += " button";
            casilla.addEventListener('click', funcion = () => {//se añade un evento a la casilla final del tablero, si se da click la ficha se sale del tablero
                let aux = ficha.getCasillaActual();
                aux.quitarFicha(ficha);

                //remueve la ficha de las fichas del jugador
                jugador.quitarFicha(ficha);
                casilla.appendChild(ficha.getHtml());
                ficha.getHtml().innerText = "";
                document.querySelector(".inputs").removeChild(boton);
                casilla.classList.remove("button");
                casilla.removeEventListener("click", funcion);
                this.eleccion = true;
            });

        } else { // si sus dados no suman 8, significa que la ficha no puede salir del juego y no tiene mas movimientos
            //pasa automaticamente a la siguiente ficha
            setTimeout(() => {
                ficha.getHtml().innerText = "";
                document.querySelector(".inputs").removeChild(boton);;
                this.eleccion = true;
            }, 2000);
        }
        return new Promise(resolve => {
            //cuando se de clickea el boton se termina la funcion
            let myInterval = setInterval(() => {
                if (this.eleccion) {
                    clearInterval(myInterval);
                    this.eleccion = false;
                    resolve();
                }
            }, 1);

        });

    }
    fichasEnCarcel(jugador) { // pregunta si el jugador tiene fichas en la carcel
        //mirar si hay almenos una ficha del jugador en que no este en juego
        let fichas = jugador.getFichas();
        for (let ficha of fichas) {
            if (!ficha.getEnJuego()) {
                return true;
            }
        }
        return false
    }


    

}