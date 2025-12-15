import { state } from "../../state";
export function initNewGame(){
    const newGame = document.createElement('div');
    newGame.innerHTML =`
      <style> 
          .welcome__container{
          display: flex;
          flex-direction: column;
          justify-content: center; /* Opcional: para centrar el título si el contenedor es más ancho */
          align-items: center;
          margin: 115px 0 0 0;
          }

          .form{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          }
   </style>
        <div class = "welcome__container">
        <my-title></my-title>
        <div class ="form">
            <my-input></my-input>
            <my-button class="blue" destino="game">Nombre</my-button>
        </div>
      </div>
    `;

      const button = newGame.querySelector('my-button') as HTMLButtonElement;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const input = newGame.querySelector('my-input') as HTMLInputElement;
        const name = input.value;
        state.setName(name)?.then(() => {
             return state.askNewRoom();
        })
        .then((data) =>{
          // Ahora data trae el roomId y rtdbRoomId, así que lo usamos directo
          return state.accessToRoom(data.id);
        })
        .then(() => {
            const event = new CustomEvent('route', {
              detail: { route: '/wait' }
            })
            window.dispatchEvent(event);
        }); 
      })

    return newGame;
}
