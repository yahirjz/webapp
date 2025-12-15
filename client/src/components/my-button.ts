export function initMyButton(){
    // 1. DEFINICIÓN DE LA CLASE DEL COMPONENTE
    // Creamos una clase que hereda de HTMLElement. Esta es la base de todo Web Component.
    // El navegador tratará cualquier etiqueta <my-button> como una instancia de esta clase.
    class MyButton extends HTMLElement{
        // 2. CREACIÓN DEL SHADOW DOM
        // El Shadow DOM es un "DOM encapsulado" para nuestro componente.
        // Los estilos y elementos aquí dentro no afectan ni son afectados por el exterior.
        // 'mode: "open"' nos permite acceder al shadow DOM desde JavaScript (si es necesario).
        shadow = this.attachShadow({mode: "open"});

        // 3. OBSERVANDO ATRIBUTOS
        // Esta función estática es crucial. Le dice al componente qué atributos HTML
        // debe "observar". Si uno de estos atributos cambia, se activará el método 'attributeChangedCallback' (si existiera).
        // Aquí, le decimos que preste atención a 'destino' y 'class' para que pueda reaccionar a sus valores.
            static get observedAttributes(): string[]{
                return ['destino', 'class'];
            }
        constructor(){
            // El constructor siempre debe llamar a 'super()' primero.
            // Es el punto de partida cuando se crea una instancia del componente.
            super(); 
        }

        // 4. CICLO DE VIDA: connectedCallback
        // Este método se llama automáticamente cuando el componente es insertado en el DOM (en la página).
        // Es el lugar perfecto para hacer el renderizado inicial.
        connectedCallback(){
            const atribute =this.getAttribute("class");
            this.render(atribute);
        }

        // 5. MÉTODO DE RENDERIZADO
        // Creamos este método para generar el HTML y CSS internos del componente.
        // Recibe el valor del atributo 'class' para decidir qué estilo aplicar.
        render(atribute:string| null){
            // Lógica para estilos dinámicos:
            // Dependiendo de si la clase es "blue", elegimos un conjunto de estilos u otro.
            let btnStyle = ` background: white; border: solid 3px #000; color:#000;`
            let btnHover = `
                 background: #fff ;
                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            `
            if(atribute === "blue"){
                btnStyle = `
                    background:#006CFC;
                    border-style:none;
                    color:#fff;
                    transition: background 0.3s ease;
                `
                btnHover = `
                background: #0681ff ;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            `
            }

            // Inyectamos el HTML y el CSS en el Shadow DOM.
            // La etiqueta <style> aquí dentro solo afecta a este componente.
            // La etiqueta <slot> es un marcador de posición. El texto que pongas
            // entre <my-button> y </my-button> (ej: "Comenzar") se insertará aquí.
            this.shadow.innerHTML = `
                <style>
                    button{
                        ${btnStyle}
                        border-radius:10px;
                        width:322px;
                        height:87px;
                        font-family:'Roboto',san serif;
                        font-size:30px;
                        font-weight:400;
                        margin-top:50px;
                        cursor:pointer;
                    }
                    button:hover{
                        ${btnHover}
                    } 
                </style>
                <button><slot></slot></button>
            `
            // 6. AÑADIENDO EL LISTENER INTERNO
            // Después de crear el botón, lo buscamos dentro de nuestro Shadow DOM.
            const button = this.shadow.querySelector('button');
            if(button){
                // Le añadimos un 'event listener' para el clic. Cuando se haga clic,
                // se llamará al método 'handleClick' de este mismo componente.
                // .bind(this) asegura que dentro de 'handleClick', 'this' siga siendo el componente.
                button.addEventListener('click' , this.handleClick.bind(this));
            }
        }

        // 7. EL CORAZÓN DE LA COMUNICACIÓN: handleClick
        // Este método se ejecuta cuando el usuario hace clic en el botón interno.
        handleClick(): void{
            // a. Leemos el valor del atributo 'destino' del propio componente.
            const destino = this.getAttribute('destino');

            if (destino) {
                // b. Creamos un EVENTO PERSONALIZADO (CustomEvent).
                //    - 'navigate': Es el nombre que le damos a nuestro evento.
                //    - 'detail': Es un objeto donde metemos la información que queremos enviar.
                //      En este caso, enviamos el valor de 'destino'.
                const event = new CustomEvent('navigate', { detail: { to: destino } });
                
                // c. DESPACHAMOS (disparamos) el evento.
                //    El componente "anuncia" al exterior que ha ocurrido algo.
                //    No sabe ni le importa quién lo escuchará.
                this.dispatchEvent(event);
            }
        }
    }
    // 8. REGISTRO DEL COMPONENTE
    // Finalmente, le decimos al navegador que la etiqueta HTML "my-button"
    // debe ser manejada por nuestra clase 'MyButton'. Sin esto, el navegador
    // no sabría qué hacer con <my-button>.
    customElements.define("my-button",MyButton);
}