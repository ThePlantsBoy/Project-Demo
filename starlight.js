// Base de datos de Personajes para el Carrusel Infinito
const listadoPersonajes = [
    {
        nombre: "Plants, The Immortal Vessel",
        descripcion: "Plants it's the first one i created, and the same one that stick thought my whole life, as a immortal being he always taking risk and care's a lot for anyone around him.",
        b1: "He squishy and almost like he doesn't have bones.",
        b2: "Dying become such a habit that he just, doesn't care about it anymore.",
        imagen: "plants(character).png"
    },
    {
        nombre: "Starlight Héroe",
        descripcion: "El misterioso guardián del núcleo del pasado. Sus poderes provienen directamente de los recuerdos felices guardados antes de la gran fragmentación cósmica.",
        b1: "Puede materializar herramientas hechas de luz pura.",
        b2: "Tiene un vínculo empático directo con Plants.",
        imagen: "https://marmota.me/wp-content/uploads/WP-manga/data/manga_69feaeb3a5835/73a2b3197b4ef987a7b81569a4275885/Ben-10-001-(2026)-000---Cover-A.jpg"
    }
];

let indexPersonajeActual = 0;
let trackIndexGaleria = 0;

// Elementos del DOM de Control de Vistas
const secciones = {
    home: document.getElementById('sec-home'),
    chars: document.getElementById('sec-characters'),
    gallery: document.getElementById('sec-gallery'),
    studio: document.getElementById('sec-studio')
};

// Cambiar de pantallas de manera segura
function activarSeccion(targetKey) {
    Object.keys(secciones).forEach(key => {
        if(key === targetKey) {
            secciones[key].classList.remove('hidden');
        } else {
            secciones[key].classList.add('hidden');
        }
    });
}

// Eventos de Navegación del Header
document.getElementById('btn-home-starlight').onclick = () => activarSeccion('home');
document.getElementById('nav-chars').onclick = () => { activarSeccion('chars'); actualizarPersonaje(); };
document.getElementById('nav-gallery').onclick = () => activarSeccion('gallery');
document.getElementById('nav-studio').onclick = () => activarSeccion('studio');

document.querySelectorAll('.btn-back-start').forEach(btn => {
    btn.onclick = () => activarSeccion('home');
});

// --- LÓGICA DESKTOP 2: CARRUSEL INFINITO DE PERSONAJES ---
function actualizarPersonaje() {
    const p = listadoPersonajes[indexPersonajeActual];
    document.getElementById('char-name').textContent = p.nombre;
    document.getElementById('char-desc').textContent = p.descripcion;
    document.getElementById('bullet1').textContent = p.b1;
    document.getElementById('bullet2').textContent = p.b2;
    document.getElementById('char-img').src = p.imagen;
}

document.getElementById('next-char').onclick = () => {
    indexPersonajeActual = (indexPersonajeActual + 1) % listadoPersonajes.length; // Reseteo infinito hacia adelante
    actualizarPersonaje();
};

document.getElementById('prev-char').onclick = () => {
    indexPersonajeActual = (indexPersonajeActual - 1 + listadoPersonajes.length) % listadoPersonajes.length; // Hacia atrás
    actualizarPersonaje();
};

// --- LÓGICA DESKTOP 3: GALERÍA DESLIZABLE ---
const track = document.getElementById('gallery-track');
document.getElementById('next-gal').onclick = () => {
    const items = document.querySelectorAll('.gallery-item');
    if (trackIndexGaleria < items.length - 1) {
        trackIndexGaleria++;
        ajustarDesplazamientoGaleria();
    }
};

document.getElementById('prev-gal').onclick = () => {
    if (trackIndexGaleria > 0) {
        trackIndexGaleria--;
        ajustarDesplazamientoGaleria();
    }
};

function ajustarDesplazamientoGaleria() {
    const anchoItem = document.querySelector('.gallery-item').offsetWidth + 20; // Ancho + gap
    track.style.transform = `translateX(-${trackIndexGaleria * anchoItem}px)`;
}

// --- LÓGICA SECCIÓN 4: ESTUDIO DE CÓMICS (CANVAS) ---
const canvas = document.getElementById('comic-canvas');
const ctx = canvas.getContext('2d');
let dibujando = false;
let tipoHerramienta = "brush"; // brush, eraser, bucket

// Inicializar Canvas con fondo blanco nativo
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Configuración de herramientas de dibujo
const inputColor = document.getElementById('tool-color');
const inputGrosor = document.getElementById('tool-size');
const displayGrosor = document.getElementById('brush-val');

inputGrosor.oninput = () => displayGrosor.textContent = inputGrosor.value;

// Intercambio de estados visuales en los botones de herramienta
function setHerramientaActiva(btnId, clave) {
    document.querySelectorAll('.flex-buttons .custom-btn').forEach(b => b.classList.remove('tool-active'));
    document.getElementById(btnId).classList.add('tool-active');
    tipoHerramienta = clave;
}

document.getElementById('tool-brush').onclick = () => setHerramientaActiva('tool-brush', 'brush');
document.getElementById('tool-eraser').onclick = () => setHerramientaActiva('tool-eraser', 'eraser');
document.getElementById('tool-bucket').onclick = () => setHerramientaActiva('tool-bucket', 'bucket');

// Controladores de dibujo de ratón y pantallas táctiles
canvas.addEventListener('mousedown', iniciarDibujo);
canvas.addEventListener('mousemove', dibujar);
canvas.addEventListener('mouseup', detenerDibujo);
canvas.addEventListener('mouseleave', detenerDibujo);

function iniciarDibujo(e) {
    if (tipoHerramienta === 'bucket') {
        rellenarLienzoCompleto();
        return;
    }
    dibujando = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function dibujar(e) {
    if (!dibujando) return;
    
    ctx.lineWidth = inputGrosor.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tipoHerramienta === 'brush') {
        ctx.strokeStyle = inputColor.value;
    } else if (tipoHerramienta === 'eraser') {
        ctx.strokeStyle = '#ffffff'; // El borrador pinta en blanco
    }

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function detenerDibujo() { dibujando = false; }

function rellenarLienzoCompleto() {
    ctx.fillStyle = inputColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Limpiar lienzo
document.getElementById('btn-clear-canvas').onclick = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    aplicarPlantilla();
};

// Generador de plantillas predeterminadas de viñetas de Cómic
const selectorPlantilla = document.getElementById('tool-template');
selectorPlantilla.onchange = aplicarPlantilla;

function aplicarPlantilla() {
    const modelo = selectorPlantilla.value;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;

    if (modelo === "2-panels") {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
    } else if (modelo === "3-panels") {
        ctx.beginPath();
        // Línea divisoria central vertical
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        // Línea horizontal en la mitad derecha
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    } else if (modelo === "4-panels") {
        ctx.beginPath();
        // Cruz simétrica
        ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }
}

// GUARDAR EN BIBLIOTECA LOCAL DEL USUARIO
const gridBiblioteca = document.getElementById('library-grid');
document.getElementById('btn-save-library').onclick = () => {
    const dataURL = canvas.toDataURL();
    let misComics = JSON.parse(localStorage.getItem('starlight_library')) || [];
    misComics.push(dataURL);
    localStorage.setItem('starlight_library', JSON.stringify(misComics));
    renderizarBiblioteca();
    alert("¡Cómic guardado en tu biblioteca privada!");
};

function renderizarBiblioteca() {
    let misComics = JSON.parse(localStorage.getItem('starlight_library')) || [];
    if (misComics.length === 0) return;

    gridBiblioteca.innerHTML = "";
    misComics.forEach((srcImg, index) => {
        const item = document.createElement('div');
        item.className = "library-item";
        item.innerHTML = `
            <img src="${srcImg}" alt="Mi Comic ${index + 1}">
            <p style="font-size:0.8rem; margin-bottom:5px;">Cómic #${index + 1}</p>
        `;
        gridBiblioteca.appendChild(item);
    });
}

// PUBLICAR EN FANDOM-SQUAD (Simulado vía LocalStorage)
document.getElementById('btn-publish-fandom').onclick = () => {
    const imgData = canvas.toDataURL();
    localStorage.setItem('comic_publicado_starlight', imgData);
    alert("¡Tu cómic ha sido enviado y publicado exitosamente en Fandom-Squad! Ahora aparecerá en la sección de novedades.");
};

// Ejecutar al cargar archivo
window.onload = () => {
    renderizarBiblioteca();
};
