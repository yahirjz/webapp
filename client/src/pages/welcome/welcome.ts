import { state } from "../../state";

export function initPageWelcome(){
   const welcome = document.createElement('div');
   welcome.innerHTML = `
   <h1 class="title"> Cargando...</h1>
   <form>
        <button type="submit">Comenzar</button>
   </form>
   ` 
   // nos suscribimos  cunado cambie el estado, actualize el H1
   state.subscribe((data: any) =>{
    const h1 = welcome.querySelector('.title');
    if(h1){
        h1.textContent = data.message; // actualizamos el texto del h1 
    }
   });
   
   const form = welcome.querySelector('form');
   form?.addEventListener('submit', (e) =>{
        e.preventDefault();
        // al hacer click, pedimos los datos del backend
        state.init();
   })
   return welcome;
}