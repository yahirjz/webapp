import { state } from "../../state";

export function initResult(){
    const div = document.createElement('div');
    const s = state.getState();
    const rtdb = s.rtdbData;

    // 1. Averiguar quién es mi oponente y qué jugó
    let myMove = s.move;
    let opponentMove = "";

    if(s.userId == rtdb.playerOne && rtdb.playerTwo){
        const p2 = rtdb.online[rtdb.playerTwo];
        opponentMove = p2.choice;
    } else if(s.userId == rtdb.playerTwo && rtdb.playerOne){
        const p1 = rtdb.online[rtdb.playerOne];
        opponentMove = p1.choice;
    }

    // 2. Calcular resultado
    const result = state.whoWon(myMove, opponentMove as any);
    state.updateScore(result);
    const currentState = state.getState();
    const myScore = currentState.score;

    // 3. Definir estilos según el resultado
    let background = "";
    let displayText = "";

    if(result === "wins"){
        background = "rgba(136, 233, 168, 0.9)"; // Verde
        displayText = "Ganaste";
    } else if(result === "lose"){
        background = "rgba(137, 73, 73, 0.9)"; // Rojo
        displayText = "Perdiste";
    } else {
        background = "rgba(255, 233, 157, 0.9)"; // Amarillo/Naranja
        displayText = "Empate";
    }

    // Estilos CSS
    div.innerHTML = `
        <style>
            .result-page {
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: ${background};
            }
            .result-title {
                font-size: 80px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .score-text {
                font-size: 30px;
                margin-bottom: 40px;
            }
        </style>
        <div class="result-page">
            <h1 class="result-title">${displayText}</h1>
            <div class="score-text">
                Tu: ${myMove} <br>
                Oponente: ${opponentMove}
            </div>
            <p>
                Ganadas: ${myScore.wins} | 
                Perdidas: ${myScore.lose} | 
                Empatadas: ${myScore.draw}
            </p>
            <my-button>Volver a Jugar</my-button>
        </div>
    `;

    // 4. Botón volver a jugar
    const btn = div.querySelector("my-button");
    btn?.addEventListener("click", () => {
        /// Reseteamos el estado de RTDB
        state.restart();
         
         const event = new CustomEvent('route', { detail: { route: '/wait' } });
         window.dispatchEvent(event);
    });

    return div;
}