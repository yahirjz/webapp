
export function initRooms(){
    const rooms = document.createElement('div');
    rooms.innerHTML = `
      <style> 
          .welcome__container{
          display: flex;
          flex-direction: column;
          justify-content: center; /* Opcional: para centrar el título si el contenedor es más ancho */
          align-items: center;
          margin: 115px 0 0 0;
          }

          .welcome__container-btn{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          }
   </style>
   
        <div class = "welcome__container">
            <my-title></my-title>
            <div class ="welcome__container-btn">
                <my-input></my-input>
                <my-button class="blue" destino="rules">ingresar a una sala</my-button>
            </div>
        </div>
    `;
    return rooms;
}