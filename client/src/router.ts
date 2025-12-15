import { initPageWelcome } from "./pages/welcome/welcome.ts";
import { initNewGame } from "./pages/new-game/NewGame.ts";
import { initRooms } from "./pages/rooms/Rooms.ts";
import { initSala } from "./pages/sala/sala.ts"; 
import { initGame } from "./pages/Game/Game.ts";
import { initResult } from "./pages/result/result.ts";
import { initWait } from "./pages/Wait/Wait.ts";

const router = [
    { path: '/', component: initPageWelcome},
    { path: '/new-game', component: initNewGame},
    { path: '/rooms', component: initRooms},
    { path: '/sala', component: initSala},
    { path: '/game', component: initGame},
    { path: '/result', component: initResult},
    { path: '/wait', component: initWait}
];

export function initRouter(container: Element){ // recibira un elemento HTML
    
    function handleRouter(route: string){
        console.log("El router recibió una nueva ruta", route);

        // Actualizamos el historial del navegador solo si no es un popstate (back/forward)
        // Pero para simplificar, asumiremos que quien llame a esto puede gestionar el pushState
        // O mejor: Lo gestionamos aquí si no coincide con el location actual?
        
        // Mejor estrategia: Escuchar un evento para navegar
       
        for(const r of router){
             if(r.path === route){
                const el = r.component(); 
            
            if(container.firstChild){
                container.firstChild.remove();
            }
            container.appendChild(el);
            }
        }
    }
    
    // Manejar el historial (atrás/adelante)
    if(location.pathname == "/"){
        handleRouter("/");
    }else{
        handleRouter(location.pathname);
    }
 

    window.onpopstate = () => {
        handleRouter(location.pathname);
    };

    // Escuchar evento personalizado para navegación interna
    /* 
       Cómo usar: 
       const event = new CustomEvent('route', { detail: { route: '/nuevo-path' } });
       window.dispatchEvent(event);
    */
    window.addEventListener("route", (e: any) => {
        const route = e.detail.route;
        
        // Push state para cambiar la URL
        // Verificamos que sea distinta para no ensuciar el historial inecesariamente
        if (window.location.pathname !== route) {
             history.pushState({}, "", route);
        }
        
        handleRouter(route);
    });
}