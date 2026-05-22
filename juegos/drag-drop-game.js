// ====================================================
// ALAN ADRIÁN ALONSO VALENZUELA - JUEGO ARRASTRAR Y SOLTAR
// ====================================================
// LOLSITO - Drag and Drop Game para Calidad de Software

class DragDropGame {
    constructor(containerId, onCompleteCallback) {
        this.container = document.getElementById(containerId);
        this.onComplete = onCompleteCallback;
        this.items = [];
        this.categories = {};
        this.matches = {};
        this.correctMatches = 0;
        this.totalItems = 0;
        this.dragEnabled = true;
        
        this.initData();
        this.totalItems = this.items.length;
        this.render();
    }
    
    initData() {
        this.items = [
            { id: 1, text: "Pruebas unitarias", category: "qc", description: "Prueban funciones/métodos individuales" },
            { id: 2, text: "Definir procesos", category: "qa", description: "Establecer metodologías y estándares" },
            { id: 3, text: "Inspecciones de código", category: "qc", description: "Revisión manual del código fuente" },
            { id: 4, text: "Capacitación del equipo", category: "qa", description: "Entrenar al personal en buenas prácticas" },
            { id: 5, text: "Pruebas de regresión", category: "qc", description: "Verificar que cambios no rompan" },
            { id: 6, text: "Auditorías de calidad", category: "qa", description: "Evaluar cumplimiento de procesos" },
            { id: 7, text: "Análisis estático", category: "qc", description: "Analizar código sin ejecutarlo" },
            { id: 8, text: "Mejora continua", category: "qa", description: "Optimizar procesos constantemente" }
        ];
        
        this.categories = {
            qc: { name: "🔍 Control de Calidad (QC)", color: "var(--secondary)", description: "Actividades para ENCONTRAR defectos" },
            qa: { name: "🛡️ Aseguramiento de Calidad (QA)", color: "var(--accent)", description: "Actividades para PREVENIR defectos" }
        };
        
        this.matches = {};
    }
    
    render() {
        if (!this.container) return;
        
        let html = `
            <div style="margin-bottom: 20px; text-align: center;">
                <div class="drag-stats" style="display: inline-flex; gap: 20px; padding: 10px 20px; background: rgba(0,0,0,0.3); border-radius: 40px;">
                    <span>✅ Correctas: <strong id="dragCorrectCount">0</strong> / ${this.totalItems}</span>
                    <span id="dragCompleteMsg" style="color: var(--success); display: none;">🎉 ¡Completado!</span>
                </div>
            </div>
            <div class="drag-game" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                <div class="drag-items" style="flex: 1; min-width: 250px; background: var(--card-bg); border-radius: 16px; padding: 20px;">
                    <h4 style="color: var(--accent-glow); margin-bottom: 15px; text-align: center;">📦 Conceptos para clasificar</h4>
                    <div id="dragItemsList" style="display: flex; flex-direction: column; gap: 10px;">
        `;
        
        // Mostrar items no emparejados
        this.items.forEach(item => {
            if (!this.matches[item.id]) {
                html += `
                    <div class="drag-item" draggable="true" data-id="${item.id}" data-category="${item.category}" style="
                        background: var(--secondary);
                        padding: 12px 16px;
                        border-radius: 12px;
                        cursor: grab;
                        text-align: center;
                        transition: all 0.2s;
                    ">
                        ${item.text}
                        <small style="display: block; font-size: 0.7rem; opacity: 0.8;">${item.description}</small>
                    </div>
                `;
            }
        });
        
        html += `
                    </div>
                </div>
                <div class="drag-categories" style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 20px;">
        `;
        
        // Mostrar categorías
        Object.keys(this.categories).forEach(catKey => {
            const cat = this.categories[catKey];
            html += `
                <div class="drag-category" data-category="${catKey}" style="
                    background: ${cat.color}20;
                    border: 2px dashed ${cat.color};
                    border-radius: 16px;
                    padding: 15px;
                    min-height: 200px;
                ">
                    <h4 style="color: ${cat.color}; margin-bottom: 5px; text-align: center;">${cat.name}</h4>
                    <p style="font-size: 0.8rem; text-align: center; margin-bottom: 15px;">${cat.description}</p>
                    <div id="dropzone-${catKey}" class="dropzone" style="
                        min-height: 100px;
                        background: rgba(0,0,0,0.2);
                        border-radius: 12px;
                        padding: 10px;
                        transition: all 0.2s;
                    ">
            `;
            
            // Mostrar items ya emparejados en esta categoría
            Object.keys(this.matches).forEach(itemId => {
                const item = this.items.find(i => i.id == itemId);
                if (item && item.category === catKey) {
                    html += `
                        <div class="matched-item" style="
                            background: ${cat.color};
                            padding: 8px 12px;
                            border-radius: 8px;
                            margin: 5px 0;
                            text-align: center;
                            font-size: 0.85rem;
                        ">
                            ${item.text}
                            <button class="remove-item" data-id="${item.id}" style="
                                background: none;
                                border: none;
                                color: white;
                                cursor: pointer;
                                margin-left: 8px;
                                opacity: 0.7;
                            ">✖</button>
                        </div>
                    `;
                }
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="fill-btn" id="resetDragGame" style="background: var(--warning); color: black;">🔄 Reiniciar juego</button>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Configurar drag and drop
        this.setupDragAndDrop();
        this.updateCounter();
    }
    
    setupDragAndDrop() {
        const dragItems = document.querySelectorAll('.drag-item');
        const dropZones = document.querySelectorAll('.dropzone');
        
        // Configurar elementos arrastrables
        dragItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                if (!this.dragEnabled) return;
                e.dataTransfer.setData('text/plain', item.dataset.id);
                e.dataTransfer.effectAllowed = 'move';
                item.style.opacity = '0.5';
            });
            
            item.addEventListener('dragend', (e) => {
                item.style.opacity = '1';
            });
        });
        
        // Configurar zonas de drop
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.style.background = 'rgba(74,168,212,0.3)';
            });
            
            zone.addEventListener('dragleave', () => {
                zone.style.background = 'rgba(0,0,0,0.2)';
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.style.background = 'rgba(0,0,0,0.2)';
                
                const itemId = parseInt(e.dataTransfer.getData('text/plain'));
                const dropZoneId = zone.id.replace('dropzone-', '');
                const item = this.items.find(i => i.id === itemId);
                
                if (item && dropZoneId === item.category) {
                    // Correcto
                    this.matches[itemId] = true;
                    this.correctMatches++;
                    this.render();
                    this.showFeedback('✅ ¡Correcto!', 'success');
                } else if (item) {
                    // Incorrecto
                    this.showFeedback(`❌ Incorrecto. "${item.text}" pertenece a ${item.category === 'qc' ? 'QC' : 'QA'}`, 'error');
                }
                
                this.updateCounter();
            });
        });
        
        // Configurar botones de eliminar
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(btn.dataset.id);
                delete this.matches[itemId];
                this.correctMatches = Object.keys(this.matches).length;
                this.render();
                this.updateCounter();
            });
        });
        
        // Botón reiniciar
        const resetBtn = document.getElementById('resetDragGame');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }
    
    showFeedback(message, type) {
        const feedbackDiv = document.getElementById('dragFeedback');
        if (!feedbackDiv) {
            const newFeedback = document.createElement('div');
            newFeedback.id = 'dragFeedback';
            newFeedback.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 40px;
                z-index: 1000;
                animation: fadeInUp 0.3s ease-out;
            `;
            this.container.appendChild(newFeedback);
        }
        
        const feedback = document.getElementById('dragFeedback');
        feedback.style.background = type === 'success' ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)';
        feedback.style.color = 'white';
        feedback.innerHTML = message;
        feedback.style.display = 'block';
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                feedback.style.display = 'none';
                feedback.style.opacity = '1';
            }, 500);
        }, 1500);
    }
    
    updateCounter() {
        const correctSpan = document.getElementById('dragCorrectCount');
        const completeMsg = document.getElementById('dragCompleteMsg');
        
        if (correctSpan) {
            correctSpan.textContent = this.correctMatches;
        }
        
        if (this.correctMatches === this.totalItems) {
            if (completeMsg) completeMsg.style.display = 'inline';
            setTimeout(() => {
                alert('🎉 ¡Felicidades! Has clasificado correctamente todos los conceptos. 🎉\n\n¡Excelente comprensión de QC vs QA!');
                if (this.onComplete) {
                    this.onComplete({ correct: this.correctMatches, total: this.totalItems });
                }
            }, 500);
        } else {
            if (completeMsg) completeMsg.style.display = 'none';
        }
    }
    
    reset() {
        this.matches = {};
        this.correctMatches = 0;
        this.render();
        this.showFeedback('🔄 Juego reiniciado. ¡Vuelve a intentarlo!', 'info');
    }
}

// Función para inicializar el juego drag & drop
function initDragDropGame() {
    const dragContainer = document.getElementById('dragDropGame');
    if (dragContainer && !window.dragDropGameInstance) {
        window.dragDropGameInstance = new DragDropGame('dragDropGame', (result) => {
            console.log('Juego Drag & Drop completado:', result);
        });
    }
}

// Exportar para uso global
window.DragDropGame = DragDropGame;
window.initDragDropGame = initDragDropGame;