const starlightPanel = document.getElementById('starlight-panel');
const infoPanel = document.getElementById('info-panel');
const reader = document.getElementById('reading-overlay');
const pdfViewer = document.getElementById('pdf-viewer');
const btnBackMenu = document.getElementById('btn-back-menu');
const btnRecomendaciones = document.getElementById('btn-recomendaciones');
const genreMenu = document.getElementById('genre-menu');
const searchBar = document.getElementById('search-bar');
const botonOscuro = document.getElementById('boton-oscuro');
const usuarioNuevo = document.getElementById('Usuario')

// Selectores nuevos para los controles de navegación internos del lector
const btnReaderBack = document.getElementById('btn-reader-back');
const btnReaderPrev = document.getElementById('btn-reader-prev');
const btnReaderNext = document.getElementById('btn-reader-next');

let currentComicId = "";
let currentCapIndex = 0;

// Sistema de Ripple Effect (Ondas 3D en botones)
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.querySelector(".ripple");
    if (ripple) {
        ripple.remove();
    }
    button.appendChild(circle);
}

document.querySelectorAll('.custom-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});

// Inicialización de la página
document.addEventListener('DOMContentLoaded', () => {
    cargarFavoritosStorage();
    cargarModoOscuro();
});

// Refrescar página guardando estado al tocar el Título (Preserva el LocalStorage intacto)
document.getElementById('logo-home').onclick = () => {
    window.location.reload(); 
};

// Lógica buscador en tiempo real
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.book-item').forEach(item => {
        const id = item.dataset.id;
        const title = bdComics[id].titulo.toLowerCase();
        
        if(title.includes(term)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
});

// Menú de categorías (Recomendaciones)
btnRecomendaciones.onclick = () => {
    genreMenu.classList.toggle('show');
    if(genreMenu.classList.contains('show')) {
        btnRecomendaciones.textContent = "Recomendaciones ⬆";
    } else {
        btnRecomendaciones.textContent = "Recomendaciones ⬇";
    }
};

document.getElementById('btn-starlight-toggle').onclick = (e) => {
    e.stopPropagation();
    starlightPanel.classList.toggle('hidden-panel');
    infoPanel.classList.remove('active');
};

document.getElementById('btn-favs-toggle').onclick = () => mostrarFavoritos();

document.getElementById('btn-back-menu').onclick = () => {
    btnBackMenu.classList.add('hidden');
    document.querySelectorAll('.book-item').forEach(item => item.classList.remove('hidden'));
    searchBar.value = ""; // Limpiar busqueda
};

// Clics en los cómics
document.querySelectorAll('.book-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if(e.target.classList.contains('fav-btn')) return;
        const id = item.dataset.id;
        abrirPanelInfo(id, item.querySelector('img').src);
    });
});

function abrirPanelInfo(id, imgSrc) {
    const info = bdComics[id];
    currentComicId = id;
    document.getElementById('panel-img').src = imgSrc;
    document.getElementById('panel-title').textContent = info.titulo;
    document.getElementById('panel-author').textContent = info.autor;
    document.getElementById('panel-description').textContent = info.sinopsis;
    
    const lista = document.querySelector('.chapters-list');
    lista.innerHTML = "";
    info.capitulos.forEach((cap, i) => {
        const li = document.createElement('li');
        li.className = "chapter-item";
        // Números pequeños según modo claro/oscuro
        li.innerHTML = `<span class="chapter-num">#${i+1}</span> ${cap}`;
        li.onclick = () => abrirLector(id, i);
        lista.appendChild(li);
    });

    infoPanel.classList.add('active');
    starlightPanel.classList.add('hidden-panel');
}

// Lector Inmersivo
function abrirLector(id, index) {
    const comic = bdComics[id];
    currentComicId = id;
    currentCapIndex = index;
    
    localStorage.setItem(`last_comic`, id);
    localStorage.setItem(`last_cap_${id}`, index);

    pdfViewer.src = comic.links[index];
    reader.classList.remove('hidden');
    
    // Gestión dinámica de los nuevos botones de navegación (Ocultar si no hay extremos realizables)
    if (index <= 0) {
        btnReaderPrev.classList.add('hidden');
    } else {
        btnReaderPrev.classList.remove('hidden');
    }

    if (index >= comic.links.length - 1) {
        btnReaderNext.classList.add('hidden');
    } else {
        btnReaderNext.classList.remove('hidden');
    }

    // Mostrar Toast
    const toast = document.getElementById('toast-exit');
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// Asignación de acciones a los nuevos botones del lector superior
btnReaderBack.onclick = () => cerrarLector();

btnReaderPrev.onclick = () => {
    if (currentCapIndex > 0) {
        abrirLector(currentComicId, currentCapIndex - 1);
    }
};

btnReaderNext.onclick = () => {
    const comic = bdComics[currentComicId];
    if (currentCapIndex < comic.links.length - 1) {
        abrirLector(currentComicId, currentCapIndex + 1);
    }
};

// Salir del lector con ESC o Doble Clic
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape" && !reader.classList.contains('hidden')) {
        cerrarLector();
    }
});

reader.addEventListener('dblclick', () => {
    cerrarLector();
});

function cerrarLector() {
    reader.classList.add('hidden');
    pdfViewer.src = "";
}

document.getElementById('start-reading-btn').onclick = () => {
    const lastCap = localStorage.getItem(`last_cap_${currentComicId}`) || 0;
    abrirLector(currentComicId, parseInt(lastCap));
};

// Favoritos rediseñado
document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.closest('.book-item').dataset.id;
        
        let favs = JSON.parse(localStorage.getItem('fandom_favs')) || [];
        
        if (btn.classList.contains('active-fav')) {
            // Desactivar
            btn.classList.remove('active-fav');
            btn.innerHTML = "⭐";
            favs = favs.filter(f => f !== id);
        } else {
            // Activar
            btn.classList.add('active-fav');
            btn.innerHTML = "🌟";
            if (!favs.includes(id)) favs.push(id);
        }
        localStorage.setItem('fandom_favs', JSON.stringify(favs));
    };
});

function cargarFavoritosStorage() {
    const favs = JSON.parse(localStorage.getItem('fandom_favs')) || [];
    document.querySelectorAll('.book-item').forEach(item => {
        if (favs.includes(item.dataset.id)) {
            const btn = item.querySelector('.fav-btn');
            btn.classList.add('active-fav');
            btn.innerHTML = "🌟";
        }
    });
}

function mostrarFavoritos() {
    const favs = JSON.parse(localStorage.getItem('fandom_favs')) || [];
    btnBackMenu.classList.remove('hidden');
    document.querySelectorAll('.book-item').forEach(item => {
        item.classList.toggle('hidden', !favs.includes(item.dataset.id));
    });
}

// Manejo de clicks fuera de paneles
window.onclick = function(event) {
    if (infoPanel.classList.contains('active') && !infoPanel.contains(event.target) && !event.target.closest('.book-item')) {
        infoPanel.classList.remove('active');
    }
    if (!starlightPanel.classList.contains('hidden-panel') && !starlightPanel.contains(event.target) && event.target.id !== 'btn-starlight-toggle') {
        starlightPanel.classList.add('hidden-panel');
    }
};

document.getElementById('close-info').onclick = () => infoPanel.classList.remove('active');

// Modo Oscuro Persistente
botonOscuro.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('fandom_dark_mode', isDark);
    actualizarBotonOscuro(isDark);
};

function cargarModoOscuro() {
    const isDark = localStorage.getItem('fandom_dark_mode') === 'true';
    if(isDark) {
        document.body.classList.add('dark-mode');
    }
    actualizarBotonOscuro(isDark);
}

function actualizarBotonOscuro(isDark) {
    if(isDark) {
        botonOscuro.innerHTML = "☀️ Modo Claro";
    } else {
        botonOscuro.innerHTML = "🌙 Modo Oscuro";
    }
}

// Pestañas
document.querySelectorAll('.tab-link').forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll('.tab-link, .tab-content').forEach(el => el.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    };
});

// Efecto 3D Cards
document.querySelectorAll('.book-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const width = card.clientWidth;
        const height = card.clientHeight;
        const xVal = e.offsetX / width - 0.5;
        const yVal = e.offsetY / height - 0.5;
        const yAxis = xVal * 25;
        const xAxis = -yVal * 25;
        card.style.transform = `rotateY(${yAxis}deg) rotateX(${xAxis}deg) scale(1.05)`;
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transition = 'all 0.5s ease-out';
        card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
});

// Filtrado por botones de género
const genreButtons = document.querySelectorAll(".category-btn");
genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        const genre = button.dataset.genre;
        document.querySelectorAll('.book-item').forEach(comic => {
            if(genre === "all" || comic.dataset.genre === genre) {
                comic.classList.remove('hidden');
            } else {
                comic.classList.add('hidden');
            }
        });
        btnBackMenu.classList.remove('hidden'); // Permitir reset
    });
});

function obtenerCookie(nombre) {

    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {

        let [clave, valor] = cookie.trim().split("=");

        if (clave === nombre) {
            return valor;
        }
    }

    return null;
}

function crearCuenta() {

    const usuario = document.getElementById("usuario-registrado");

    const password = document.getElementById("usuario-contraseña");

    let error = false;

    usuario.classList.remove("input-error");
    password.classList.remove("input-error");

    if (usuario.value.trim() === "") {

        usuario.classList.add("input-error");
        error = true;
    }

    if (password.value.trim() === "") {

        password.classList.add("input-error");
        error = true;
    }

    if (error) return;

    let cuentas = [];

    const cookieCuentas = obtenerCookie("cuentas");
    
    if (cookieCuentas) {
        cuentas = JSON.parse(
            decodeURIComponent(cookieCuentas)
        );
    }
    const existe = cuentas.some(cuenta => cuenta.usuario === usuario.value);

    if (existe) {

    alert("Cuenta ya existente");
    return;
}

    cuentas.push({
        usuario: usuario.value,
        password: password.value
    });

    document.cookie = `cuentas=${encodeURIComponent(JSON.stringify(cuentas))}; max-age=50000; path=/`;

    alert("Cuenta creada");
}

function login() {

    const usuarioIngresado =
        document.getElementById("usuario-login").value;

    const passwordIngresada =
        document.getElementById("usuario-contraseña-login").value;

    const cookieCuentas = obtenerCookie("cuentas");

    if (!cookieCuentas) {
        alert("No hay cuentas registradas");
        return;
    }

    const cuentas = JSON.parse(
        decodeURIComponent(cookieCuentas)
    );

    const cuenta = cuentas.find(
        cuenta =>
            cuenta.usuario === usuarioIngresado &&
            cuenta.password === passwordIngresada
    );

    if (cuenta) {
        document.cookie =
            `sesion=${usuarioIngresado}; max-age=50000; path=/`;
        alert("Bienvenido");

    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

const usuarioActivo = obtenerCookie("sesion");

if (usuarioActivo) {
    document.getElementById("Usuario").textContent = usuarioActivo;
    document.getElementById("Usuario").classList.remove("hidden");
    document.getElementById('inicio-session').classList.add('hidden')
    document.getElementById('Crear-cuenta').classList.add('hidden')
}

document.getElementById('New-Account-btn').addEventListener('click', () => {
    crearCuenta();
});

document.getElementById('New-login-btn').addEventListener('click', () => {
    login();
});

document.getElementById('Crear-cuenta').onclick = (e) => {
    e.stopPropagation();
    document.querySelector('.ui-crear-cuenta').classList.remove('hidden');
};

document.getElementById('inicio-session').onclick = (e) => {
    e.stopPropagation();
    document.querySelector('.ui-sesion-cuenta').classList.remove('hidden');
    document.querySelector('.ui-sesion-cuenta').classList.remove('hidden');
};
