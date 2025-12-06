import { initPageWelcome } from "./pages/welcome/welcome.ts";
const router = [
    { path: '/', component: initPageWelcome}
];

export function initRouter(container: Element){ // recibira un elemento HTML
    function handleRouter(route: string){
        console.log("El router recibió una nueva ruta", route)
        //Recorremos el array  de las rutas buscando cuál path coincide con la ruta recibida
        for(const r of router){
            if(r.path === route){ //Si coincide, ejecutamos el componente
                const el = r.component(); // Ejecutamos la función que crea la página 
            
            if(container.firstChild){
                container.firstChild.remove(); //Borramos el anterior
            }
            container.appendChild(el); //Agregamos el nuevo
            }
        }
    }
    handleRouter(window.location.pathname);
}