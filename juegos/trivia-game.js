// ====================================================
// ALAN ADRIÁN ALONSO VALENZUELA - JUEGO DE TRIVIA
// ====================================================
// LOLSITO - Trivia Game para Calidad de Software

class TriviaGame {
    constructor(containerId, onCompleteCallback) {
        this.container = document.getElementById(containerId);
        this.onComplete = onCompleteCallback;
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.answered = false;
        this.usedJokers = { fiftyFifty: false, skip: false, doublePoints: false };
        
        this.initQuestions();
        this.totalQuestions = this.questions.length;
        this.render();
    }
    
    initQuestions() {
        this.questions = [
            {
                text: "¿Qué significa QC en el contexto de calidad de software?",
                options: [
                    "Quality Control - Control de Calidad",
                    "Quality Assurance - Aseguramiento de Calidad",
                    "Quick Code - Código Rápido",
                    "Query Command - Comando de Consulta"
                ],
                correct: 0,
                explanation: "QC (Quality Control) se enfoca en encontrar defectos mediante pruebas e inspecciones.",
                category: "Fundamentos",
                difficulty: "Fácil"
            },
            {
                text: "¿Cuál es la principal diferencia entre QA y QC?",
                options: [
                    "QA es más caro que QC",
                    "QA previene defectos, QC los encuentra",
                    "QC es solo para pruebas manuales",
                    "No hay diferencia, son lo mismo"
                ],
                correct: 1,
                explanation: "QA (Aseguramiento de Calidad) es preventivo, QC (Control de Calidad) es detectivo.",
                category: "Fundamentos",
                difficulty: "Media"
            },
            {
                text: "Según la Ley de Boehm, ¿cuánto cuesta corregir un error encontrado en producción comparado con uno encontrado en requisitos?",
                options: [
                    "5 veces más",
                    "15 veces más",
                    "30 veces más",
                    "100 veces más"
                ],
                correct: 3,
                explanation: "La Ley de Boehm establece que corregir un error en producción cuesta hasta 100 veces más que en requisitos.",
                category: "Fundamentos",
                difficulty: "Media"
            },
            {
                text: "¿Cuántas características de calidad define ISO/IEC 25010?",
                options: ["6", "8", "10", "12"],
                correct: 1,
                explanation: "ISO 25010 define 8 características: Adecuación funcional, Confiabilidad, Usabilidad, Eficiencia, Seguridad, Compatibilidad, Mantenibilidad y Portabilidad.",
                category: "Modelos",
                difficulty: "Media"
            },
            {
                text: "¿Cuál es el nivel más alto de madurez en CMMI?",
                options: ["Definido", "Cuantitativo", "Optimizado", "Gestionado"],
                correct: 2,
                explanation: "El nivel 5 de CMMI es 'Optimizado', donde se aplica mejora continua basada en datos.",
                category: "Modelos",
                difficulty: "Media"
            },
            {
                text: "¿Qué relación en UML es obligatoria entre casos de uso?",
                options: ["Extend", "Include", "Generalización", "Asociación"],
                correct: 1,
                explanation: "La relación «include» es obligatoria; la relación «extend» es opcional bajo condición.",
                category: "Casos de Uso",
                difficulty: "Fácil"
            },
            {
                text: "¿Qué técnica de prueba de caja negra se enfoca en los valores justo en los bordes de los rangos?",
                options: [
                    "Particiones de equivalencia",
                    "Análisis de valores límite",
                    "Tablas de decisión",
                    "Pruebas de transición de estados"
                ],
                correct: 1,
                explanation: "El análisis de valores límite prueba los valores en los bordes de las particiones (mínimo, máximo, justo antes y después).",
                category: "Pruebas",
                difficulty: "Media"
            },
            {
                text: "¿En qué tipo de prueba el tester tiene conocimiento parcial del sistema (arquitectura, BD, APIs)?",
                options: ["Caja Negra", "Caja Blanca", "Caja Gris", "Caja Transparente"],
                correct: 2,
                explanation: "Las pruebas de caja gris combinan conocimiento parcial del sistema con enfoque funcional.",
                category: "Pruebas",
                difficulty: "Media"
            },
            {
                text: "¿Qué prueba verifica que los cambios recientes no hayan roto funcionalidades existentes?",
                options: ["Pruebas unitarias", "Pruebas de integración", "Pruebas de regresión", "Pruebas de humo"],
                correct: 2,
                explanation: "Las pruebas de regresión se ejecutan después de cambios para asegurar que no se rompió lo que ya funcionaba.",
                category: "Pruebas",
                difficulty: "Media"
            },
            {
                text: "¿Qué accidente fue causado por un error de redondeo acumulado en el software?",
                options: [
                    "Mars Climate Orbiter",
                    "Misil Patriot",
                    "Therac-25",
                    "Ariane 5"
                ],
                correct: 1,
                explanation: "El sistema Patriot falló por un error de redondeo acumulado después de 100 horas de operación.",
                category: "Casos Reales",
                difficulty: "Difícil"
            },
            {
                text: "¿Qué sonda espacial se perdió por confusión entre newtons y libras-fuerza?",
                options: [
                    "Mars Climate Orbiter",
                    "Voyager 1",
                    "Cassini-Huygens",
                    "Apollo 11"
                ],
                correct: 0,
                explanation: "El Mars Climate Orbiter se desintegró porque un equipo usó libras-fuerza y el otro newtons.",
                category: "Casos Reales",
                difficulty: "Difícil"
            },
            {
                text: "¿Qué metodología ágil utiliza sprints de 1 a 4 semanas?",
                options: ["Kanban", "Scrum", "XP", "Cascada"],
                correct: 1,
                explanation: "Scrum utiliza sprints (iteraciones) de duración fija, generalmente 1-4 semanas.",
                category: "Metodologías",
                difficulty: "Fácil"
            },
            {
                text: "¿Qué herramienta es estándar para pruebas de carga y rendimiento?",
                options: ["Selenium", "JUnit", "JMeter", "Postman"],
                correct: 2,
                explanation: "Apache JMeter es la herramienta más utilizada para pruebas de carga y rendimiento.",
                category: "Herramientas",
                difficulty: "Media"
            },
            {
                text: "¿Qué significa SUS en pruebas de usabilidad?",
                options: [
                    "Standard Usability Score",
                    "System Usability Scale",
                    "Software User Satisfaction",
                    "Simple Usability Test"
                ],
                correct: 1,
                explanation: "SUS (System Usability Scale) es un cuestionario de 10 preguntas para medir usabilidad.",
                category: "UI/UX",
                difficulty: "Media"
            },
            {
                text: "¿Qué estándar IEEE se utiliza para documentación de pruebas?",
                options: ["IEEE 830", "IEEE 829", "IEEE 730", "IEEE 610"],
                correct: 1,
                explanation: "IEEE 829 define la estructura y contenido de los documentos de pruebas de software.",
                category: "Estándares",
                difficulty: "Difícil"
            }
        ];
    }
    
    render() {
        if (!this.container) return;
        
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }
        
        const q = this.questions[this.currentQuestion];
        const progressPercent = ((this.currentQuestion) / this.totalQuestions) * 100;
        
        let html = `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span class="badge" style="background: var(--info);">📚 ${q.category}</span>
                    <span class="badge" style="background: ${q.difficulty === 'Fácil' ? 'var(--success)' : (q.difficulty === 'Media' ? 'var(--warning)' : 'var(--error)')}; color: ${q.difficulty === 'Media' ? 'black' : 'white'}">
                        ${q.difficulty}
                    </span>
                </div>
                <div style="background: rgba(0,0,0,0.3); border-radius: 10px; height: 8px; margin: 15px 0;">
                    <div style="background: var(--accent); width: ${progressPercent}%; height: 8px; border-radius: 10px; transition: width 0.3s;"></div>
                </div>
                <p style="font-size: 1.1rem; font-weight: 600; margin: 15px 0;">Pregunta ${this.currentQuestion + 1}/${this.totalQuestions}</p>
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
            <div id="triviaFeedback" style="margin-top: 20px; padding: 15px; border-radius: 12px; display: none;"></div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div>
                    <button class="fill-btn" id="triviaFiftyFifty" style="background: var(--warning); color: black; ${this.usedJokers.fiftyFifty ? 'opacity: 0.5; pointer-events: none;' : ''}">🎲 50/50</button>
                    <button class="fill-btn" id="triviaSkip" style="background: var(--info); ${this.usedJokers.skip ? 'opacity: 0.5; pointer-events: none;' : ''}">⏭️ Saltar</button>
                </div>
                <div>
                    <span>⭐ Puntuación: <strong id="triviaScore">${this.score}</strong></span>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Event listeners para opciones
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => this.checkAnswer(parseInt(opt.dataset.opt)));
        });
        
        // Event listeners para comodines
        const fiftyBtn = document.getElementById('triviaFiftyFifty');
        const skipBtn = document.getElementById('triviaSkip');
        
        if (fiftyBtn && !this.usedJokers.fiftyFifty) {
            fiftyBtn.addEventListener('click', () => this.useFiftyFifty());
        }
        if (skipBtn && !this.usedJokers.skip) {
            skipBtn.addEventListener('click', () => this.useSkip());
        }
    }
    
    checkAnswer(selectedIndex) {
        if (this.answered) return;
        this.answered = true;
        
        const q = this.questions[this.currentQuestion];
        const isCorrect = (selectedIndex === q.correct);
        const feedbackDiv = document.getElementById('triviaFeedback');
        
        let points = 10;
        if (isCorrect) {
            if (this.usedJokers.doublePoints) {
                points = 20;
                this.usedJokers.doublePoints = false;
            }
            this.score += points;
            feedbackDiv.style.background = 'rgba(34, 197, 94, 0.2)';
            feedbackDiv.style.border = '1px solid var(--success)';
            feedbackDiv.innerHTML = `
                <span style="color: var(--success);">✅ ¡Correcto! +${points} puntos</span><br>
                <small>${q.explanation}</small>
            `;
            
            // Marcar opción correcta
            document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
                if (idx === q.correct) {
                    opt.style.background = 'var(--success)';
                }
            });
        } else {
            feedbackDiv.style.background = 'rgba(239, 68, 68, 0.2)';
            feedbackDiv.style.border = '1px solid var(--error)';
            feedbackDiv.innerHTML = `
                <span style="color: var(--error);">❌ Incorrecto.</span><br>
                <small>La respuesta correcta es: ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}<br>${q.explanation}</small>
            `;
            
            // Marcar opciones
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
            this.currentQuestion++;
            this.answered = false;
            this.render();
        }, 2000);
    }
    
    useFiftyFifty() {
        if (this.usedJokers.fiftyFifty) return;
        this.usedJokers.fiftyFifty = true;
        
        const q = this.questions[this.currentQuestion];
        const incorrectIndices = [];
        
        for (let i = 0; i < q.options.length; i++) {
            if (i !== q.correct) {
                incorrectIndices.push(i);
            }
        }
        
        // Quitar 2 opciones incorrectas
        while (incorrectIndices.length > 2) {
            const removeIndex = Math.floor(Math.random() * incorrectIndices.length);
            incorrectIndices.splice(removeIndex, 1);
        }
        
        // Ocultar opciones incorrectas
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((opt, idx) => {
            if (incorrectIndices.includes(idx)) {
                opt.style.opacity = '0.3';
                opt.style.pointerEvents = 'none';
                opt.style.textDecoration = 'line-through';
            }
        });
        
        const feedback = document.getElementById('triviaFeedback');
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(255, 193, 7, 0.2)';
        feedback.style.border = '1px solid var(--warning)';
        feedback.innerHTML = '<span style="color: var(--warning);">🎲 Comodín 50/50 usado. Dos opciones incorrectas han sido eliminadas.</span>';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000);
    }
    
    useSkip() {
        if (this.usedJokers.skip) return;
        this.usedJokers.skip = true;
        
        this.currentQuestion++;
        this.answered = false;
        this.render();
    }
    
    showResults() {
        const maxScore = this.totalQuestions * 10;
        const percentage = (this.score / maxScore) * 100;
        
        let grade = '';
        let message = '';
        let emoji = '';
        
        if (percentage >= 90) {
            grade = 'Excelente';
            message = '¡Eres un experto en Calidad de Software! Domina todos los conceptos.';
            emoji = '🏆';
        } else if (percentage >= 75) {
            grade = 'Muy bien';
            message = 'Tienes un sólido conocimiento. Sigue así para alcanzar la excelencia.';
            emoji = '🎓';
        } else if (percentage >= 60) {
            grade = 'Aprobado';
            message = 'Has aprobado, pero puedes mejorar repasando algunos conceptos.';
            emoji = '📚';
        } else {
            grade = 'Necesitas mejorar';
            message = 'Te recomendamos repasar los módulos y volver a intentarlo. ¡Tú puedes!';
            emoji = '💪';
        }
        
        this.container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; margin-bottom: 15px;">${emoji}</div>
                <h3>🎉 ¡Trivia Completada! 🎉</h3>
                <div style="margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 12px;">
                    <p><strong>Puntuación final:</strong> ${this.score} / ${maxScore} puntos</p>
                    <p><strong>Porcentaje:</strong> ${percentage.toFixed(1)}%</p>
                    <p><strong>Calificación:</strong> ${grade}</p>
                    <p>${message}</p>
                </div>
                <button class="fill-btn" id="triviaRestart">🔄 Jugar de nuevo</button>
            </div>
        `;
        
        const restartBtn = document.getElementById('triviaRestart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.currentQuestion = 0;
                this.score = 0;
                this.answered = false;
                this.usedJokers = { fiftyFifty: false, skip: false, doublePoints: false };
                this.render();
            });
        }
        
        if (this.onComplete) {
            this.onComplete({ score: this.score, total: maxScore, percentage: percentage });
        }
    }
}

// Función para inicializar la trivia
function initTriviaGame() {
    const triviaContainer = document.getElementById('triviaGame');
    if (triviaContainer && !window.triviaGameInstance) {
        window.triviaGameInstance = new TriviaGame('triviaGame', (result) => {
            console.log('Trivia completada:', result);
        });
    }
}

// Exportar para uso global
window.TriviaGame = TriviaGame;
window.initTriviaGame = initTriviaGame;