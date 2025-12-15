
export function initPageWelcome(){
   const welcome = document.createElement('div');
   welcome.innerHTML = `
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
          <my-button id="new-game" class="blue" destino="new-game">Nuevo Juego</my-button>
          <my-button id="sala" class="blue" destino="sala">Ingresar a una sala</my-button>
        </div>
   </div>
   ` ;

   const btn = welcome.querySelector('#new-game') as HTMLButtonElement;
          btn.addEventListener('navigate', (e : any) =>{
               const route = e.detail.to;
               // Creamos y disparamos el evento que escuchará el router
               // Nota: Asumimos que los destinos en el HTML no tienen slash inicial, así que lo agregamos
               // O si ya lo tienen, lo respetamos. En tu caso "new-game" necesita slash.
               const finalRoute = route.startsWith('/') ? route : '/' + route;
               
               const event = new CustomEvent('route', { detail: { route: finalRoute } });
               window.dispatchEvent(event);
          })
     

   const btnJoin = welcome.querySelector('#sala ') as HTMLButtonElement;
   btnJoin.addEventListener('click', () => {
    const event = new CustomEvent('route', { detail: { route: '/sala' } });
    window.dispatchEvent(event);
   })
   return welcome;
}
