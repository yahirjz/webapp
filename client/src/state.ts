//Definimos el tipo de datos que va a tener el state
type StateData = { 
    message: string;
}
//Definimos la URL del backend
const API_URL = "http://localhost:3000";

//Definimos el state
const state = {
    data: {
        message: ""
    },
    listeners:[] as ((data: StateData) => void) [],
    
    //Inicialización de los datos del backend
    init(){
        fetch(API_URL + "/productos")
        .then(res => res.json()) // transforma la respuesta en json
        .then(data =>{
            //recibimos la actualización del state
            this.setState(data);
        })
    },

    //Metodo para obtener el state
    getState(){
        return this.data;
    },

    //Modificamos el estado y les avisamos a los listeners
    setState(newState: StateData){
        this.data = newState;
        for(const callback of this.listeners){
            callback(this.data);
        }
    },

    subscribe(callback: (data: StateData) => void){
        this.listeners.push(callback);
    }
}

export {state};