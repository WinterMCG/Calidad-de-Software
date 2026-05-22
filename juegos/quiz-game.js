// ====================================================
// MANUEL CERVANTES GONZÁLEZ - JUEGO DE QUIZ RÁPIDO
// ====================================================
// LOLSITO - Quiz Game para Calidad de Software

class QuizGame {
    constructor(containerId, onCompleteCallback) {
        this.container = document.getElementById(containerId);
        this.onComplete = onCompleteCallback;
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.answered = false;
        this.timePerQuestion = 15;
        this.timer = null;
        this.streak = 0;
        
        this.initQuestions();
        this.totalQuestions = this.questions.length;
        this.render();
    }
    
    initQuestions() {
        this.questions = [
            {
                text: "¿Qué significa QC en calidad de software?",
                options: ["Quality Code", "Quality Control", "Quick Check", "Query Command"],
                correct: 1,
                explanation: "QC = Quality Control (Control de Calidad), enfocado en encontrar defectos."
            },
            {
                text: "¿Cuál es el nivel más alto de CMMI?",
                options: ["Definido", "Gestionado", "Cuantitativo", "Optimizado"],
                correct: 3,
                explanation: "Nivel 5 es 'Optimizado', con mejora continua basada en datos."
            },
            {
                text: "Según la Ley de Boehm, ¿cuánto cuesta corregir un error en producción?",
                options: ["5x más", "15x más", "30x más", "100x más"],
                correct: 3,
                explanation: "100 veces más caro que en requisitos, según estudios de Barry Boehm."
            },
            {
                text: "¿Qué característica NO está en ISO 25010?",
                options: ["Usabilidad", "Popularidad", "Seguridad", "Portabilidad"],
                correct: 1,
                explanation: "Popularidad no es una característica de calidad en ISO 25010."
            },
            {
                text: "¿Qué técnica de caja negra prueba valores en los bordes?",
                options: ["Particiones", "Valores límite", "Tablas decisión", "Cobertura ramas"],
                correct: 1,
                explanation: "Análisis de valores límite prueba justo en los bordes."
            },
            {
                text: "¿Qué relación UML es OBLIGATORIA?",
                options: ["Extend", "Include", "Generalización", "Asociación"],
                correct: 1,
                explanation: "«include» es obligatorio; «extend» es opcional bajo condición."
            },
            {
                text: "¿Qué tipo de prueba verifica cambios no rompan?",
                options: ["Unitaria", "Integración", "Regresión", "Humo"],
                correct: 2,
                explanation: "Regresión: verifica que cambios no afecten funcionalidades existentes."
            },
            {
                text: "¿Qué herramienta es estándar para pruebas de carga?",
                options: ["Selenium", "JUnit", "JMeter", "Postman"],
                correct: 2,
                explanation: "Apache JMeter es el estándar para pruebas de carga y rendimiento."
            },
            {
                text: "¿Qué accidente fue por confusión de unidades?",
                options: ["Patriot", "Mars Orbiter", "Therac-25", "Ariane 5"],
                correct: 1,
                explanation: "Mars Climate Orbiter: confusión entre newtons y libras-fuerza."
            },
            {
                text: "¿Qué significa SUS en usabilidad?",
                options: ["System Usability Scale", "Standard User Score", "Software Usability Test", "Simple UX Scale"],
                correct: 0,
                explanation: "SUS = System Usability Scale, cuestionario de 10 preguntas."
            }
        ];
    }
    
    render() {
        if (!this.container) return;
        
        if (this.currentIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }
        
        const q = this.questions[this.currentIndex];
        const progressPercent = ((this.currentIndex) / this.totalQuestions) * 100;
        
        let html = `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span class="badge" style="background: var(--info);">📝 Quiz Rápido</span>
                    <span class="badge" style="background: var(--accent);">⭐ Puntuación: ${this.score}</span>
                    <span class="badge" style="background: var(--warning); color: black;">🔥 Racha: ${this.streak}</span>
                </div>
                <div style="background: rgba(0,0,0,0.3); border-radius: 10px; height: 8px; margin: 15px 0;">
                    <div style="background: var(--accent); width: ${progressPercent}%; height: 8px; border-radius: 10px; transition: width 0.3s;"></div>
                </div>
                <div id="quizTimer" style="text-align: center; font-size: 1.2rem; margin: 10px 0;">
                    ⏱️ <strong id="timerSeconds">${this.timePerQuestion}</strong> segundos
                </div>
                <p style="font-size: 1.2rem; margin: 20px 0;">${q.text}</p>
            </div>
            <div class="quiz-options" style="display: flex; flex-direction: column; gap: 10px;">
        `;
        
        q.options.forEach((opt, idx) => {
            html += `
                <div class="quiz-option" data-opt="${idx}" style="
                    background: rgba(30, 42, 58, 0.8);
                    padding: 12px 18px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">
                    ${String.fromCharCode(65 + idx)}. ${opt}
                </div>
            `;
        });
        
        html += `
            </div>
            <div id="quizFeedbackArea" style="margin-top: 20px; padding: 15px; border-radius: 12px; display: none;"></div>
        `;
        
        this.container.innerHTML = html;
        
        // Event listeners para opciones
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => this.checkAnswer(parseInt(opt.dataset.opt)));
        });
        
        this.startTimer();
    }
    
    startTimer() {
        let timeLeft = this.timePerQuestion;
        const timerDisplay = document.getElementById('timerSeconds');
        
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (this.answered) return;
            
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeOut();
            }
        }, 1000);
    }
    
    timeOut() {
        this.answered = true;
        this.streak = 0;
        
        const feedbackDiv = document.getElementById('quizFeedbackArea');
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.background = 'rgba(239, 68, 68, 0.2)';
        feedbackDiv.style.border = '1px solid var(--error)';
        feedbackDiv.innerHTML = `
            <span style="color: var(--error);">⏰ ¡Tiempo agotado!</span><br>
            <small>La respuesta correcta era: ${this.questions[this.currentIndex].options[this.questions[this.currentIndex].correct]}</small>
        `;
        
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        setTimeout(() => {
            this.currentIndex++;
            this.answered = false;
            this.render();
        }, 2000);
    }
    
    checkAnswer(selectedIndex) {
        if (this.answered) return;
        this.answered = true;
        clearInterval(this.timer);
        
        const q = this.questions[this.currentIndex];
        const isCorrect = (selectedIndex === q.correct);
        const feedbackDiv = document.getElementById('quizFeedbackArea');
        
        if (isCorrect) {
            let points = 10;
            if (this.streak >= 3) points = 20;
            else if (this.streak >= 1) points = 15;
            
            this.score += points;
            this.streak++;
            
            feedbackDiv.style.background = 'rgba(34, 197, 94, 0.2)';
            feedbackDiv.style.border = '1px solid var(--success)';
            feedbackDiv.innerHTML = `
                <span style="color: var(--success);">✅ ¡Correcto! +${points} puntos</span><br>
                <small>${q.explanation}</small>
                ${this.streak >= 3 ? '<br><span style="color: var(--warning);">🔥 ¡Racha de 3! Puntos extra</span>' : ''}
            `;
            
            // Resaltar opción correcta
            document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
                if (idx === q.correct) {
                    opt.style.background = 'var(--success)';
                }
            });
        } else {
            this.streak = 0;
            
            feedbackDiv.style.background = 'rgba(239, 68, 68, 0.2)';
            feedbackDiv.style.border = '1px solid var(--error)';
            feedbackDiv.innerHTML = `
                <span style="color: var(--error);">❌ Incorrecto.</span><br>
                <small>La respuesta correcta es: ${q.options[q.correct]}<br>${q.explanation}</small>
            `;
            
            // Resaltar opciones
            document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
                if (idx === q.correct) {
                    opt.style.background = 'var(--success)';
                }
                if (idx === selectedIndex) {
                    opt.style.background = 'var(--error)';
                }
            });
        }
        
        feedbackDiv.style.display = 'block';
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
        
        setTimeout(() => {
            this.currentIndex++;
            this.answered = false;
            this.render();
        }, 2000);
    }
    
    showResults() {
        const maxScore = this.totalQuestions * 10;
        const percentage = (this.score / maxScore) * 100;
        
        let grade = '';
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            grade = 'Excelente';
            message = '¡Eres un experto en Calidad de Software!';
            emoji = '🏆';
        } else if (percentage >= 75) {
            grade = 'Muy bien';
            message = 'Tienes un buen conocimiento. Sigue practicando.';
            emoji = '🎓';
        } else if (percentage >= 60) {
            grade = 'Aprobado';
            message = 'Has aprobado, pero puedes mejorar repasando algunos conceptos.';
            emoji = '📚';
        } else {
            grade = 'Necesitas mejorar';
            message = 'Te recomendamos repasar los módulos y volver a intentarlo.';
            emoji = '💪';
        }
        
        this.container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; margin-bottom: 15px;">${emoji}</div>
                <h3>🎉 ¡Quiz Completado! 🎉</h3>
                <div style="margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 12px;">
                    <p><strong>Puntuación final:</strong> ${this.score} / ${maxScore} puntos</p>
                    <p><strong>Porcentaje:</strong> ${percentage.toFixed(1)}%</p>
                    <p><strong>Calificación:</strong> ${grade}</p>
                    <p>${message}</p>
                    <p><strong>Resumen:</strong> ${this.totalQuestions} preguntas</p>
                </div>
                <button class="fill-btn" id="quizRestart" style="background: var(--success);">🔄 Jugar de nuevo</button>
            </div>
        `;
        
        const restartBtn = document.getElementById('quizRestart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.currentIndex = 0;
                this.score = 0;
                this.streak = 0;
                this.answered = false;
                this.render();
            });
        }
        
        if (this.onComplete) {
            this.onComplete({ score: this.score, total: maxScore, percentage: percentage });
        }
    }
}

// Función para inicializar el quiz rápido
function initQuizGame() {
    const quizContainer = document.getElementById('quizGame');
    if (quizContainer && !window.quizGameInstance) {
        window.quizGameInstance = new QuizGame('quizGame', (result) => {
            console.log('Quiz completado:', result);
        });
    }
}

// Exportar para uso global
window.QuizGame = QuizGame;
window.initQuizGame = initQuizGame;