"use strict";

class Ficha{// clase ficha 
    color; // string que guarda el color de la ficha
    enJuego; // boolean si la ficha esta en la carcel o no
    representacionHTML; // guarda el html de la ficha 
    casillaActual; // guarda la direccion de la casilla en la que se encuentra la ficha
    constructor(color){
        this.color=color;
        this.enJuego = false;
        this.representacionHTML=document.createElement("div");
        this.representacionHTML.className="fichaza";
        this.representacionHTML.style.backgroundColor=color;
    }
    getCasillaActual(){
        return this.casillaActual;
    }
    setCasillaActual(casillaActual){
        this.casillaActual=casillaActual;
    }
    getHtml(){
        return this.representacionHTML;
    }
    getColor(){
        return this.color;
    }
    setEnJuego(enJuego){
        this.enJuego=enJuego;
    }
    getEnJuego(){
        return this.enJuego;
    }

}
