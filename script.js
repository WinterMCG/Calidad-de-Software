// ALAN ADRIÁN ALONSO VALENZUELA - SCRIPT COMPLETO


let modulosVistos = new Set();
let progresoTotal = 0;
let examData = null;
let vfActual = 0;
let vfAciertos = 0;
let vfRespondidas = 0;
let vfTerminado = false;
let memoriaCartas = [];
let memoriaVolteadas = [];
let memoriaBloqueado = false;
let memoriaMatches = 0;


// EVENTOS

document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    cargarModales();
    inicializarEstadisticas();
    actualizarProgreso();
    inicializarBuscador();
    actualizarDashboard();
});

function inicializarEventos() {
    // Pantalla de bienvenida
    const enterBtn = document.getElementById('enterBtn');
    const welcome = document.getElementById('welcomeScreen');
    const main = document.getElementById('mainContent');
    
    if (enterBtn) {
        enterBtn.onclick = () => {
            welcome.style.opacity = '0';
            welcome.style.visibility = 'hidden';
            main.style.display = 'block';
            setTimeout(() => welcome.style.display = 'none', 600);
            actualizarProgreso();
        };
    }
    
    // Botones de volver en modales (se asignarán después de cargar)
    // Eventos de tarjetas
    document.querySelectorAll('.card').forEach(card => {
        card.onclick = (e) => {
            e.stopPropagation();
            const modalId = card.getAttribute('data-modal');
            if (modalId) {
                abrirModal(modalId);
            }
            const progressKey = card.getAttribute('data-progress');
            if (progressKey) {
                marcarModuloVisto(progressKey);
            }
        };
    });
    
    // Cerrar modal con click fuera
    window.onclick = (e) => {
        if (e.target.classList && e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
}

// ====================================================
// INICIALIZAR ESTADÍSTICAS EN 0
// ====================================================
function inicializarEstadisticas() {
    // Siempre inicializar en 0 para que cada usuario empiece desde cero
    const estadisticasIniciales = {
        temas: 0,
        progreso: 0,
        juegos: 0,
        promedio: 0
    };
    
    localStorage.setItem("estadisticasUsuario", JSON.stringify(estadisticasIniciales));
}

// ====================================================
// CARGA DINÁMICA DE MODALES
// ====================================================
function cargarModales() {
    const modales = [
        'modal-fundamentos', 'modal-modelos', 'modal-requerimientos', 'modal-casos-uso',
        'modal-gantt', 'modal-pruebas-caja', 'modal-tipos-pruebas', 'modal-casos-reales',
        'modal-uiux', 'modal-plancuci', 'modal-estandares', 'modal-costos',
        'modal-proyectos', 'modal-metodologias', 'modal-examen', 'modal-ejercicios'
    ];
    
    modales.forEach(modal => {
        fetch(`modales/${modal}.html`)
            .then(response => response.text())
            .then(data => {
                const container = document.getElementById('modales-container');
                if (container) {
                    container.insertAdjacentHTML('beforeend', data);
                    inicializarModalCargado(modal);
                }
            })
            .catch(error => console.error(`Error cargando ${modal}:`, error));
    });
}

function inicializarModalCargado(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Configurar botón de volver
    const backBtn = modal.querySelector('.back-button');
    if (backBtn) {
        backBtn.onclick = () => modal.style.display = 'none';
    }
    
    // Configurar pestañas
    const tabs = modal.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.onclick = () => {
            const tabId = tab.getAttribute('data-tab');
            const modalContent = tab.closest('.modal-content');
            modalContent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modalContent.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const target = modalContent.querySelector('#' + tabId);
            if (target) target.classList.add('active');
        };
    });
    
    // Inicializar juegos específicos según el modal
    if (modalId === 'modal-fundamentos') inicializarJuegoFundamentos(modal);
    if (modalId === 'modal-modelos') inicializarJuegoMemoria(modal);
    if (modalId === 'modal-requerimientos') inicializarTriviaRequerimientos(modal);
    if (modalId === 'modal-casos-uso') inicializarRelacionCasosUso(modal);
    if (modalId === 'modal-tipos-pruebas') inicializarQuizPruebas(modal);
    if (modalId === 'modal-costos') inicializarCalculadoraCostos(modal);
    if (modalId === 'modal-examen') inicializarExamen(modal);
    if (modalId === 'modal-uiux') inicializarChecklistUsabilidad(modal);
    if (modalId === 'modal-ejercicios') inicializarJuegosEjercicios(modal);
}

// ====================================================
// FUNCIONES DE PROGRESO
// ====================================================
function marcarModuloVisto(modulo) {

    if (!modulosVistos.has(modulo)) {

        modulosVistos.add(modulo);

        sumarProgreso();

        actualizarProgreso();
    }
}

function actualizarProgreso() {
    const totalModulos = 16;
    const porcentaje = (modulosVistos.size / totalModulos) * 100;
    const progressBar = document.getElementById('globalProgressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) progressBar.style.width = porcentaje + '%';
    if (progressText) {
        progressText.innerHTML = `<i class="fas fa-chart-line"></i> Progreso: ${Math.round(porcentaje)}% completado (${modulosVistos.size}/${totalModulos} módulos)`;
    }
}

// ====================================================
// BUSCADOR GLOBAL
// ====================================================
function inicializarBuscador() {
    const searchInput = document.getElementById('globalSearch');
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase().trim();
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const combined = title + ' ' + desc;
            
            if (term === '' || combined.includes(term)) {
                card.classList.remove('hidden-card');
                visibleCount++;
            } else {
                card.classList.add('hidden-card');
            }
        });
        
        if (noResults) {
            noResults.style.display = (visibleCount === 0 && term !== '') ? 'block' : 'none';
        }
    });
}

// ====================================================
// ABRIR MODAL
// ====================================================
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// ====================================================
// JUEGO: FUNDAMENTOS (Clasificar QC vs QA)
// ====================================================
function inicializarJuegoFundamentos(modal) {
    const conceptos = [
        { nombre: "Pruebas unitarias", tipo: "qc" },
        { nombre: "Definir procesos", tipo: "qa" },
        { nombre: "Inspecciones de código", tipo: "qc" },
        { nombre: "Capacitación del equipo", tipo: "qa" },
        { nombre: "Pruebas de regresión", tipo: "qc" },
        { nombre: "Auditorías de proceso", tipo: "qa" },
        { nombre: "Reporte de bugs", tipo: "qc" },
        { nombre: "Estándares de codificación", tipo: "qa" },
        { nombre: "Análisis estático", tipo: "qc" },
        { nombre: "Mejora continua", tipo: "qa" }
    ];
    
    const container = modal.querySelector('#juegoFundamentos');
    if (!container) return;
    
    let html = `
        <div class="comparison-grid">
            <div class="comparison-item" style="text-align:center;">
                <h4>🔍 Control de Calidad (QC)</h4>
                <div id="qcDrop" style="min-height:120px; background:rgba(0,0,0,0.3); border-radius:12px; padding:10px; margin-top:10px;"></div>
            </div>
            <div class="comparison-item" style="text-align:center;">
                <h4>🛡️ Aseguramiento de Calidad (QA)</h4>
                <div id="qaDrop" style="min-height:120px; background:rgba(0,0,0,0.3); border-radius:12px; padding:10px; margin-top:10px;"></div>
            </div>
        </div>
        <div id="conceptosLista" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin:20px 0;">
    `;
    
    conceptos.forEach((c, i) => {
        html += `<button class="fill-btn concepto-btn" data-idx="${i}" data-tipo="${c.tipo}" data-nombre="${c.nombre}">${c.nombre}</button>`;
    });
    
    html += `</div><button class="fill-btn" id="verificarJuego">✅ Verificar respuestas</button><div id="resultadoJuego" style="margin-top:15px; text-align:center;"></div>`;
    container.innerHTML = html;
    
    const qcDrop = document.getElementById('qcDrop');
    const qaDrop = document.getElementById('qaDrop');
    let qcItems = [], qaItems = [];
    
    document.querySelectorAll('.concepto-btn').forEach(btn => {

    btn.onclick = () => {

        if (btn.disabled) return;

        const nombre = btn.dataset.nombre;

        const respuesta = prompt(
            `¿"${nombre}" pertenece a QA o QC?`
        );

        if (!respuesta) return;

        const resp = respuesta.toLowerCase();

        if (resp === 'qc') {

            qcDrop.innerHTML += `
            <div class="dropped-item">
            ${nombre}
            </div>`;

            qcItems.push(nombre);

        } else if (resp === 'qa') {

            qaDrop.innerHTML += `
            <div class="dropped-item">
            ${nombre}
            </div>`;

            qaItems.push(nombre);

        } else {

            alert('Escribe QA o QC');
            return;
        }

        btn.disabled = true;
        btn.style.opacity = '0.5';
    };
});
    
    const verificar = document.getElementById('verificarJuego');
    const resultadoDiv = document.getElementById('resultadoJuego');
    
    if (verificar) {
        verificar.onclick = () => {
            const totalCorrectos = qcItems.length + qaItems.length;
            resultadoDiv.innerHTML = `<strong>Has clasificado ${totalCorrectos}/10 conceptos.</strong><br>${totalCorrectos === 10 ? '🎉 ¡Perfecto! Excelente trabajo.' : '📚 Sigue practicando para mejorar.'}`;
            if (totalCorrectos === 10) {
                resultadoDiv.innerHTML += '<br><span style="color:#22c55e">🌟 ¡Has dominado los conceptos de QC y QA!</span>';
            }
        };
    }
}

// ====================================================
// JUEGO: MEMORIA (Modelos de Calidad)
// ====================================================
function inicializarJuegoMemoria(modal) {
    const paresMemoria = [
        { modelo: "ISO 25010", caracteristica: "8 características" },
        { modelo: "CMMI", caracteristica: "5 niveles" },
        { modelo: "McCall", caracteristica: "11 factores" },
        { modelo: "ISO 9126", caracteristica: "6 características" },
        { modelo: "CMMI Nivel 3", caracteristica: "Definido" },
        { modelo: "CMMI Nivel 5", caracteristica: "Optimizado" }
    ];
    
    const container = modal.querySelector('#memoryGame');
    if (!container) return;
    
    let items = [];
    paresMemoria.forEach((p, i) => {
        items.push({ id: i, tipo: 'modelo', texto: p.modelo, matched: false });
        items.push({ id: i, tipo: 'caracteristica', texto: p.caracteristica, matched: false });
    });
    
    // Barajar
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    
    memoriaCartas = items;
    memoriaVolteadas = [];
    memoriaBloqueado = false;
    memoriaMatches = 0;
    
    actualizarGridMemoria(container);
}

function actualizarGridMemoria(container) {
    const grid = container.querySelector('.memory-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    memoriaCartas.forEach((card, idx) => {
        const div = document.createElement('div');
        div.className = 'memory-card';
        if (memoriaVolteadas.includes(idx) || card.matched) {
            div.classList.add('flipped');
            div.innerText = card.texto;
        } else {
            div.innerText = '?';
        }
        div.onclick = () => voltearCartaMemoria(idx, container);
        grid.appendChild(div);
    });
    
    const scoreSpan = container.querySelector('#memoryScore');
    if (scoreSpan) {
        scoreSpan.innerText = `Parejas encontradas: ${memoriaMatches} / 6`;
    }
}

function voltearCartaMemoria(idx, container) {
    if (memoriaBloqueado) return;
    if (memoriaVolteadas.includes(idx)) return;
    if (memoriaCartas[idx].matched) return;
    
    memoriaVolteadas.push(idx);
    
    if (memoriaVolteadas.length === 2) {
        memoriaBloqueado = true;
        const card1 = memoriaCartas[memoriaVolteadas[0]];
        const card2 = memoriaCartas[memoriaVolteadas[1]];
        
        if (card1.id === card2.id && card1.tipo !== card2.tipo) {
            card1.matched = true;
            card2.matched = true;
            memoriaMatches++;
            memoriaVolteadas = [];
            memoriaBloqueado = false;
            if (memoriaMatches === 6) {
                setTimeout(() => alert('🎉 ¡Felicidades! Completaste todas las parejas.'), 100);
            }
        } else {
            setTimeout(() => {
                memoriaVolteadas = [];
                memoriaBloqueado = false;
                actualizarGridMemoria(container);
            }, 800);
        }
    }
    actualizarGridMemoria(container);
}

// ====================================================
// TRIVIA: REQUERIMIENTOS
// ====================================================
function inicializarTriviaRequerimientos(modal) {
    const container = modal.querySelector('#triviaRequerimientos');
    if (!container) return;
    
    const preguntas = [
        { texto: "El sistema debe permitir iniciar sesión con correo y contraseña", tipo: "F", explicacion: "Es funcional porque describe una acción específica." },
        { texto: "El sistema debe responder en menos de 2 segundos", tipo: "NF", explicacion: "Es no funcional porque describe un criterio de rendimiento." },
        { texto: "El sistema debe generar un reporte de ventas mensual", tipo: "F", explicacion: "Es funcional porque describe una funcionalidad específica." },
        { texto: "El sistema debe funcionar en Windows, Linux y Mac", tipo: "NF", explicacion: "Es no funcional porque describe portabilidad." }
    ];
    
    let preguntaActual = 0;
    let aciertos = 0;
    
    function mostrarPregunta() {
        if (preguntaActual >= preguntas.length) {
            container.innerHTML = `<div class="game-container"><h3>🎉 Resultado final: ${aciertos}/${preguntas.length}</h3><button class="fill-btn" onclick="location.reload()">🔄 Jugar de nuevo</button></div>`;
            return;
        }
        const p = preguntas[preguntaActual];
        container.innerHTML = `
            <div class="game-container">
                <p class="game-title">📝 Pregunta ${preguntaActual + 1}/${preguntas.length}</p>
                <p style="font-size:1.1rem; margin-bottom:20px;">${p.texto}</p>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button class="fill-btn trivia-f" data-resp="F">✅ Funcional</button>
                    <button class="fill-btn trivia-nf" data-resp="NF">⚡ No Funcional</button>
                </div>
                <div id="triviaFeedback" style="margin-top:15px;"></div>
            </div>
        `;
        
        document.querySelector('.trivia-f').onclick = () => responder(p, 'F');
        document.querySelector('.trivia-nf').onclick = () => responder(p, 'NF');
    }
    
    function responder(pregunta, respuesta) {
        const feedback = document.getElementById('triviaFeedback');
        if (respuesta === pregunta.tipo) {
            aciertos++;
            feedback.innerHTML = '<span style="color:#22c55e">✅ ¡Correcto! ' + pregunta.explicacion + '</span>';
        } else {
            feedback.innerHTML = '<span style="color:#ef4444">❌ Incorrecto. ' + pregunta.explicacion + '</span>';
        }
        preguntaActual++;
        setTimeout(mostrarPregunta, 1500);
    }
    
    mostrarPregunta();
}

// ====================================================
// RELACIONAR: CASOS DE USO
// ====================================================
function inicializarRelacionCasosUso(modal) {
    const container = modal.querySelector('#relacionCasosUso');
    if (!container) return;
    
    const terminos = [
        { termino: "Actor", definicion: "Entidad externa que interactúa con el sistema" },
        { termino: "Caso de Uso", definicion: "Funcionalidad que el sistema ofrece" },
        { termino: "Include", definicion: "Relación obligatoria entre casos de uso" },
        { termino: "Extend", definicion: "Relación opcional bajo condición" },
        { termino: "Límite del sistema", definicion: "Frontera que delimita el sistema" }
    ];
    
    let barajados = [...terminos].sort(() => Math.random() - 0.5);
    let definicionesBarajadas = [...terminos].sort(() => Math.random() - 0.5);
    let respuestas = {};
    
    let html = `
        <div class="game-container">
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h4>📌 Términos</h4>
    `;
    
    barajados.forEach((t, i) => {
        html += `<div class="drag-item" data-termino="${t.termino}" style="background:var(--secondary); padding:10px; margin:8px; border-radius:8px; cursor:pointer; text-align:center;">${t.termino}</div>`;
    });
    
    html += `</div><div class="comparison-item"><h4>📝 Definiciones</h4>`;
    
    definicionesBarajadas.forEach((d, i) => {
        html += `<div class="drag-dropzone" data-definicion="${d.definicion}" style="background:rgba(0,0,0,0.3); padding:10px; margin:8px; border-radius:8px; min-height:60px;">
            <p style="margin:0;">${d.definicion}</p>
            <div class="match-result"></div>
        </div>`;
    });
    
    html += `</div></div><button class="fill-btn" id="verificarRelacion">✅ Verificar respuestas</button><div id="resultadoRelacion" style="margin-top:15px; text-align:center;"></div></div>`;
    container.innerHTML = html;
    
    let terminoActivo = null;
    
    const terminosDivs = document.querySelectorAll('.drag-item');
    const definicionesDivs = document.querySelectorAll('.drag-dropzone');

    terminosDivs.forEach(term => {

        term.onclick = () => {

            terminosDivs.forEach(t => {
                t.classList.remove('activo');
            });

            term.classList.add('activo');

            terminoActivo = term;
        };
    });
    
    definicionesDivs.forEach(def => {
        def.onclick = () => {
            const terminoSeleccionado = terminoActivo;
            if (terminoSeleccionado) {
                const termino = terminoSeleccionado.dataset.termino;
                const definicion = def.dataset.definicion;
                const correcto = terminos.find(t => t.termino === termino && t.definicion === definicion);
                const resultadoDiv = def.querySelector('.match-result');
                if (correcto && !respuestas[termino]) {
                    respuestas[termino] = definicion;
                    resultadoDiv.innerHTML = '<span style="color:#22c55e">✓</span>';
                    terminoSeleccionado.style.opacity = '0.5';
                    terminoSeleccionado.style.pointerEvents = 'none';
                } else if (respuestas[termino]) {
                    alert('Este término ya fue emparejado');
                } else {
                    resultadoDiv.innerHTML = '<span style="color:#ef4444">✗</span>';
                    setTimeout(() => resultadoDiv.innerHTML = '', 1000);
                }
            }
        };
    });
    
    const verificar = document.getElementById('verificarRelacion');
    if (verificar) {
        verificar.onclick = () => {
            const correctas = Object.keys(respuestas).length;
            const resultado = document.getElementById('resultadoRelacion');
            resultado.innerHTML = `<strong>Emparejaste ${correctas}/${terminos.length} conceptos correctamente.</strong>${correctas === terminos.length ? ' 🎉 ¡Excelente trabajo!' : ' 📚 Sigue practicando.'}`;
        };
    }
}

// ====================================================
// QUIZ: TIPOS DE PRUEBAS
// ====================================================
function inicializarQuizPruebas(modal) {
    const container = modal.querySelector('#quizPruebas');
    if (!container) return;
    
    const preguntas = [
        { texto: "¿Qué tipo de prueba verifica que los cambios no rompan funcionalidades existentes?", opciones: ["Unitaria", "Integración", "Regresión", "Humo"], correcta: 2 },
        { texto: "¿Qué prueba se ejecuta rápidamente para verificar funciones críticas?", opciones: ["Regresión", "Humo", "Carga", "Seguridad"], correcta: 1 },
        { texto: "¿Qué herramienta se usa para pruebas de carga?", opciones: ["JUnit", "Selenium", "JMeter", "OWASP ZAP"], correcta: 2 },
        { texto: "¿Las pruebas unitarias son responsabilidad de?", opciones: ["Tester", "Cliente", "Desarrollador", "QA"], correcta: 2 }
    ];
    
    let preguntaActual = 0;
    let aciertos = 0;
    
    function mostrarPregunta() {
        if (preguntaActual >= preguntas.length) {
            container.innerHTML = `<div class="game-container"><h3>🎉 Resultado: ${aciertos}/${preguntas.length}</h3><button class="fill-btn" onclick="location.reload()">🔄 Reiniciar</button></div>`;
            return;
        }
        const p = preguntas[preguntaActual];
        let html = `<div class="game-container"><p class="game-title">📝 Pregunta ${preguntaActual + 1}/${preguntas.length}</p><p style="font-size:1.1rem;">${p.texto}</p><div class="quiz-options">`;
        p.opciones.forEach((opt, idx) => {
            html += `<div class="quiz-option" data-resp="${idx}">${opt}</div>`;
        });
        html += `</div><div id="quizFeedback" style="margin-top:15px;"></div></div>`;
        container.innerHTML = html;
        
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.onclick = () => {
                const respuesta = parseInt(opt.dataset.resp);
                const feedback = document.getElementById('quizFeedback');
                if (respuesta === p.correcta) {
                    aciertos++;
                    feedback.innerHTML = '<span style="color:#22c55e">✅ ¡Correcto!</span>';
                } else {
                    feedback.innerHTML = `<span style="color:#ef4444">❌ Incorrecto. La respuesta correcta es: ${p.opciones[p.correcta]}</span>`;
                }
                preguntaActual++;
                setTimeout(mostrarPregunta, 1500);
            };
        });
    }
    
    mostrarPregunta();
}

// ====================================================
// CALCULADORA DE COSTOS
// ====================================================
function inicializarCalculadoraCostos(modal) {
    const container = modal.querySelector('#calculadoraCostos');
    if (!container) return;
    
    container.innerHTML = `
        <div class="game-container">
            <h3 class="game-title">💰 Calculadora de Costos de Software</h3>
            <div style="display:flex; flex-direction:column; gap:15px; max-width:400px; margin:0 auto;">
                <label>📊 Horas estimadas de desarrollo:</label>
                <input type="number" id="horasInput" value="200" style="background:var(--primary); border:1px solid var(--border); padding:10px; border-radius:8px; color:white;">
                <label>💵 Tarifa por hora (MXN):</label>
                <input type="number" id="tarifaInput" value="250" style="background:var(--primary); border:1px solid var(--border); padding:10px; border-radius:8px; color:white;">
                <label>📈 Margen de contingencia (%):</label>
                <input type="number" id="contingenciaInput" value="15" style="background:var(--primary); border:1px solid var(--border); padding:10px; border-radius:8px; color:white;">
                <button class="fill-btn" id="calcularCostoBtn">🧮 Calcular costo total</button>
                <div id="costoResultado" style="margin-top:15px; padding:15px; background:rgba(0,0,0,0.3); border-radius:12px; text-align:center;">
                    <p>💰 Costo base: <strong id="costoBase">$0</strong></p>
                    <p>📊 Contingencia: <strong id="costoContingencia">$0</strong></p>
                    <p>🎯 Costo total estimado: <strong id="costoTotalFinal" style="font-size:1.3rem; color:#4aa8d4;">$0</strong></p>
                </div>
            </div>
        </div>
    `;
    
    const calcularBtn = document.getElementById('calcularCostoBtn');
    if (calcularBtn) {
        calcularBtn.onclick = () => {
            const horas = parseInt(document.getElementById('horasInput').value) || 0;
            const tarifa = parseInt(document.getElementById('tarifaInput').value) || 0;
            const contingencia = parseInt(document.getElementById('contingenciaInput').value) || 0;
            
            const costoBase = horas * tarifa;
            const costoContingencia = costoBase * (contingencia / 100);
            const costoTotal = costoBase + costoContingencia;
            
            document.getElementById('costoBase').innerText = `$${costoBase.toLocaleString('es-MX')} MXN`;
            document.getElementById('costoContingencia').innerText = `$${costoContingencia.toLocaleString('es-MX')} MXN`;
            document.getElementById('costoTotalFinal').innerText = `$${costoTotal.toLocaleString('es-MX')} MXN`;
        };
    }
}

// ====================================================
// EXAMEN COMPLETO
// ====================================================
// ====================================================
// EXAMEN FINAL - 30 PREGUNTAS
// ====================================================
function inicializarExamen(modal) {
    // Las 30 preguntas (extraídas de preguntas-examen.json)
    const preguntas = [
        // Sección 1 (preguntas 1-10)
        { texto: "Según IEEE, ¿qué es la calidad de software?", opciones: ["Rapidez y bajo costo", "Cumple requisitos y expectativas del cliente", "Cantidad de funciones", "Ausencia de errores"], correcta: 1 },
        { texto: "¿Cuál es la principal diferencia entre QA y QC?", opciones: ["QA es más costoso que QC", "QA previene defectos, QC los encuentra", "QC se hace al inicio, QA al final", "No hay diferencia significativa"], correcta: 1 },
        { texto: "Según la Ley de Boehm, corregir un error en producción cuesta hasta ___ veces más que en requisitos.", opciones: ["10", "50", "100", "200"], correcta: 2 },
        { texto: "¿Cuál es un costo de prevención?", opciones: ["Soporte técnico", "Capacitación del personal", "Corrección de errores", "Demandas legales"], correcta: 1 },
        { texto: "¿Qué principios de calidad propuso Deming?", opciones: ["Cero defectos", "14 principios de mejora continua", "Trilogía de la calidad", "Calidad es gratis"], correcta: 1 },
        { texto: "¿Cuál es un costo de fallos externos?", opciones: ["Pruebas de sistema", "Capacitación", "Demandas de clientes", "Inspecciones de código"], correcta: 2 },
        { texto: "¿Qué es la verificación en calidad de software?", opciones: ["¿Construimos el producto correcto?", "¿Construimos bien el producto?", "¿Es rentable el producto?", "¿Cumple los plazos?"], correcta: 1 },
        { texto: "¿Qué es la validación en calidad de software?", opciones: ["¿Construimos el producto correcto?", "¿Construimos bien el producto?", "¿Es rentable el producto?", "¿Cumple los plazos?"], correcta: 0 },
        { texto: "¿Qué autor propuso que 'la calidad es gratis'?", opciones: ["Deming", "Juran", "Crosby", "Boehm"], correcta: 2 },
        { texto: "¿Qué es la trilogía de la calidad de Juran?", opciones: ["Planificar, Controlar, Mejorar", "Analizar, Diseñar, Probar", "Requisitos, Código, Pruebas", "Prevenir, Detectar, Corregir"], correcta: 0 },
        // Sección 2 (preguntas 11-20)
        { texto: "¿Cuántas características de calidad define ISO/IEC 25010?", opciones: ["5", "6", "8", "10"], correcta: 2 },
        { texto: "¿Cuál NO es una característica del modelo ISO 25010?", opciones: ["Usabilidad", "Portabilidad", "Popularidad", "Seguridad"], correcta: 2 },
        { texto: "¿Cuántos niveles de madurez tiene CMMI?", opciones: ["3", "5", "6", "4"], correcta: 1 },
        { texto: "Nivel más alto de CMMI:", opciones: ["Gestionado", "Definido", "Optimizado", "Cuantitativo"], correcta: 2 },
        { texto: "El modelo de McCall se divide en:", opciones: ["Operación, revisión, transición", "Calidad en uso, producto, datos", "Funcional, no funcional", "Niveles 1 a 5"], correcta: 0 },
        { texto: "¿Qué estándar IEEE se usa para documentación de pruebas?", opciones: ["IEEE 830", "IEEE 829", "IEEE 610", "IEEE 730"], correcta: 1 },
        { texto: "¿Qué estándar IEEE se usa para especificación de requisitos (SRS)?", opciones: ["IEEE 830", "IEEE 829", "IEEE 610", "IEEE 730"], correcta: 0 },
        { texto: "¿Qué estándar reemplazó a ISO 9126?", opciones: ["ISO 9001", "ISO/IEC 25010", "ISO 27001", "IEEE 829"], correcta: 1 },
        { texto: "¿Qué significa CMMI?", opciones: ["Capability Maturity Model Integration", "Code Management Maturity Index", "Continuous Measurement Model Interface", "Configuration Management Maturity Integration"], correcta: 0 },
        { texto: "¿Qué modelo de calidad fue pionero y data de 1977?", opciones: ["ISO 25010", "CMMI", "McCall", "ISO 9126"], correcta: 2 },
        // Sección 3 (preguntas 21-30)
        { texto: "¿Qué técnica de caja negra prueba valores justo en los bordes?", opciones: ["Partición de equivalencia", "Valores límite", "Cobertura de ramas", "Tablas de decisión"], correcta: 1 },
        { texto: "¿Qué tipo de prueba verifica que cambios no rompan lo existente?", opciones: ["Unitaria", "Humo", "Regresión", "Estrés"], correcta: 2 },
        { texto: "En pruebas de caja gris, el evaluador:", opciones: ["No conoce nada", "Conoce todo el código", "Tiene conocimiento parcial", "Solo conoce la UI"], correcta: 2 },
        { texto: "¿Qué herramienta se usa para pruebas de carga?", opciones: ["JUnit", "Selenium", "JMeter", "OWASP ZAP"], correcta: 2 },
        { texto: "¿Qué prueba se ejecuta rápidamente para verificar funciones críticas?", opciones: ["Regresión", "Humo", "Carga", "Seguridad"], correcta: 1 },
        { texto: "Causa principal del fallo del Mars Climate Orbiter:", opciones: ["Redondeo", "Confusión newtons/libras", "Fallo en respaldo", "Sobrecalentamiento"], correcta: 1 },
        { texto: "El accidente de Therac-25 fue causado por:", opciones: ["Redondeo", "Condición de carrera", "Unidades", "Base de datos"], correcta: 1 },
        { texto: "La escala SUS mide:", opciones: ["Seguridad", "Rendimiento", "Usabilidad", "Confiabilidad"], correcta: 2 },
        { texto: "¿Qué metodología es más recomendable si los requisitos cambian constantemente?", opciones: ["Cascada", "Scrum", "Modelo en V", "Cascada pura"], correcta: 1 },
        { texto: "¿Qué prueba es más adecuada para simular 1000 usuarios concurrentes?", opciones: ["Unitaria", "Integración", "Carga", "Usabilidad"], correcta: 2 }
    ];

    const container = modal.querySelector('#examenPreguntasContainer');
    if (!container) return;

    // Generar HTML de las preguntas
    let html = '';
    preguntas.forEach((p, idx) => {
        const num = idx + 1;
        html += `<div class="examen-pregunta" style="margin-bottom: 30px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 12px;">`;
        html += `<p><strong>${num}. ${p.texto}</strong></p>`;
        html += `<div class="examen-opciones" style="margin-left: 20px;">`;
        p.opciones.forEach((opt, optIdx) => {
            html += `<div class="examen-opcion" style="margin: 8px 0;">
                        <input type="radio" name="q${num}" value="${optIdx}" id="q${num}_${optIdx}">
                        <label for="q${num}_${optIdx}">${opt}</label>
                     </div>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;

    // Configurar botón de calificar (evitar duplicación de eventos)
    const btnCalificar = modal.querySelector('#btnCalificarExamen');
    if (btnCalificar) {
        // Remover eventos anteriores clonando y reemplazando
        const newBtn = btnCalificar.cloneNode(true);
        btnCalificar.parentNode.replaceChild(newBtn, btnCalificar);
        newBtn.addEventListener('click', () => {
            let aciertos = 0;
            for (let i = 0; i < preguntas.length; i++) {
                const selected = modal.querySelector(`input[name="q${i+1}"]:checked`);
                if (selected && parseInt(selected.value) === preguntas[i].correcta) {
                    aciertos++;
                }
            }
            const nota = (aciertos / preguntas.length) * 10;
            const resultadoDiv = modal.querySelector('#examenResultadoFinal');
            if (resultadoDiv) {
                const aprobado = nota >= 7;
                resultadoDiv.style.display = 'block';
                resultadoDiv.innerHTML = `
                    <strong>Resultado:</strong> ${aciertos}/${preguntas.length} aciertos<br>
                    <strong>Calificación:</strong> ${nota.toFixed(1)} / 10<br><br>
                    ${aprobado ? '<span style="color: #22c55e; font-size: 1.2rem;">✅ ¡APROBADO! Felicidades, dominas los conceptos.</span>' : '<span style="color: #ef4444; font-size: 1.2rem;">❌ REPROBADO. Te sugerimos repasar los módulos y volver a intentarlo.</span>'}
                `;
                // Deshabilitar todos los radios para evitar cambios después de calificar
                modal.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
            }
        });
    }
}

// ====================================================
// EJERCICIOS INTERACTIVOS GLOBALES
// ====================================================
function cargarVF() {
    const container = document.getElementById('ejercicioDinamico');
    if (!container) return;
    
    const preguntasVF = [
        { texto: "QC significa Control de Calidad y se enfoca en prevenir defectos.", respuesta: false, explicacion: "QC se enfoca en ENCONTRAR defectos. QA es preventivo." },
        { texto: "La Ley de Boehm dice que corregir un error en producción cuesta 100 veces más que en requisitos.", respuesta: true, explicacion: "¡Correcto! Por eso es crucial pruebas tempranas." },
        { texto: "ISO 25010 tiene 10 características de calidad.", respuesta: false, explicacion: "Tiene 8 características." },
        { texto: "CMMI nivel 5 es el nivel 'Optimizado'.", respuesta: true, explicacion: "¡Correcto! El nivel 5 es el más alto." },
        { texto: "En UML, la relación «incluye» es opcional.", respuesta: false, explicacion: "«Incluye» es OBLIGATORIO." }
    ];
    
    let idx = 0;
    let aciertos = 0;
    
    function mostrarPregunta() {
        if (idx >= preguntasVF.length) {
            container.innerHTML = `<div class="game-container"><h3>🎉 Resultado: ${aciertos}/${preguntasVF.length}</h3><button class="fill-btn" onclick="cargarVF()">🔄 Jugar de nuevo</button></div>`;
            return;
        }
        const p = preguntasVF[idx];
        container.innerHTML = `
            <div class="game-container">
                <p style="font-size:1.2rem; margin-bottom:20px;">${p.texto}</p>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button class="fill-btn vf-v" data-resp="true" style="background:#22c55e;">✅ Verdadero</button>
                    <button class="fill-btn vf-f" data-resp="false" style="background:#ef4444;">❌ Falso</button>
                </div>
                <div id="vfFeedback" style="margin-top:15px;"></div>
            </div>
        `;
        
        document.querySelector('.vf-v').onclick = () => responder(p, true);
        document.querySelector('.vf-f').onclick = () => responder(p, false);
    }
    
    function responder(pregunta, respuesta) {
        const feedback = document.getElementById('vfFeedback');
        if (respuesta === pregunta.respuesta) {
            aciertos++;
            feedback.innerHTML = `<span style="color:#22c55e">✅ ¡Correcto! ${pregunta.explicacion}</span>`;
        } else {
            feedback.innerHTML = `<span style="color:#ef4444">❌ Incorrecto. ${pregunta.explicacion}</span>`;
        }
        idx++;
        setTimeout(mostrarPregunta, 1500);
    }
    
    mostrarPregunta();
}

function cargarFill() {
    const container = document.getElementById('ejercicioDinamico');
    if (!container) return;
    
    container.innerHTML = `
        <div class="game-container">
            <h3 class="game-title">✏️ Completa los espacios</h3>
            <p>1. El estándar de calidad de producto es ISO/IEC <input type="text" id="fill1" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:120px;"></p>
            <p>2. CMMI tiene <input type="text" id="fill2" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:80px;"> niveles de madurez.</p>
            <p>3. La Ley de <input type="text" id="fill3" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:120px;"> habla del costo de errores.</p>
            <p>4. Las pruebas de <input type="text" id="fill4" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:120px;"> evalúan sin conocer código interno.</p>
            <button class="fill-btn" id="checkFill">✅ Verificar respuestas</button>
            <div id="fillResultado" style="margin-top:15px;"></div>
        </div>
    `;
    
    const checkBtn = document.getElementById('checkFill');
    if (checkBtn) {
        checkBtn.onclick = () => {
            let correctas = 0;
            const r1 = document.getElementById('fill1').value.trim().toUpperCase();
            const r2 = document.getElementById('fill2').value.trim();
            const r3 = document.getElementById('fill3').value.trim().toLowerCase();
            const r4 = document.getElementById('fill4').value.trim().toLowerCase();
            
            if (r1 === '25010') correctas++;
            if (r2 === '5') correctas++;
            if (r3 === 'boehm') correctas++;
            if (r4 === 'caja negra') correctas++;
            
            document.getElementById('fillResultado').innerHTML = `<strong>Resultado: ${correctas}/4 correctas</strong>${correctas === 4 ? ' 🎉 ¡Excelente!' : ' 📚 Sigue practicando.'}`;
        };
    }
}

// ====================================================
// DASHBOARD Y ESTADÍSTICAS DINÁMICAS
// ====================================================

// ====================================================
// ACTUALIZAR DASHBOARD
// ====================================================

function actualizarDashboard() {

    let datosUsuario;
    
    try {
        datosUsuario = JSON.parse(
            localStorage.getItem("estadisticasUsuario")
        );
    } catch {
        datosUsuario = {
            temas: 0,
            progreso: 0,
            juegos: 0,
            promedio: 0
        };
    }
    
    if (!datosUsuario) {
        datosUsuario = {
            temas: 0,
            progreso: 0,
            juegos: 0,
            promedio: 0
        };
    }

    if (document.getElementById("temasCompletados")) {
        document.getElementById("temasCompletados").innerText =
            datosUsuario.temas;
    }

    if (document.getElementById("progresoTotal")) {
        document.getElementById("progresoTotal").innerText =
            datosUsuario.progreso + "%";
    }

    if (document.getElementById("juegosCompletados")) {
        document.getElementById("juegosCompletados").innerText =
            datosUsuario.juegos;
    }

    if (document.getElementById("promedioUsuario")) {
        document.getElementById("promedioUsuario").innerText =
            datosUsuario.promedio + "%";
    }

    actualizarGrafica(datosUsuario.progreso);
}

// ====================================================
// SUMAR PROGRESO
// ====================================================

function sumarProgreso() {

    let datosUsuario;
    
    try {
        datosUsuario = JSON.parse(
            localStorage.getItem("estadisticasUsuario")
        );
    } catch {
        datosUsuario = {
            temas: 0,
            progreso: 0,
            juegos: 0,
            promedio: 0
        };
    }
    
    if (!datosUsuario) {
        datosUsuario = {
            temas: 0,
            progreso: 0,
            juegos: 0,
            promedio: 0
        };
    }

    // Incrementar temas vistos (máximo 16)
    if (datosUsuario.temas < 16) {
        datosUsuario.temas += 1;
    }

    // Calcular progreso basado en temas vistos
    datosUsuario.progreso = Math.round(
        (datosUsuario.temas / 16) * 100
    );

    // Incrementar juegos completados
    datosUsuario.juegos += 1;

    // Incrementar promedio (máximo 100)
    datosUsuario.promedio = Math.min(
        100,
        datosUsuario.promedio + 5
    );

    localStorage.setItem(
        "estadisticasUsuario",
        JSON.stringify(datosUsuario)
    );

    actualizarDashboard();
}

// ====================================================
// GRÁFICA
// ====================================================

let grafica;

function actualizarGrafica(progreso) {

    const ctx = document.getElementById('graficaProgreso');

    if (!ctx) return;

    if (grafica) {
        grafica.destroy();
    }

    grafica = new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: [
                'Completado',
                'Pendiente'
            ],

            datasets: [{
                data: [
                    progreso,
                    100 - progreso
                ],

                backgroundColor: [
                    '#4aa8d4',
                    '#1a2538'
                ],

                borderColor: [
                    '#7bc5e8',
                    '#2c6280'
                ],

                borderWidth: 2
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

actualizarDashboard();

// ====================================================
// CHECKLIST DE USABILIDAD (para modal UI/UX)
// ====================================================
function inicializarChecklistUsabilidad(modal) {
    const btn = modal.querySelector('#calcularChecklistBtn');
    if (!btn) return;
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
        let total = 0;
        for (let i = 1; i <= 10; i++) {
            const chk = modal.querySelector(`#check${i}`);
            if (chk && chk.checked) total++;
        }
        const porcentaje = (total / 10) * 100;
        let mensaje = '';
        if (porcentaje >= 90) mensaje = '🌟 Excelente usabilidad. Cumples casi todos los principios.';
        else if (porcentaje >= 70) mensaje = '👍 Buena usabilidad. Revisa los puntos no marcados para mejorar.';
        else if (porcentaje >= 50) mensaje = '⚠️ Usabilidad aceptable pero con muchas áreas de mejora.';
        else mensaje = '❌ La usabilidad es deficiente. Te recomendamos rediseñar basándote en los principios de Nielsen.';
        const resultadoDiv = modal.querySelector('#resultadoChecklist');
        if (resultadoDiv) {
            resultadoDiv.innerHTML = `<strong>Puntuación: ${total}/10 (${porcentaje}%)</strong><br>${mensaje}`;
        }
    });
}
// ====================================================
// EJERCICIOS INTERACTIVOS (para modal-ejercicios)
// ====================================================
function inicializarJuegosEjercicios(modal) {
    cargarVFEjercicios(modal);
    cargarFillEjercicios(modal);
    inicializarFlashcards(modal);
    inicializarRelacionarConceptos(modal);
    inicializarOrdenarLetras(modal);      // Nueva pestaña ej5
    inicializarSeleccionMultiple(modal);  // Nueva pestaña ej6
}

function cargarVFEjercicios(modal) {
    const container = modal.querySelector('#vfGameContainer');
    if (!container) return;
    
    const preguntas = [
        { texto: "QC significa Control de Calidad y se enfoca en prevenir defectos.", respuesta: false, explicacion: "QC se enfoca en ENCONTRAR defectos. QA es preventivo." },
        { texto: "La Ley de Boehm dice que corregir un error en producción cuesta 100 veces más que en requisitos.", respuesta: true, explicacion: "¡Correcto! Por eso es crucial pruebas tempranas." },
        { texto: "ISO 25010 tiene 10 características de calidad.", respuesta: false, explicacion: "Tiene 8 características." },
        { texto: "CMMI nivel 5 es el nivel 'Optimizado'.", respuesta: true, explicacion: "¡Correcto! El nivel 5 es el más alto." },
        { texto: "En UML, la relación «incluye» es opcional.", respuesta: false, explicacion: "«Incluye» es OBLIGATORIO." },
        { texto: "Las pruebas de caja negra requieren conocer el código fuente.", respuesta: false, explicacion: "Caja negra NO requiere conocer el código interno." },
        { texto: "El modelo de McCall fue creado en 1977.", respuesta: true, explicacion: "Correcto, es uno de los primeros modelos de calidad." },
        { texto: "Las pruebas de regresión verifican que cambios no rompan funcionalidades existentes.", respuesta: true, explicacion: "¡Exacto! Por eso son tan importantes en CI/CD." },
        { texto: "El estándar IEEE 829 se usa para documentación de requisitos.", respuesta: false, explicacion: "IEEE 829 es para documentación de pruebas. IEEE 830 es para requisitos." },
        { texto: "SUS significa System Usability Scale.", respuesta: true, explicacion: "Correcto, mide la usabilidad percibida del sistema." }
    ];
    
    let idx = 0;
    let aciertos = 0;
    
    function mostrar() {
        if (idx >= preguntas.length) {
            container.innerHTML = `<div class="game-container"><h3>🎉 Resultado: ${aciertos}/${preguntas.length}</h3><button class="fill-btn" onclick="location.reload()">🔄 Jugar de nuevo</button></div>`;
            return;
        }
        const p = preguntas[idx];
        container.innerHTML = `
            <div class="game-container">
                <p style="font-size:1.1rem; margin-bottom:20px;">${p.texto}</p>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button class="fill-btn vf-v-ej" data-resp="true" style="background:#22c55e;">✅ Verdadero</button>
                    <button class="fill-btn vf-f-ej" data-resp="false" style="background:#ef4444;">❌ Falso</button>
                </div>
                <div id="vfFeedbackEj" style="margin-top:15px;"></div>
                <p style="margin-top:15px;">Progreso: ${idx + 1}/${preguntas.length} | ✅ Aciertos: ${aciertos}</p>
            </div>
        `;
        
        container.querySelector('.vf-v-ej').onclick = () => responder(p, true);
        container.querySelector('.vf-f-ej').onclick = () => responder(p, false);
    }
    
    function responder(p, resp) {
        const feedback = container.querySelector('#vfFeedbackEj');
        if (resp === p.respuesta) {
            aciertos++;
            feedback.innerHTML = `<span style="color:#22c55e">✅ Correcto. ${p.explicacion}</span>`;
        } else {
            feedback.innerHTML = `<span style="color:#ef4444">❌ Incorrecto. ${p.explicacion}</span>`;
        }
        idx++;
        setTimeout(mostrar, 1500);
    }
    mostrar();
}

function cargarFillEjercicios(modal) {
    const container = modal.querySelector('#fillGameContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="game-container">
            <h3 class="game-title">✏️ Completa los espacios</h3>
            <p>1. El estándar de calidad de producto es ISO/IEC <input type="text" id="fill1" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:120px;"></p>
            <p>2. CMMI tiene <input type="text" id="fill2" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:80px;"> niveles de madurez.</p>
            <p>3. La Ley de <input type="text" id="fill3" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:120px;"> habla del costo de errores.</p>
            <p>4. Las pruebas de <input type="text" id="fill4" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:120px;"> evalúan sin conocer código interno.</p>
            <p>5. La relación <input type="text" id="fill5" placeholder="_____" style="background:var(--primary); border:1px solid var(--border); padding:8px; border-radius:8px; color:white; width:100px;"> en UML es obligatoria.</p>
            <button class="fill-btn" id="checkFillEj">✅ Verificar respuestas</button>
            <div id="fillResultadoEj" style="margin-top:15px;"></div>
        </div>
    `;
    
    const checkBtn = modal.querySelector('#checkFillEj');
    if (checkBtn) {
        checkBtn.onclick = () => {
            let correctas = 0;
            if (modal.querySelector('#fill1')?.value.trim().toUpperCase() === '25010') correctas++;
            if (modal.querySelector('#fill2')?.value.trim() === '5') correctas++;
            if (modal.querySelector('#fill3')?.value.trim().toLowerCase() === 'boehm') correctas++;
            if (modal.querySelector('#fill4')?.value.trim().toLowerCase() === 'caja negra') correctas++;
            if (modal.querySelector('#fill5')?.value.trim().toLowerCase() === 'include') correctas++;
            const resultado = modal.querySelector('#fillResultadoEj');
            if (resultado) resultado.innerHTML = `<strong>Resultado: ${correctas}/5 correctas</strong>${correctas === 5 ? ' 🎉 ¡Excelente!' : ' 📚 Sigue practicando.'}`;
        };
    }
}

function inicializarFlashcards(modal) {
    const container = modal.querySelector('#flashcardContainer');
    if (!container) return;
    
    const flashcards = [
        { termino: "Calidad de Software", definicion: "Grado en que un sistema cumple requisitos y expectativas del cliente (IEEE)." },
        { termino: "QC (Quality Control)", definicion: "Control de Calidad - Actividades para encontrar defectos." },
        { termino: "QA (Quality Assurance)", definicion: "Aseguramiento de Calidad - Actividades para prevenir defectos." },
        { termino: "Ley de Boehm", definicion: "Corregir un error en producción cuesta 100x más que en requisitos." },
        { termino: "ISO 25010", definicion: "8 características de calidad de producto." },
        { termino: "CMMI", definicion: "5 niveles de madurez de procesos." },
        { termino: "Pruebas Unitarias", definicion: "Prueban funciones/métodos individuales. Responsables: desarrolladores." },
        { termino: "Pruebas de Regresión", definicion: "Verifican que cambios recientes no rompan funcionalidades existentes." },
        { termino: "Caja Negra", definicion: "Prueba sin conocer el código interno, basada en entradas y salidas." },
        { termino: "Caja Blanca", definicion: "Prueba conociendo el código fuente, buscando cobertura." }
    ];
    
    let index = 0;
    let isFlipped = false;
    
    container.innerHTML = `
        <div id="flashcardCard" style="background: var(--secondary); width: 100%; max-width: 400px; min-height: 200px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; text-align: center; padding: 20px; font-size: 1.1rem; margin: 0 auto;">
            ${flashcards[0].termino}
        </div>
        <div style="display: flex; gap: 15px; margin-top: 20px; justify-content: center;">
            <button class="fill-btn" id="flashcardPrevEj">◀ Anterior</button>
            <button class="fill-btn" id="flashcardNextEj">Siguiente ▶</button>
        </div>
        <p style="margin-top: 15px; text-align:center;">💡 Haz clic en la tarjeta para voltear</p>
        <p style="text-align:center;"><span id="flashcardCounterEj">1</span> / <span id="flashcardTotalEj">${flashcards.length}</span></p>
    `;
    
    const cardDiv = modal.querySelector('#flashcardCard');
    const prevBtn = modal.querySelector('#flashcardPrevEj');
    const nextBtn = modal.querySelector('#flashcardNextEj');
    const counterSpan = modal.querySelector('#flashcardCounterEj');
    
    if (cardDiv) {
        cardDiv.onclick = () => {
            isFlipped = !isFlipped;
            if (!isFlipped) {
                cardDiv.innerHTML = flashcards[index].termino;
                cardDiv.style.background = 'var(--secondary)';
            } else {
                cardDiv.innerHTML = flashcards[index].definicion;
                cardDiv.style.background = 'var(--accent)';
            }
        };
    }
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (index > 0) {
                index--;
                isFlipped = false;
                cardDiv.innerHTML = flashcards[index].termino;
                cardDiv.style.background = 'var(--secondary)';
                if (counterSpan) counterSpan.textContent = index + 1;
            }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (index < flashcards.length - 1) {
                index++;
                isFlipped = false;
                cardDiv.innerHTML = flashcards[index].termino;
                cardDiv.style.background = 'var(--secondary)';
                if (counterSpan) counterSpan.textContent = index + 1;
            }
        };
    }
}

function inicializarRelacionarConceptos(modal) {
    const container = modal.querySelector('#relacionarContainer');
    if (!container) return;
    
    const pares = [
        { termino: "ISO 25010", definicion: "8 características de calidad de producto" },
        { termino: "CMMI", definicion: "5 niveles de madurez de procesos" },
        { termino: "Pruebas de Regresión", definicion: "Verifica que cambios no rompan lo existente" },
        { termino: "Caja Negra", definicion: "Prueba sin conocer código interno" },
        { termino: "Caja Blanca", definicion: "Prueba conociendo el código fuente" },
        { termino: "Scrum", definicion: "Metodología ágil con sprints de 1-4 semanas" },
        { termino: "Kanban", definicion: "Metodología de flujo continuo con límites WIP" }
    ];
    
    let terminosBarajados = [...pares].sort(() => Math.random() - 0.5);
    let definicionesBarajadas = [...pares].sort(() => Math.random() - 0.5);
    let respuestas = {};
    
    function renderizar() {
        let html = `
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex:1; background: var(--card-bg); border-radius: 12px; padding: 15px;">
                    <h4 style="text-align:center;">📌 Términos</h4>
                    <div id="listaTerminosRel">
        `;
        terminosBarajados.forEach(p => {
            const yaEmparejado = respuestas[p.termino];
            html += `<div class="termino-rel-item" data-termino="${p.termino}" style="background: ${yaEmparejado ? 'var(--success)' : 'var(--secondary)'}; padding: 10px; margin: 8px; border-radius: 8px; cursor: pointer; text-align: center; ${yaEmparejado ? 'opacity:0.6; pointer-events:none;' : ''}">
                        ${p.termino} ${yaEmparejado ? '✓' : ''}
                    </div>`;
        });
        html += `</div></div><div style="flex:1; background: var(--card-bg); border-radius: 12px; padding: 15px;"><h4 style="text-align:center;">📝 Definiciones</h4><div id="listaDefinicionesRel">`;
        definicionesBarajadas.forEach(p => {
            const yaUsada = Object.values(respuestas).includes(p.definicion);
            html += `<div class="definicion-rel-item" data-definicion="${p.definicion}" style="background: ${yaUsada ? 'var(--primary-dark)' : 'rgba(0,0,0,0.3)'}; padding: 10px; margin: 8px; border-radius: 8px; cursor: pointer; ${yaUsada ? 'opacity:0.5; pointer-events:none;' : ''}">
                        ${p.definicion}
                    </div>`;
        });
        html += `</div></div></div><div style="text-align:center; margin-top:20px;"><button class="fill-btn" id="verificarRelacionEj">✅ Verificar respuestas</button></div><div id="resultadoRelacionEj" style="margin-top:15px; text-align:center;"></div>`;
        container.innerHTML = html;
        
        let terminoSeleccionado = null;
        document.querySelectorAll('.termino-rel-item').forEach(el => {
            el.onclick = () => {
                if (el.style.pointerEvents === 'none') return;
                document.querySelectorAll('.termino-rel-item').forEach(t => t.style.border = 'none');
                el.style.border = '2px solid var(--accent-glow)';
                terminoSeleccionado = el.dataset.termino;
            };
        });
        
        document.querySelectorAll('.definicion-rel-item').forEach(el => {
            el.onclick = () => {
                if (!terminoSeleccionado) {
                    alert('Primero selecciona un término');
                    return;
                }
                const definicion = el.dataset.definicion;
                const correcto = pares.find(p => p.termino === terminoSeleccionado && p.definicion === definicion);
                if (correcto && !respuestas[terminoSeleccionado]) {
                    respuestas[terminoSeleccionado] = definicion;
                    renderizar();
                    terminoSeleccionado = null;
                } else if (respuestas[terminoSeleccionado]) {
                    alert('Este término ya fue emparejado');
                } else {
                    alert('Emparejamiento incorrecto');
                    terminoSeleccionado = null;
                }
            };
        });
        
        const verificarBtn = document.getElementById('verificarRelacionEj');
        if (verificarBtn) {
            verificarBtn.onclick = () => {
                const correctas = Object.keys(respuestas).length;
                const resultadoDiv = document.getElementById('resultadoRelacionEj');
                resultadoDiv.innerHTML = `<strong>Has emparejado ${correctas} de ${pares.length} conceptos.</strong>${correctas === pares.length ? ' 🎉 ¡Perfecto!' : ' Sigue practicando.'}`;
            };
        }
    }
    renderizar();
}

function inicializarSopaLetras(modal) {
    const container = modal.querySelector('#sopaLetrasContainer');
    if (!container) return;
    
    const palabras = ["CALIDAD", "PRUEBAS", "ISO", "CMMI", "SCRUM", "QA", "QC", "ERROR", "BOEHM"];
    const tamaño = 12;
    let grid = Array(tamaño).fill().map(() => Array(tamaño).fill(''));
    
    palabras.forEach(palabra => {
        let colocada = false;
        while (!colocada) {
            const fila = Math.floor(Math.random() * tamaño);
            const col = Math.floor(Math.random() * (tamaño - palabra.length + 1));
            const direccion = Math.random() < 0.5 ? 'H' : 'V';
            let valido = true;
            if (direccion === 'H') {
                for (let i = 0; i < palabra.length; i++) {
                    if (grid[fila][col + i] !== '' && grid[fila][col + i] !== palabra[i]) valido = false;
                }
                if (valido) {
                    for (let i = 0; i < palabra.length; i++) grid[fila][col + i] = palabra[i];
                    colocada = true;
                }
            } else {
                if (fila + palabra.length <= tamaño) {
                    for (let i = 0; i < palabra.length; i++) {
                        if (grid[fila + i][col] !== '' && grid[fila + i][col] !== palabra[i]) valido = false;
                    }
                    if (valido) {
                        for (let i = 0; i < palabra.length; i++) grid[fila + i][col] = palabra[i];
                        colocada = true;
                    }
                }
            }
        }
    });
    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            if (grid[i][j] === '') grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }
    
    let encontradas = [];
    
    function renderizarSopa() {
        let html = `<div style="display:grid; grid-template-columns: repeat(${tamaño}, 35px); gap: 2px; justify-content: center;">`;
        for (let i = 0; i < tamaño; i++) {
            for (let j = 0; j < tamaño; j++) {
                const encontrada = encontradas.some(e => e.fila === i && e.col === j);
                html += `<div data-fila="${i}" data-col="${j}" data-letra="${grid[i][j]}" style="width:35px; height:35px; background: ${encontrada ? 'var(--success)' : 'var(--primary-light)'}; border-radius: 6px; display:flex; align-items:center; justify-content:center; font-weight:bold; cursor:pointer; border: 1px solid var(--border);">${grid[i][j]}</div>`;
            }
        }
        html += `</div><div style="margin-top: 15px;">Palabras encontradas: ${encontradas.length / palabras[0].length}/${palabras.length}</div>`;
        container.innerHTML = html;
        
        document.querySelectorAll('#sopaLetrasContainer [data-fila]').forEach(celda => {
            celda.onclick = () => {
                const fila = parseInt(celda.dataset.fila);
                const col = parseInt(celda.dataset.col);
                const letra = celda.dataset.letra;
                // Lógica simplificada para encontrar palabras
                alert(`Letra seleccionada: ${letra}. Esta es una versión simplificada de la sopa de letras. Encuentra todas las palabras: ${palabras.join(", ")}`);
            };
        });
    }
    renderizarSopa();
}

function inicializarCompletarPalabras() {
    setTimeout(() => {
        const btn = document.getElementById('verificarPalabrasBtn');
        if (!btn) return;
        
        const respuestas = {
            palabra1: "CMMI",
            palabra2: "SCRUM",
            palabra3: "ISO25010",
            palabra4: "REGRESION",
            palabra5: "BLANCA",
            palabra6: "SUS"
        };
        
        const verificar = () => {
            let correctas = 0;
            let total = 0;
            
            for (let i = 1; i <= 6; i++) {
                const input = document.getElementById(`palabra${i}`);
                const checkSpan = document.getElementById(`check${i}`);
                if (input && checkSpan) {
                    total++;
                    const valorUsuario = input.value.trim().toUpperCase();
                    const respuestaCorrecta = respuestas[`palabra${i}`];
                    
                    if (valorUsuario === respuestaCorrecta) {
                        correctas++;
                        checkSpan.innerHTML = '✅';
                        checkSpan.style.color = '#22c55e';
                        input.style.borderColor = '#22c55e';
                    } else {
                        checkSpan.innerHTML = '❌';
                        checkSpan.style.color = '#ef4444';
                        input.style.borderColor = '#ef4444';
                    }
                }
            }
            
            const porcentaje = Math.round((correctas / total) * 100);
            const resultadoSpan = document.getElementById('resultadoTexto');
            if (resultadoSpan) {
                resultadoSpan.innerHTML = `${correctas}/${total} respuestas correctas (${porcentaje}%) - ${porcentaje === 100 ? '🎉 ¡Excelente! Completaste todas las palabras.' : '📚 Sigue practicando, revisa las respuestas marcadas con ❌.'}`;
            }
        };
        
        btn.onclick = verificar;
    }, 500);
}
// ====================================================
// JUEGO: ORDENAR LETRAS (pestaña ej5)
// ====================================================
// ====================================================
// JUEGO: ORDENAR LETRAS (pestaña ej5)
// ====================================================
function inicializarOrdenarLetras(modal) {
    const container = modal.querySelector('#ordenarLetrasContainer');
    if (!container) return;
    
    const palabras = [
        { desordenada: "DALIADC", correcta: "CALIDAD", pista: "Grado en que un software cumple requisitos" },
        { desordenada: "SEBSUPAR", correcta: "PRUEBAS", pista: "Actividades para encontrar defectos" },
        { desordenada: "OSI", correcta: "ISO", pista: "Organización internacional de normalización" },
        { desordenada: "MIC C", correcta: "CMMI", pista: "Modelo de madurez de procesos" },
        { desordenada: "MUCR S", correcta: "SCRUM", pista: "Metodología ágil con sprints" },
        { desordenada: "AQ", correcta: "QA", pista: "Aseguramiento de calidad - Previene defectos" },
        { desordenada: "CQ", correcta: "QC", pista: "Control de calidad - Encuentra defectos" },
        { desordenada: "RROE", correcta: "ERROR", pista: "Defecto en el software" },
        { desordenada: "MHEOB", correcta: "BOEHM", pista: "Autor de la ley de costos de errores" }
    ];
    
    let preguntaActual = 0;
    let aciertos = 0;
    let letrasReveladas = 0;
    
    function mostrarPregunta() {
        if (preguntaActual >= palabras.length) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>🎉 ¡Juego completado!</h3>
                    <p>Respuestas correctas: ${aciertos}/${palabras.length}</p>
                    <button class="fill-btn" onclick="location.reload()">🔄 Jugar de nuevo</button>
                </div>
            `;
            return;
        }
        
        letrasReveladas = 0;
        const p = palabras[preguntaActual];
        
        // Generar pista con letras reveladas (máximo 2)
        let palabraConGuiones = '';
        for (let i = 0; i < p.correcta.length; i++) {
            palabraConGuiones += '_ ';
        }
        
        container.innerHTML = `
            <div style="text-align: center;">
                <p style="font-size: 1.8rem; letter-spacing: 8px; margin-bottom: 10px; font-family: monospace;"><strong>${p.desordenada.toUpperCase()}</strong></p>
                <p style="margin-bottom: 20px;">💡 Pista: ${p.pista}</p>
                <p style="margin-bottom: 10px;">📝 Longitud: ${p.correcta.length} letras</p>
                <p style="margin-bottom: 20px; font-size: 1.2rem; letter-spacing: 5px;" id="pistaLetras">${palabraConGuiones}</p>
                <input type="text" id="respuestaOrdenar" placeholder="Escribe la palabra ordenada" style="background: var(--primary); border: 1px solid var(--border); padding: 12px 20px; border-radius: 40px; color: white; width: 250px; text-align: center; text-transform: uppercase;">
                <div style="margin-top: 10px;">
                    <button class="fill-btn" id="revelarLetraBtn" style="background: var(--info); margin-right: 10px;">🔍 Revelar letra (máx 2)</button>
                    <button class="fill-btn" id="verificarOrdenarBtn" style="background: var(--success);">✅ Verificar</button>
                </div>
                <div id="feedbackOrdenar" style="margin-top: 15px;"></div>
                <p style="margin-top: 20px;">Progreso: ${preguntaActual + 1}/${palabras.length} | ✅ Aciertos: ${aciertos}</p>
            </div>
        `;
        
        const input = document.getElementById('respuestaOrdenar');
        const verificarBtn = document.getElementById('verificarOrdenarBtn');
        const revelarBtn = document.getElementById('revelarLetraBtn');
        const pistaLetrasSpan = document.getElementById('pistaLetras');
        
        // Función para revelar una letra (máximo 2)
        revelarBtn.onclick = () => {
            if (letrasReveladas >= 2) {
                alert('Ya has revelado el máximo de 2 letras.');
                return;
            }
            
            // Encontrar una posición no revelada
            let posicionesActuales = pistaLetrasSpan.innerHTML;
            let letrasMostradas = [];
            for (let i = 0; i < p.correcta.length; i++) {
                if (pistaLetrasSpan.innerHTML[i * 2] !== '_') {
                    letrasMostradas.push(i);
                }
            }
            
            for (let i = 0; i < p.correcta.length; i++) {
                if (!letrasMostradas.includes(i)) {
                    // Revelar esta letra
                    let nuevoTexto = '';
                    for (let j = 0; j < p.correcta.length; j++) {
                        if (j === i) {
                            nuevoTexto += p.correcta[j] + ' ';
                        } else if (letrasMostradas.includes(j)) {
                            nuevoTexto += p.correcta[j] + ' ';
                        } else {
                            nuevoTexto += '_ ';
                        }
                    }
                    pistaLetrasSpan.innerHTML = nuevoTexto;
                    letrasReveladas++;
                    break;
                }
            }
            
            if (letrasReveladas === 2) {
                revelarBtn.disabled = true;
                revelarBtn.style.opacity = '0.5';
            }
        };
        
        verificarBtn.onclick = () => {
            const respuesta = input.value.trim().toUpperCase();
            if (respuesta === p.correcta) {
                aciertos++;
                document.getElementById('feedbackOrdenar').innerHTML = '<span style="color: #22c55e;">✅ ¡Correcto!</span>';
                preguntaActual++;
                setTimeout(mostrarPregunta, 1200);
            } else {
                document.getElementById('feedbackOrdenar').innerHTML = `<span style="color: #ef4444;">❌ Incorrecto. La respuesta correcta era: ${p.correcta}</span>`;
                preguntaActual++;
                setTimeout(mostrarPregunta, 1500);
            }
        };
    }
    
    mostrarPregunta();
}

// ====================================================
// JUEGO: SELECCIÓN MÚLTIPLE (pestaña ej6)
// ====================================================
// ====================================================
// JUEGO: SELECCIÓN MÚLTIPLE (pestaña ej6)
// ====================================================
function inicializarSeleccionMultiple(modal) {
    const container = modal.querySelector('#seleccionMultipleContainer');
    if (!container) return;
    
    const preguntas = [
        { texto: "¿Qué significa QC en calidad de software?", opciones: ["Quality Code", "Quality Control", "Quick Check", "Query Command"], correcta: 1 },
        { texto: "¿Cuál es el nivel más alto de CMMI?", opciones: ["Definido", "Gestionado", "Cuantitativo", "Optimizado"], correcta: 3 },
        { texto: "Según la Ley de Boehm, corregir un error en producción cuesta hasta:", opciones: ["10x más", "50x más", "100x más", "200x más"], correcta: 2 },
        { texto: "¿Cuántas características de calidad define ISO 25010?", opciones: ["6", "8", "10", "12"], correcta: 1 },
        { texto: "¿Qué relación UML es OBLIGATORIA entre casos de uso?", opciones: ["Extend", "Include", "Generalización", "Asociación"], correcta: 1 },
        { texto: "¿Qué prueba verifica que cambios no rompan lo existente?", opciones: ["Unitaria", "Integración", "Regresión", "Humo"], correcta: 2 },
        { texto: "¿Qué herramienta se usa para pruebas de carga?", opciones: ["JUnit", "Selenium", "JMeter", "Postman"], correcta: 2 },
        { texto: "¿Qué significa SUS?", opciones: ["System User Score", "Software Usability Standard", "System Usability Scale", "Simple User Scale"], correcta: 2 },
        { texto: "¿Qué modelo de calidad fue pionero en 1977?", opciones: ["ISO 25010", "CMMI", "McCall", "ISO 9126"], correcta: 2 },
        { texto: "Las pruebas de caja negra se basan en:", opciones: ["Código fuente", "Estructura interna", "Entradas y salidas", "Algoritmos complejos"], correcta: 2 }
    ];
    
    let preguntaActual = 0;
    let aciertos = 0;
    
    function mostrarPregunta() {
        if (preguntaActual >= preguntas.length) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>🎉 ¡Cuestionario completado!</h3>
                    <p>Respuestas correctas: ${aciertos}/${preguntas.length}</p>
                    <button class="fill-btn" onclick="location.reload()">🔄 Jugar de nuevo</button>
                </div>
            `;
            return;
        }
        
        const p = preguntas[preguntaActual];
        let html = `
            <div style="text-align: center;">
                <p style="font-size: 1.1rem; margin-bottom: 20px;"><strong>${p.texto}</strong></p>
                <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        `;
        
        p.opciones.forEach((opt, optIdx) => {
            html += `<button class="fill-btn opcion-multiple-ej6" data-opcion="${optIdx}" style="width: 80%; margin: 0; background: var(--secondary);">${opt}</button>`;
        });
        
        html += `
                </div>
                <div id="feedbackMultipleEj6" style="margin-top: 20px;"></div>
                <p style="margin-top: 20px;">Progreso: ${preguntaActual + 1}/${preguntas.length} | ✅ Aciertos: ${aciertos}</p>
            </div>
        `;
        
        container.innerHTML = html;
        
        document.querySelectorAll('.opcion-multiple-ej6').forEach(btn => {
            btn.onclick = () => {
                const seleccion = parseInt(btn.dataset.opcion);
                if (seleccion === p.correcta) {
                    aciertos++;
                    document.getElementById('feedbackMultipleEj6').innerHTML = '<span style="color: #22c55e;">✅ ¡Correcto!</span>';
                } else {
                    document.getElementById('feedbackMultipleEj6').innerHTML = `<span style="color: #ef4444;">❌ Incorrecto. La respuesta correcta era: ${p.opciones[p.correcta]}</span>`;
                }
                preguntaActual++;
                setTimeout(mostrarPregunta, 1500);
            };
        });
    }
    
    mostrarPregunta();
}
// Exponer funciones globalmente
window.cargarVF = cargarVF;
window.cargarFill = cargarFill;