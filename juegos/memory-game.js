// ====================================================
// MANUEL CERVANTES GONZÁLEZ - JUEGO DE MEMORIA
// ====================================================
// LOLSITO - Memory Game para Modelos de Calidad

class MemoryGame {
    constructor(containerId, onCompleteCallback) {
        this.container = document.getElementById(containerId);
        this.onComplete = onCompleteCallback;
        this.cards = [];
        this.flippedCards = [];
        this.locked = false;
        this.matches = 0;
        this.totalPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        
        // Datos del juego - Pares de conceptos
        this.pairs = [
            { id: 1, concept: "ISO 25010", definition: "8 características de calidad" },
            { id: 2, concept: "CMMI", definition: "5 niveles de madurez" },
            { id: 3, concept: "McCall", definition: "11 factores de calidad" },
            { id: 4, concept: "QC", definition: "Control de Calidad - Encontrar defectos" },
            { id: 5, concept: "QA", definition: "Aseguramiento de Calidad - Prevenir defectos" },
            { id: 6, concept: "Scrum", definition: "Metodología ágil con sprints" },
            { id: 7, concept: "Kanban", definition: "Metodología de flujo continuo" },
            { id: 8, concept: "Cascada", definition: "Metodología secuencial" },
            { id: 9, concept: "SUS", definition: "Escala de Usabilidad del Sistema" },
            { id: 10, concept: "JMeter", definition: "Herramienta de pruebas de carga" },
            { id: 11, concept: "Selenium", definition: "Automatización de pruebas UI" },
            { id: 12, concept: "JUnit", definition: "Pruebas unitarias en Java" }
        ];
        
        this.totalPairs = this.pairs.length;
        this.init();
    }
    
    init() {
        this.buildCards();
        this.shuffleCards();
        this.render();
        this.startTimer();
        this.updateStats();
    }
    
    buildCards() {
        // Crear dos cartas por cada par (concepto y definición)
        this.pairs.forEach(pair => {
            this.cards.push({
                id: pair.id,
                type: 'concept',
                text: pair.concept,
                matched: false,
                pairId: pair.id
            });
            this.cards.push({
                id: pair.id,
                type: 'definition',
                text: pair.definition,
                matched: false,
                pairId: pair.id
            });
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    render() {
        if (!this.container) return;
        
        let html = `
            <div style="margin-bottom: 20px; text-align: center;">
                <div class="memory-stats" style="display: flex; justify-content: space-between; max-width: 400px; margin: 0 auto; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 12px;">
                    <span>🎯 Movimientos: <strong id="memoryMoves">0</strong></span>
                    <span>⏱️ Tiempo: <strong id="memoryTimer">00:00</strong></span>
                    <span>✅ Parejas: <strong id="memoryMatches">0</strong> / ${this.totalPairs}</span>
                </div>
            </div>
            <div class="memory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 600px; margin: 0 auto;">
        `;
        
        this.cards.forEach((card, index) => {
            const isFlipped = this.flippedCards.includes(index) || card.matched;
            html += `
                <div class="memory-card ${card.matched ? 'matched' : ''}" data-index="${index}" style="
                    background: ${card.matched ? 'var(--success)' : (isFlipped ? 'var(--accent)' : 'var(--secondary)')};
                    aspect-ratio: 1;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: ${card.matched ? 'default' : 'pointer'};
                    font-size: 0.8rem;
                    text-align: center;
                    padding: 8px;
                    transition: all 0.3s;
                    transform: ${isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'};
                    opacity: ${card.matched ? '0.7' : '1'};
                ">
                    ${isFlipped ? card.text : '?'}
                </div>
            `;
        });
        
        html += `</div>`;
        this.container.innerHTML = html;
        
        // Agregar event listeners
        document.querySelectorAll('.memory-card').forEach(card => {
            if (!card.classList.contains('matched')) {
                card.addEventListener('click', () => this.flipCard(parseInt(card.dataset.index)));
            }
        });
    }
    
    flipCard(index) {
        if (this.locked) return;
        if (this.flippedCards.includes(index)) return;
        if (this.cards[index].matched) return;
        
        this.flippedCards.push(index);
        this.moves++;
        this.updateStats();
        
        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
        
        this.render();
    }
    
    checkMatch() {
        const card1 = this.cards[this.flippedCards[0]];
        const card2 = this.cards[this.flippedCards[1]];
        
        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
            // Match correcto
            card1.matched = true;
            card2.matched = true;
            this.matches++;
            this.flippedCards = [];
            this.updateStats();
            
            if (this.matches === this.totalPairs) {
                this.gameComplete();
            }
            this.render();
        } else {
            // No hay match
            this.locked = true;
            setTimeout(() => {
                this.flippedCards = [];
                this.locked = false;
                this.render();
            }, 800);
        }
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (this.matches === this.totalPairs) return;
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timerDisplay = document.getElementById('memoryTimer');
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    updateStats() {
        const movesDisplay = document.getElementById('memoryMoves');
        const matchesDisplay = document.getElementById('memoryMatches');
        if (movesDisplay) movesDisplay.textContent = this.moves;
        if (matchesDisplay) matchesDisplay.textContent = `${this.matches} / ${this.totalPairs}`;
    }
    
    gameComplete() {
        clearInterval(this.timerInterval);
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let message = '';
        let emoji = '';
        
        if (this.moves <= this.totalPairs * 1.5) {
            emoji = '🏆';
            message = '¡Excelente memoria! Eres un experto en calidad de software.';
        } else if (this.moves <= this.totalPairs * 2) {
            emoji = '👍';
            message = '¡Muy bien! Sigue practicando para mejorar tu tiempo.';
        } else {
            emoji = '📚';
            message = 'Buen intento. Repasa los conceptos y vuelve a intentarlo.';
        }
        
        setTimeout(() => {
            alert(`🎉 ¡Juego completado! 🎉\n\n${emoji} ${message}\n\n📊 Estadísticas:\n• Movimientos: ${this.moves}\n• Tiempo: ${timeStr}\n• Parejas: ${this.matches}/${this.totalPairs}`);
            
            if (this.onComplete) {
                this.onComplete({ moves: this.moves, time: timeStr, matches: this.matches });
            }
        }, 200);
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.cards = [];
        this.flippedCards = [];
        this.locked = false;
        this.matches = 0;
        this.moves = 0;
        this.buildCards();
        this.shuffleCards();
        this.startTimer();
        this.updateStats();
        this.render();
    }
}

// Función para inicializar el juego de memoria en el modal de modelos
function initMemoryGame() {
    const memoryContainer = document.getElementById('memoryGame');
    if (memoryContainer && !window.memoryGameInstance) {
        window.memoryGameInstance = new MemoryGame('memoryGame', (result) => {
            console.log('Juego de memoria completado:', result);
        });
    }
}

// Reiniciar juego
function resetMemoryGame() {
    if (window.memoryGameInstance) {
        window.memoryGameInstance.reset();
    }
}

// Exportar para uso global
window.MemoryGame = MemoryGame;
window.initMemoryGame = initMemoryGame;
window.resetMemoryGame = resetMemoryGame;