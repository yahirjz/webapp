import { state } from "../../state";    
export function initGame(){
    const game = document.createElement('div');
    const rockUrl = new URL('../../img/piedra.svg', import.meta.url).href;
    const paperUrl = new URL('../../img/papel.svg', import.meta.url).href;
    const scissorUrl = new URL('../../img/tijera.svg', import.meta.url).href;
    const currentState = state.getState();

    game.className = 'play-page';
    game.innerHTML = `
    <style>
    .play-page{
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        padding-top: 40px;
        row-gap: 150px;
    }
    .hands-title{
        margin: 0;
        color: #000;
        font-family: var(--font);
        font-size: 60px;
        font-weight: 700;
    }

    .hands-container{
        display: flex;
        column-gap: 50px;
    }
    .play-text{
        opacity: 0;
    }
    .hand-img{
        width: 100px; 
        height: auto;
    }
    .hand-img:hover{
        transform: translateY(-10px);
        filter: drop-shadow(
            0 0 15px rgba(17, 54, 141, 0.96)
        )
    }
    .container-hand-paper{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 15px;
    }
    .container-hand-paper:hover .play-text{
        color:#fff;
        opacity: 1;
        font-size: 22px;
        font-family: var(--font);
        font-weight: 700;
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
            font-size: 22px;
            font-weight: 700;
    }

    </style>

    <div class ="play-page__header">
        <h2>Sala: ${currentState.roomId}</h2>
        <h2>Usuario: ${currentState.name}</h2>
    </div>
      <div class="play-page__content">
            <!-- El contador se mostrará aquí cuando el usuario elija una mano -->
        </div>
        <p class ="hands-title"> Elige una opción</p>
        <div class="hands-container">

             <!--contenedor de piedra-->
            <div class = "container-hand-paper">
            <img src="${rockUrl}" class="hand-img" data-move="piedra" alt="Piedra">
            <span class ="play-text">Piedra</span>
            </div>

             <!--contenedor de papel-->
            <div class = "container-hand-paper">
            <img src="${paperUrl}" class="hand-img" data-move="papel" alt="Papel">
            <span class ="play-text">Papel</span>
            </div>
            
            <!--contenedor de tijera-->
            <div class = "container-hand-paper">
            <img src="${scissorUrl}" class="hand-img" data-move="tijera" alt="Tijera">
            <span class ="play-text">Tijera</span>
            </div>
        </div>
   

    `;
    
    // Lógica del juego
    const handImages = game.querySelectorAll('.hand-img');
    const handsContainerEl = game.querySelector('.hands-container') as HTMLElement;
    const text = game.querySelector('.hands-title') as HTMLElement;
    const contentEl = game.querySelector('.play-page__content');

    type Move = "piedra" | "papel" | "tijera";

    handImages.forEach(hand => {
        hand.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            //Buscamos el dato del movimineto 
            const userMove = target.dataset.move as Move;

            //enviamos la jugada al state
            state.setMove(userMove);
            
            //indicamos la espera en la UI
            handsContainerEl.style.display = 'none';
            text.textContent = 'Esperando al oponente...';

        });
    });

    state.subscribe(() => {
        if(!document.body.contains(game)) return;
        const cs = state.getState();
        const rtdb = cs.rtdbData;
        
        if(rtdb && rtdb.online && rtdb.playerOne && rtdb.playerTwo){
            const p1 = rtdb.online[rtdb.playerOne];
            const p2 = rtdb.online[rtdb.playerTwo];

            //Si ambos tiene choice (eleción)
            if(p1 && p1.choice && p2 && p2.choice){
                //envitamos que se ejecute 20 veces solo si no ahi contador aun
                if(contentEl?.children.length === 0){
                    text.style.display = 'none'; // ocultamos el mensaje de espera

                    const contadorEl = document.createElement('my-contador');
                    contentEl?.appendChild(contadorEl);

                    contadorEl.addEventListener('countdown-finished', () => {
                        // Navegar a la página de resultados usando el evento personalizado
                        const event = new CustomEvent('route', { detail: { route: '/result' } });
                        window.dispatchEvent(event);
                    });
                }
            }
        }
    })

    return game;
}