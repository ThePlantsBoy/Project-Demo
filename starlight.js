// Base de datos de Personajes para el Carrusel Infinito
const listadoPersonajes = [
    {
        nombre: "Plants, El Vessel immortal",
        descripcion: "Plants es un humano con la capacidad de evitar la muerte, y siempre se pondra enfrente del peligro para ayudar a los que les importa, sus amigos son la razon que nunca se a rendido",
        lore: "El fue el primer que cree cuando andaba apenas entrando al mundo de la ficción, siendo lo que básicamente me caracteriza incluso hasta el dia de hoy, incluso luego de tantos cambios, todavia siento que puedo cambiar su diseño y darle un poco de toques a su historia, pero es algo que intentare manejar!",
        b1: "Su cuerpo es blando, sus huesos tambien, hacinedolo muy bueno para abrazos como si estuvieras abrazando un peluche",
        b2: "Morir se volvio algo tan normal para el que realmente no le importa mucho si lo hace",
        imagen: "Textures/plants(character).png"
    },
    {
        nombre: "Past, El Caballero Amable",
        descripcion: "Past es el alma y escudo del equipo, el mismo se encarga de que todos esten en buen estado no importando la situacion, pelea hasta su ultimo aliento",
        lore: "La idea de Past fue mayormente para tener alguien en el grupo que sea pacifita pero no tenga miedo de proteger a sus amigos, sin mencionar que antes tenia una historia algo mas.. confusa, Past es ese personaje que le tengo aprecio mucho por cosas personales, y que, de cierto modo me ayudaron mucho en conocer gente maravillosa durante mis años de vida",
        b1: "Tiene un escudo echo por su padre, que puede usar para protejerse asi mismo y sus amigos alrededor, capaz de aguanta de lo peor",
        b2: "Es un gran cocinero, pero es el unico de su grupo que es capaz de cocinar, intento enseñarle a plants.. para que luego quemara toda la cocina",
        imagen: "Textures/Past.png"
    },
    {
        nombre: "Lily, Ex-Mercenaria",
        descripcion: "El Cerebro y el planeadora del equipo, incluso si plants es el lider del grupo, ella siempre tiene un plan b cuando las cosas no parecen funcionar bien, mejor que nada!",
        lore: "Lily iba a ser mayormente el diseño femenino de plants antes de su rediseño, decidi cambiar esa idea para darle una personalidad de una líder de un grupo mercenario, siendo la mente del grupo, Incluso asi Lily sigue siendo un oc que quiero dejar ya como esta sin mencionar que su diseño es el unico que casi no a cambiado igual que a Past",
        b1: "Electricity being her speciality, but also, she being extremely weak to physical combat",
        b2: "extremely shy to talk to new people unless the others present her",
        imagen: "Textures/Lily.png"
    },
    {
        nombre: "Zetary, Pesadilla Cristalizada",
        descripcion: "El Muro y pared, capaz de tomar todo tipo de complicacion y usarlo en fuerza, su corazon es de crystal y esta listo para hacer lo que sea para mantener a sus amigos, lo que sea.",
        lore: "El iba a ser uno de los villanos principales para el grupo, pero la idea de que el estuviera con el grupo me prencio mejor, sin mencionar que no soy muy bueno haciendo villanos a veces, pero no quitara que pienso hacerlo un antagonista para intentar probar esa idea otra vez quien sabe talvez asi llamo la antencion de personas que le gusta villanos con telekinesis, o solo gente que le gusta los plot twist",
        b1: "El es un amante de cafe, pero tiene problemas de sueño por culpa de su telekinesis",
        b2: "A diferencia de sus compañeros, el no tomara ninguna chance si necesita matar a alguien",
        imagen: "Textures/Zetary.png"
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
    document.getElementById('char-lore').textContent = p.lore;
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
const track = document.getElementById("gallery-track");
const items = document.querySelectorAll(".gallery-item");

let activeIndex = 0;

function updateCarousel() {

    items.forEach((item, i) => {

        const offset = i - activeIndex;

        let rotateY = offset * -45;
        let translateZ = Math.abs(offset) * -100;
        let scale = i === activeIndex ? 1 : 0.8;
        let opacity = i === activeIndex ? 1 : 0.5;

        item.style.transform = `
            rotateY(${rotateY}deg)
            translateZ(${translateZ}px)
            scale(${scale})
        `;

        item.style.opacity = opacity;
    });

    track.style.transform = `
        translateX(calc(50% - ${activeIndex * 290}px - 125px))
    `;
}

document.getElementById("next-gal").addEventListener("click", () => {

    if(activeIndex < items.length - 1){
        activeIndex++;
        updateCarousel();
    }
});

document.getElementById("prev-gal").addEventListener("click", () => {

    if(activeIndex > 0){
        activeIndex--;
        updateCarousel();
    }
});

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
canvas.addEventListener('pointerdown', iniciarDibujo);
canvas.addEventListener('pointermove', dibujar);
canvas.addEventListener('pointerup', detenerDibujo);
canvas.addEventListener('pointerleave', detenerDibujo);
canvas.addEventListener('pointercancel', detenerDibujo);


function obtenerPosicion(e) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function iniciarDibujo(e) {
    if (tipoHerramienta === 'bucket') {
        rellenarLienzoCompleto();
        return;
    }

    const pos = obtenerPosicion(e)
    
    dibujando = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function dibujar(e) {
    if (!dibujando) return;
    
    const pos = obtenerPosicion(e);

    ctx.lineWidth = inputGrosor.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tipoHerramienta === 'brush') {
        ctx.strokeStyle = inputColor.value;
    } else if (tipoHerramienta === 'eraser') {
        ctx.strokeStyle = '#ffffff'; // El borrador pinta en blanco
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function detenerDibujo() { 
    dibujando = false;
    ctx.closePath();
}

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
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
