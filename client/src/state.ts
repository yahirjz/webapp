import { rtdb } from "./rtdb";

//Definimos el tipo de datos que va a tener el state
type Move = "piedra" | "papel" | "tijera";
// type GameResult = "win" | "lose" | "draw";

//Definición de la forma de datos
type GameState = {
    name: string;
    userId: string;
    roomId: string;
    rtdbRoomId: string;
    online: boolean;
    move: Move;
    rtdbData: any;
    score: {
        wins: number;
        lose: number;
        draw: number;
    }
}
const API_URL = " http://0.0.0.0:3000";
//Definimos la URL del backend

//Inicializamos el estado vacio 
const state = {
    data: {
       name: "",
       userId: "",
       roomId: "",
       rtdbRoomId: "",
       online: false,
       move: "" as any, // Inicializar como string vacío casteado
       rtdbData: {} as any,
       score: {
           wins: 0,
           lose: 0,
           draw: 0
       }
    } as GameState, //Esto es de tipo GameState

    listeners:[] as Function[],
    

    //Inicialización de los datos del backend
    init(){
        const localData = localStorage.getItem("gameState");
        if(localData){
            const parsed =JSON.parse(localData);
            // Recuperamos todo menos la jugada
            parsed.move = "";
            this.setState(parsed);
        }
    },

    //Metodo para obtener el state
    getState(){
        return this.data;
    },

    //Modificamos el estado y les avisamos a los listeners
    // Partial es un tipo que permite que algunos campos sean opcionales
    setState(newState: Partial<GameState>){ 
        this.data = {...this.data, ...newState};
        for(const cb of this.listeners){
           cb();
        }
        console.log("soy el state, he cambiado: " , this.data);
        // Guardamos TODO el estado actual convertido a texto
        localStorage.setItem("gameState", JSON.stringify(this.data));
    },

    subscribe(callback: (any: any) => any){
        this.listeners.push(callback);
    },

    setName(name: string){
        if(name){
            return fetch(API_URL + "/player",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name})
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    name,
                    userId: data.id
                })
            })
        }
    },

    askNewRoom(callback?: () => void){
        const cs = this.getState();
        if(cs.userId){
            return fetch(API_URL + "/gamerooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    roomId: data.id,
                    rtdbRoomId: data.rtdbRoomId // Si el server te lo devuelve, guárdalo también
                });
                
                if(callback){ 
                    callback();
                }
                return data;
            });
        }
    },

    //Obtener el id de la sala
       accessToRoom(roomId: string){
        const currentState = this.getState();
        const userId = currentState.userId;

        if(roomId && userId){
            console.log("Fetcheando:", API_URL + '/gamerooms/' + roomId + '?userId=' + userId); // <--- LOG URL
            return fetch(API_URL + '/gamerooms/' + roomId + '?userId=' + userId)
            .then(res => {
                // AQUÍ es el único lugar donde existe 'res'
                if(!res.ok){
                    throw new Error("Room not found"); // ¡Lanzamos la bomba! 💣
                }
                return res.json();
            })
            .then(data => {
                console.log("Data recibida del server:", data); // <--- LOG NUEVO
                // Si llegamos aquí, es porque todo salió bien
                currentState.roomId = roomId;
                currentState.rtdbRoomId = data.rtdbRoomId;
                this.setState(currentState);
                this.listenRoom(); // Escuchamos los cambios en la sala
            })
        } else {
            console.error("No hay roomId o userId");
            // Retornamos promesa rechazada para que el UI sepa que falló antes de empezar
            return Promise.reject("Faltan datos");
        }
    },
    
    setMove(move: Move){
           const cs = this.getState();
        
        // 1. Guardar en local (IMPORTANTE)
        cs.move = move;
        // No hace falta this.setState(cs) necesariamente si modificas la referencia directa, pero para ser seguros:
        this.setState(cs);
        
        // 2. Guardar en RTDB
        const ref = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/online/" + cs.userId);
        ref.update({ choice: move});
        
        console.log("jugada enviada:", move);
    },

    //---- Escuchamos los cambios en la sala para poder asignar un estado en línea
    listenRoom(){

        //NOTA: para poder escribit en la base de datos, debemos usar la referencia a demas de poder escribir en las reglas de la base de datos
        const cs = this.getState();
        console.log("Escuchando la sala:", cs.rtdbRoomId);

        // Creamos la referencia a la sala de online del usuario
        const onlineRef = rtdb.ref( "/rooms/" + cs.rtdbRoomId + "/online/" + cs.userId);

        // marcamos o seteamos como online y obtenemos su name
        onlineRef.set({
            online: true, // marcamos online como true
            name: cs.name // obtenemos el name del usuario
        }); 

        //Cuando la conexión se cierra, marcamos como offline
        onlineRef.onDisconnect().set(false);

        // Escuchamos los cambios en la sala para actualizar el estado local
        //accedemos ala referencia a "/rooms/" + el ID largo
        const roomRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
        roomRef.on("value", (snapshot) => { // hacemos una captura de los datos de la sala
            const data = snapshot.val(); // obtenemos los datos de la sala
            if(!data) return; // Si no hay data, salimos

            const cs = this.getState(); // obtenemos el state actual
            console.log("Sala actualizada:", data); // imprimimos los datos de la sala

            //preparamos el nuevo estado 
            const newState: any = { rtdbData: data };
            //si existe online en la base de datos Y existe el usuario en el online
           
            if(data.online && data.online[cs.userId]){
                newState.online = true;
            }
            this.setState( newState );
        });
        
    },
    setStart(val: boolean){
        const cs = this.getState(); //obtenemos la foto actual  para saber que sala y quienes somos 
        console.log("SET START llamado con:", val);
        console.log("IDs:", cs.rtdbRoomId, cs.userId);
        const ref = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/online/" + cs.userId); //creamos la referencia a la sala con el id de la sala y el id del usuario
        //Actualizamos solo el campo "start"
        ref.update({ start: val })
        .then( () => {
            console.log("Start actualizado con éxito");
        })
        .catch( (error) => {
            console.error("Error al actualizar start:", error);
        }) //Usamos update para actualizar solo el y no borrar lo que ua habia como nombre y mas 
        // y añadimos una propiedad extra "start" que es un booleano que indica si el juego ha comenzado o no
        
    },
    //--- quien gano Juez 
    whoWon (myMove: Move, opponentMove: Move){
        const gane = [
            {myMove: "piedra", opponentMove: "tijera"},
            {myMove: "papel", opponentMove: "piedra"},
            {myMove: "tijera", opponentMove: "papel"},
        ]
        const win = gane.find( m => m.myMove === myMove && m.opponentMove === opponentMove);
        
        if(win) return "wins";
        if(myMove === opponentMove) return "draw";
        return "lose";
    },
    //limpiamos el estado antes de volver a empezar
    restart(){
        const cs = this.getState();
        const ref = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/online/" + cs.userId);
        
        // Borramos 'start' y 'choice' (reseteamos)
        ref.update({ 
            start: false,
            choice: "" 
        });
    },
    updateScore(result: "wins" | "draw" | "lose"){
        const cs = this.getState();
        const currentScore = cs.score;

        //modificamos el score local para no tener errores
        currentScore[result] = currentScore[result] + 1;

        //Hacemos referencia a la sala con el id  y el id del usuario 
        const ref = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/online/" + cs.userId);
        //Actualizamos el campo "score" 
        ref.update({
            score: currentScore
        });

        //actualizamos el state local
        cs.score = currentScore;
        this.setState(cs);
    
    }
}


export {state};