export function initCountdown(){
    class Countdown extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        
        constructor() {
            super();
        }

        connectedCallback() {
            this.render();
            this.startCountdown();
        }

        startCountdown() {
            let counter = 3;
            const intervalId = setInterval(() => {
                const countEl = this.shadow.querySelector('.countdown-number');
                if (countEl) {
                    countEl.textContent = counter.toString();
                }
                
                if (counter === 0) {
                    clearInterval(intervalId);
                    this.dispatchEvent(new CustomEvent('countdown-finished', {
                        bubbles: true,
                        composed: true
                    }));
                }
                counter--;
            }, 1000);
        }

        render() {
            this.shadow.innerHTML = `
            <style>
                .countdown-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: var(--font, sans-serif);
                    font-size: 100px;
                    font-weight: bold;
                    color: white; /* Asumiendo tema oscuro */
                }
            </style>
            <div class="countdown-container">
                <span class="countdown-number">Starting...</span>
            </div>
            `;
        }
    }
    customElements.define('my-contador', Countdown);
}
