export function initMyTitle(){
    class MyTitle extends HTMLElement{
        shadow = this.attachShadow({mode: "open"});
        constructor(){
            super();
        }
        connectedCallback(){
            this.render();
        }
        render(){
            this.shadow.innerHTML = `
            <style>
                .welcome__title{
                    color: var(--color-B);
                    margin: 0;
                    font-family: var(--font);
                    text-align: center; /* Centra el texto de cada línea */
                    font-size: 80px;
                    font-weight: 700;
                    color:  #5f95e7;
                }

                .welcome__title .title-word {
                    display: block; /* Hace que cada span ocupe una línea nueva */
                }
                .welcome__title .colored {
                    color: var(--color-N); /* Aplica el color oscuro a la palabra "Papel" */
                }
            </style>
            <h1 class ="welcome__title">
                <span class="title-word">Piedra</span>
                <span class="title-word colored">Papel</span>
                <span class="title-word">Tijera</span>
            </h1>
            `
        }
    }
    
    customElements.define("my-title", MyTitle);
}