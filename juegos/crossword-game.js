// ====================================================
// MANUEL CERVANTES GONZÁLEZ - JUEGO DE CRUCIGRAMA
// ====================================================
// LOLSITO - Crossword Game para Calidad de Software

class CrosswordGame {
    constructor(containerId, onCompleteCallback) {
        this.container = document.getElementById(containerId);
        this.onComplete = onCompleteCallback;
        this.grid = [];
        this.words = [];
        this.answers = {};
        this.userAnswers = {};
        this.rows = 12;
        this.cols = 12;
        this.correctCount = 0;
        this.totalWords = 0;
        
        this.initWords();
        this.buildGrid();
        this.render();
    }
    
    initWords() {
        this.words = [
            { word: "CALIDAD", clue: "Grado en que un software cumple requisitos y expectativas", row: 1, col: 1, direction: "across", length: 7, answered: false },
            { word: "PRUEBAS", clue: "Actividades para encontrar defectos en el software", row: 3, col: 1, direction: "across", length: 7, answered: false },
            { word: "CMMI", clue: "Modelo de madurez de procesos con 5 niveles", row: 5, col: 1, direction: "across", length: 4, answered: false },
            { word: "SCRUM", clue: "Metodología ágil con sprints de 1-4 semanas", row: 7, col: 1, direction: "across", length: 5, answered: false },
            { word: "BOEHM", clue: "Autor de la ley sobre costo exponencial de errores", row: 9, col: 1, direction: "across", length: 5, answered: false },
            { word: "ISO", clue: "Organización internacional de normalización", row: 2, col: 5, direction: "down", length: 3, answered: false },
            { word: "SUS", clue: "Escala para medir usabilidad del sistema", row: 4, col: 4, direction: "down", length: 3, answered: false },
            { word: "JMETER", clue: "Herramienta de pruebas de carga y rendimiento", row: 6, col: 3, direction: "down", length: 6, answered: false },
            { word: "SELENIUM", clue: "Herramienta de automatización de pruebas web", row: 8, col: 2, direction: "down", length: 8, answered: false },
            { word: "KANBAN", clue: "Metodología de flujo continuo con límites WIP", row: 10, col: 1, direction: "across", length: 6, answered: false }
        ];
        
        this.totalWords = this.words.length;
    }
    
    buildGrid() {
        // Inicializar grid vacío
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(''));
        
        // Colocar palabras en el grid
        this.words.forEach(word => {
            let r = word.row - 1;
            let c = word.col - 1;
            
            for (let i = 0; i < word.length; i++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.grid[r][c] === '') {
                        this.grid[r][c] = word.word[i];
                    }
                }
                if (word.direction === 'across') {
                    c++;
                } else {
                    r++;
                }
            }
        });
    }
    
    render() {
        if (!this.container) return;
        
        let html = `
            <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                <div style="overflow-x: auto;">
                    <div class="crossword-grid" style="display: grid; grid-template-columns: repeat(${this.cols}, 45px); gap: 3px; background: var(--card-bg); padding: 15px; border-radius: 12px;">
        `;
        
        // Renderizar grid
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cellValue = this.grid[i][j];
                const cellId = `${i}-${j}`;
                const userValue = this.userAnswers[cellId] || '';
                const isEditable = cellValue !== '';
                
                if (isEditable) {
                    html += `
                        <div style="position: relative;">
                            <input type="text" id="cell-${cellId}" maxlength="1" value="${userValue}" style="
                                width: 45px;
                                height: 45px;
                                text-align: center;
                                font-size: 1.2rem;
                                font-weight: bold;
                                background: var(--primary-light);
                                border: 2px solid ${userValue.toUpperCase() === cellValue ? 'var(--success)' : 'var(--border)'};
                                border-radius: 8px;
                                color: white;
                                text-transform: uppercase;
                                font-family: monospace;
                            ">
                        </div>
                    `;
                } else {
                    html += `<div style="width: 45px; height: 45px; background: rgba(0,0,0,0.3); border-radius: 8px;"></div>`;
                }
            }
        }
        
        html += `
                    </div>
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <div style="background: var(--card-bg); padding: 15px; border-radius: 12px;">
                        <h4 style="color: var(--accent-glow); margin-bottom: 15px;">📋 Pistas</h4>
                        <div style="max-height: 400px; overflow-y: auto;">
        `;
        
        // Pistas horizontales
        const acrossWords = this.words.filter(w => w.direction === 'across');
        if (acrossWords.length > 0) {
            html += `<p><strong>➡️ Horizontales:</strong></p>`;
            acrossWords.forEach((word, idx) => {
                const isAnswered = word.answered;
                html += `
                    <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                        <span class="badge" style="background: ${isAnswered ? 'var(--success)' : 'var(--secondary)'}; width: 30px;">${idx + 1}</span>
                        <span style="flex: 1; ${isAnswered ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${word.word.length} letras: ${word.clue}</span>
                        ${isAnswered ? '<span style="color: var(--success);">✓</span>' : ''}
                    </div>
                `;
            });
        }
        
        // Pistas verticales
        const downWords = this.words.filter(w => w.direction === 'down');
        if (downWords.length > 0) {
            html += `<p style="margin-top: 15px;"><strong>⬇️ Verticales:</strong></p>`;
            downWords.forEach((word, idx) => {
                const isAnswered = word.answered;
                html += `
                    <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                        <span class="badge" style="background: ${isAnswered ? 'var(--success)' : 'var(--secondary)'}; width: 30px;">${acrossWords.length + idx + 1}</span>
                        <span style="flex: 1; ${isAnswered ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${word.word.length} letras: ${word.clue}</span>
                        ${isAnswered ? '<span style="color: var(--success);">✓</span>' : ''}
                    </div>
                `;
            });
        }
        
        html += `
                        </div>
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="fill-btn" id="checkCrossword" style="background: var(--success);">✅ Verificar respuestas</button>
                        <button class="fill-btn" id="resetCrossword" style="background: var(--warning); color: black;">🔄 Reiniciar</button>
                        <button class="fill-btn" id="revealCrossword" style="background: var(--info);">🔍 Revelar una letra</button>
                    </div>
                    <div id="crosswordResult" style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; text-align: center;">
                        <strong>Progreso:</strong> <span id="crosswordProgress">0</span> / ${this.totalWords} palabras
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Agregar event listeners a los inputs
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] !== '') {
                    const input = document.getElementById(`cell-${i}-${j}`);
                    if (input) {
                        input.addEventListener('input', (e) => {
                            const value = e.target.value.toUpperCase();
                            if (value.length > 0) {
                                this.userAnswers[`${i}-${j}`] = value.charAt(0);
                            } else {
                                delete this.userAnswers[`${i}-${j}`];
                            }
                            this.checkWordCompletion();
                            this.updateInputStyle(i, j);
                        });
                    }
                }
            }
        }
        
        // Botones
        const checkBtn = document.getElementById('checkCrossword');
        const resetBtn = document.getElementById('resetCrossword');
        const revealBtn = document.getElementById('revealCrossword');
        
        if (checkBtn) checkBtn.addEventListener('click', () => this.checkAll());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (revealBtn) revealBtn.addEventListener('click', () => this.revealLetter());
        
        this.updateProgress();
    }
    
    updateInputStyle(row, col) {
        const input = document.getElementById(`cell-${row}-${col}`);
        if (input) {
            const correctValue = this.grid[row][col];
            const userValue = this.userAnswers[`${row}-${col}`] || '';
            
            if (userValue.toUpperCase() === correctValue) {
                input.style.borderColor = 'var(--success)';
            } else if (userValue !== '') {
                input.style.borderColor = 'var(--error)';
            } else {
                input.style.borderColor = 'var(--border)';
            }
        }
    }
    
    checkWordCompletion() {
        // Verificar cada palabra
        this.words.forEach(word => {
            let completed = true;
            let r = word.row - 1;
            let c = word.col - 1;
            
            for (let i = 0; i < word.length; i++) {
                const cellId = `${r}-${c}`;
                const userValue = this.userAnswers[cellId];
                const correctValue = this.grid[r][c];
                
                if (!userValue || userValue.toUpperCase() !== correctValue) {
                    completed = false;
                    break;
                }
                
                if (word.direction === 'across') {
                    c++;
                } else {
                    r++;
                }
            }
            
            word.answered = completed;
        });
        
        this.updateProgress();
        this.render(); // Re-render para actualizar las pistas
    }
    
    updateProgress() {
        const correctWords = this.words.filter(w => w.answered).length;
        this.correctCount = correctWords;
        const progressSpan = document.getElementById('crosswordProgress');
        if (progressSpan) {
            progressSpan.textContent = `${correctWords} / ${this.totalWords}`;
        }
        
        if (correctWords === this.totalWords && this.totalWords > 0) {
            setTimeout(() => {
                alert('🎉 ¡Felicidades! Has completado el crucigrama correctamente. 🎉\n\n¡Excelente conocimiento de los términos de Calidad de Software!');
                if (this.onComplete) {
                    this.onComplete({ correct: correctWords, total: this.totalWords });
                }
            }, 200);
        }
    }
    
    checkAll() {
        let allCorrect = true;
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] !== '') {
                    const userValue = this.userAnswers[`${i}-${j}`];
                    const correctValue = this.grid[i][j];
                    
                    if (!userValue || userValue.toUpperCase() !== correctValue) {
                        allCorrect = false;
                    }
                }
            }
        }
        
        const resultDiv = document.getElementById('crosswordResult');
        if (allCorrect && this.correctCount === this.totalWords) {
            resultDiv.innerHTML = '<strong style="color: var(--success);">✅ ¡Excelente! Todas las palabras son correctas.</strong>';
        } else {
            const correctLetters = this.countCorrectLetters();
            const totalLetters = this.countTotalLetters();
            resultDiv.innerHTML = `<strong>🔍 Letras correctas: ${correctLetters} / ${totalLetters}</strong><br><small>Revisa las respuestas marcadas en rojo.</small>`;
        }
        
        this.checkWordCompletion();
    }
    
    countCorrectLetters() {
        let correct = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] !== '') {
                    const userValue = this.userAnswers[`${i}-${j}`];
                    if (userValue && userValue.toUpperCase() === this.grid[i][j]) {
                        correct++;
                    }
                }
            }
        }
        return correct;
    }
    
    countTotalLetters() {
        let total = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] !== '') {
                    total++;
                }
            }
        }
        return total;
    }
    
    revealLetter() {
        // Encontrar una letra no revelada
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] !== '') {
                    const cellId = `${i}-${j}`;
                    if (!this.userAnswers[cellId] || this.userAnswers[cellId].toUpperCase() !== this.grid[i][j]) {
                        this.userAnswers[cellId] = this.grid[i][j];
                        const input = document.getElementById(`cell-${i}-${j}`);
                        if (input) {
                            input.value = this.grid[i][j];
                            input.style.borderColor = 'var(--success)';
                        }
                        this.checkWordCompletion();
                        
                        const resultDiv = document.getElementById('crosswordResult');
                        resultDiv.innerHTML = '<strong style="color: var(--info);">🔍 Se ha revelado una letra.</strong>';
                        setTimeout(() => {
                            if (this.correctCount !== this.totalWords) {
                                resultDiv.innerHTML = `<strong>Progreso:</strong> ${this.correctCount} / ${this.totalWords} palabras`;
                            }
                        }, 2000);
                        return;
                    }
                }
            }
        }
        
        const resultDiv = document.getElementById('crosswordResult');
        resultDiv.innerHTML = '<strong style="color: var(--warning);">🎉 ¡Ya has completado todas las letras!</strong>';
    }
    
    reset() {
        this.userAnswers = {};
        this.words.forEach(word => {
            word.answered = false;
        });
        this.correctCount = 0;
        this.render();
    }
}

// Función para inicializar el crucigrama
function initCrosswordGame() {
    const crosswordContainer = document.getElementById('crosswordGame');
    if (crosswordContainer && !window.crosswordGameInstance) {
        window.crosswordGameInstance = new CrosswordGame('crosswordGame', (result) => {
            console.log('Crucigrama completado:', result);
        });
    }
}

// Exportar para uso global
window.CrosswordGame = CrosswordGame;
window.initCrosswordGame = initCrosswordGame;