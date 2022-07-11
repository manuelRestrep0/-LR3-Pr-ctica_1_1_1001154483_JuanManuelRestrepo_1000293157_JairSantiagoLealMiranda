class Jugador{ // clase jugador
    color; // color del jugador
    fichas = []; // array con las fichas del jugador
    salio = false; // boolean que dice si el jugador ya saco por primera vez las fichas de la carcel 
    constructor( color, numeroFichas){
        this.color=color;
        for(let i=0; i<numeroFichas; i++){
            this.fichas[i] = new Ficha(this.color);
        }
    }
    quitarFicha(ficha){
        let index=this.fichas.indexOf(ficha);
        this.fichas.splice(index,1);
    }
    getFichas(){
        return this.fichas;
    }
    
    getSalio(){
        return this.salio;
    }
    setSalio(salio){
        this.salio = salio;
    }
    
}