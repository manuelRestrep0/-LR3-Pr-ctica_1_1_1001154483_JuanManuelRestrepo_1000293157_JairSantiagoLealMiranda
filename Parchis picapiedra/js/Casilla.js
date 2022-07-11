
class Casilla{ // clase casilla 
    esSeguro; // booleano si la casilla es seguro o no
    esSalida; // booleano si la casilla es salida o no
    valores; // array que guarda cuantos puntos de dado se necesita para aceder a la casilla, desde una casilla y dos casillas de distancia
    html;  // hace referencia al html de la casilla
    fichas; // fichas que hay en la casilla
    constructor(esSalida, esSeguro, html, valor1, valor2){
        this.esSeguro = esSeguro;
        this.esSalida = esSalida;
        this.valores = [valor1, valor2]; 
        this.html = html;
        this.fichas = [];
    }
    //geters and seters 
    getEsSeguro(){
        return this.esSeguro;
    }
    setEsSeguro(esSeguro){
        this.esSeguro = esSeguro;
    }
    getEsSalida(){
        return this.esSalida;
    }
    setEsSalida(esSalida){
        this.esSalida = esSalida;
    }
    getFichas(){
        return this.fichas;
    }
    //añadir ficha a la casilla
    addFicha(ficha){
        this.fichas.push(ficha);
        this.html.appendChild(ficha.representacionHTML);
    }
    //quitar ficha de la casilla
    quitarFicha(ficha){
        let index=this.fichas.indexOf(ficha);
        this.fichas.splice(index,1);
    }
    //comprobar si la casilla esta vacia
    isEmpty(){
        return this.fichas.length==0;
    }
    // get and setter for valores
    getValores(){
        return this.valores;
    }
    setValores(valores){
        this.valores = valores;
    }
    // get and setter for html
    getHTML(){
        return this.html;
    }
    setHTML(html){
        this.html = html;
    }


}
