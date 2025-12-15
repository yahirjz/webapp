import { state } from "../../state";
export function initSala(){
    const sala = document.createElement('div');
   
    // Verificar si el usuario tiene nombre/id. Si no, redirigir.
    const currentState = state.getState();
    
    if(!currentState.userId){
         // Usamos un pequeño timeout para dar tiempo a que se renderice o se maneje el evento
         setTimeout(() => {
            const event = new CustomEvent('route', { detail: { route: '/' } });
            window.dispatchEvent(event);
            alert("Por favor, inicia sesión primero.");
         }, 0);
    }

    sala.innerHTML = `
    <style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .aviso {
        width: 350px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 20px;
        color: red;
        background-color: #f0f0f0da;
        padding: 10px;
        border-radius: 5px;
        display: none;
    }
    .username { 
        font-weight: bold; margin-top: 10px; 
    }
    .username-online { color: #28a745; 
    }  
    </style>
    <div class="container">
        <p class = "aviso">Esa sala no existe</p>
        <p id = "username" class = "username"></p>
        <my-title></my-title>
        <my-input></my-input>
        <my-button class = "blue" id = "join">Unirse a una sala</my-button>
    </div>
    `;
        
        const usernameEl = sala.querySelector('#username') as HTMLParagraphElement;
        state.subscribe(() => {
            const cs = state.getState();
            usernameEl.textContent = cs.name || '';
            if (cs.online) {
                usernameEl.classList.add('username-online');
            } else {
                usernameEl.classList.remove('username-online');
            }
        });

   const btnJoin = sala.querySelector('#join') as HTMLButtonElement;
   btnJoin.addEventListener('click', () =>{
    const input = sala.querySelector('my-input') as HTMLInputElement;
    const roomId = input.value;
    console.log(roomId);
    
    // LLamamos el state para que acceda a la sala
    const currentState = state.getState();
    console.log("Intentando acceder a sala:", roomId, "con userId:", currentState.userId);
    
    state.accessToRoom(roomId)?.then(() => {
        const event = new CustomEvent('route', {
            detail: {
                route: '/wait'
            }
        })
        window.dispatchEvent(event);
    })
    .catch(err => {
        // ¡Aquí cae la bomba si lanzamos el error!
        console.error("Error al acceder a la sala:", err);
        const aviso = sala.querySelector('.aviso') as HTMLParagraphElement;
        aviso.style.display = 'block';
    });
   })
    return sala;
}