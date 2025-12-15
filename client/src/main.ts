import { state } from "./state";
import { initRouter } from "./router";
import { initMyButton } from "./components/my-button";
import { initMyTitle } from "./components/my-titlte";
import { initMyInput } from "./components/my-input";
import { initCountdown } from "./components/my-countdown";

(function(){
    state.init();
    initMyButton();
    initMyTitle();
    initMyInput();
    initCountdown();
    const root = document.querySelector('#app');
    if(root){
        initRouter(root!);
    }
})();