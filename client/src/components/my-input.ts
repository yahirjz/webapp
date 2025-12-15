export function initMyInput(){
    class MyInput extends HTMLElement{
        shadow = this.attachShadow({mode: "open"});
        constructor(){
            super();
        }
        connectedCallback(){
            this.render();
        }
        get value(){
            const input = this.shadow.querySelector('input');
            return input?.value;
        }
        render(){
            this.shadow.innerHTML = `
            <style>
            .my-input_container{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 25px 10px 0 10px;
            }
            .my-input{
                width: 305px;
                height: 70px;
                border: 2px solid #000;
                border-radius: 10px;
            }
            </style>
            <div class="my-input_container">
                <label><slot></slot></label>
                <input class="my-input">
            </div>`

        }
    }
    customElements.define("my-input", MyInput);
}