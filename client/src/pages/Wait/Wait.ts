import { state } from "../../state";
export function initWait(){
    const wait = document.createElement('div');
    const currentState = state.getState();
    const score = currentState.score;

    wait.className = 'wait-page';
    wait.innerHTML = `
    <style>
    .wait-page{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }
    .play-page__header{
        width: 100%;
        display: flex;
        flex-direction: column;
        color: #000;
    }
    .play-page__header h2{
        margin: 5px 20px;
        font-family: var(--font);
        font-size: 16px;
        font-weight: 700;
    }
    .wait-play, .wait-player{
        font-family: var(--font);
        font-size: 25px;
        font-weight: 700;
        text-align: center;
    }
    .wait-play{
        display: block;
    }
    .wait-player{
        display: none;
    }
    .play-page__content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 30%;
    }
    .player-one{
        margin-bottom: 5px;
    }
    .opponent{
        margin-bottom: 10px;
    }
    </style>

    <div class ="play-page__header">
        <h2>Sala: ${currentState.roomId}</h2>
        <p class = "player-one">Player One: ${currentState.name}</p>
        <p id = "score"> 
            Ganadas: ${score.wins} | 
            Perdidas: ${score.lose} | 
            Empatadas: ${score.draw}
        </p>
        <p id = "opponent" class = "opponent">Esperando oponente...</p>
    </div>
        <div class="play-page__content">
        <div id="wait-play" class = "wait-play">
            <p>Preciona el botón para Jugar y elige: Piedra, Papel o Tijera</p>
            <my-button id="wait-button" class = "blue"> Jugar! </my-button>
        </div>    
        <div id="wait-player" class = "wait-player">
            <p>Esperando a que otro jugador...</p>
        </div>
    </div>
    `;
    const btnPlay = wait.querySelector('#wait-button') as HTMLButtonElement;
    const waitPlay = wait.querySelector('#wait-play') as HTMLDivElement;
    const waitPlayer = wait.querySelector('#wait-player') as HTMLDivElement;
    
    btnPlay.addEventListener('click', () => {
        waitPlay.style.display = 'none';
        waitPlayer.style.display = 'block';

        //mandamos al server que estamos listos para jugar
        state.setStart(true);

    });

    //
    
    const renderState = () => {
        const opponent = wait.querySelector('#opponent') as HTMLParagraphElement;
      
        const s = state.getState();
        const rtdb = s.rtdbData;

        //Monstramos el nombre
        if(rtdb && Object.keys(rtdb).length > 0){
            // si el ususario es el player 1, el oponente es el player 2
            if(s.userId == rtdb.playerOne && rtdb.playerTwo){

                //Buscamos los datos online del otro jugador
                const p2 = rtdb.online ? rtdb.online[rtdb.playerTwo] : null;
                
                //Si tine nombre lo usamos sino usamos "Playe 2"
                const nameToShow = (p2 && p2.name) ? p2.name : "Player 2";

                opponent.textContent = `Oponente: Conectado ${nameToShow}`;
                opponent.style.color = (p2 && p2.online) ? "#28a745" : "#000";
                
                // si el ususario es el player 2, el oponente es el player 1
            }else if(s.userId == rtdb.playerTwo && rtdb.playerOne){
                const p1 = rtdb.online ? rtdb.online[rtdb.playerOne] : null;
                const nameToShow = (p1 && p1.name) ? p1.name : "Player 1";

                opponent.textContent = `Oponente: Conectado ${nameToShow}`;
                opponent.style.color = (p1 && p1.online) ? "#28a745" : "#000";
            }else{
                opponent.textContent = "Esperando oponente...";
                opponent.style.color = "#000";
            }
        }

        //Comprobamos si ambos jugadores estan listos para jugar
        if(rtdb.playerOne && rtdb.playerTwo && rtdb.online){
            const p1 = rtdb.online[rtdb.playerOne];
            const p2 = rtdb.online[rtdb.playerTwo];
            console.log("Player 1:", p1);
            console.log("Player 2:", p2);
            console.log("P1 Start:", p1?.start, "P2 Start:", p2?.start);
            //si ambos existen y ambos tienen start === true
            if(p1 && p1.start && p2 && p2.start){
                //redirigimos a la pagina de juego
                const event = new CustomEvent("route", {
                    detail: { route: '/game'}
                });
                window.dispatchEvent(event);
            }
        }
    }

    //Nos subscribimos para ejecutar siempre 
    state.subscribe(() => {
        if(!document.body.contains(wait)) return;
        renderState();
    });

    //ejecutamos al principio por si ahi datos
    renderState();
    return wait;
}