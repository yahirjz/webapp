import { initRouter } from "./router";

(function(){
    const root = document.querySelector('#app');
    if(root){
        initRouter(root!);
    }
})()