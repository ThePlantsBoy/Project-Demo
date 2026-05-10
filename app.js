const portadas = document.querySelectorAll('.book-item img');
const btnOscuro = document.getElementById('boton-oscuro');
const startlightbtn = document.querySelector('.visit-link')
const secondpage = document.querySelector('.second-page')
const maincontainer = document.querySelector('.main-container')
const body = document.querySelector('body')
const header = document.querySelector('.header')
const bdComics = {
    "la-daga": { titulo: "La Daga Sin Nombre", descripcion: "Un arma ancestral...", capitulos: ["Prólogo", "Capítulo 1", "Capítulo 2"] },
    "norte": { titulo: "Los Hombres del Norte", descripcion: "Crónicas de guerra...", capitulos: ["Tierras de Hielo", "El Clan del Lobo"] },
    "verano": { titulo: "Hasta que el Verano se Acabe", descripcion: "Una historia sobre promesas...", capitulos: ["Junio", "Julio", "Agosto"] },
    "jackson": { titulo: "Percy Jackson", descripcion: "Un joven descubre...", capitulos: ["Profesora vaporizada", "Mi padre es un Dios"] },
    "assassins": { titulo: "Assassin's Creed", descripcion: "Ezio viaja a Roma...", capitulos: ["Renacimiento", "La Hermandad"] },
    "dc": { titulo: "DC: Kingdom Come", descripcion: "Futuro de héroes...", capitulos: ["Extraños Visitantes", "Justicia Absoluta"] },
    "batman": { titulo: "Batman: White Knight", descripcion: "¿Joker curado?", capitulos: ["Cura Milagrosa", "Jack Napier"] },
    "avatar": { titulo: "Avatar: La Búsqueda", descripcion: "Zuko busca a su madre...", capitulos: ["Parte 1", "Parte 2", "Parte 3"] },
    "hellboy": { titulo: "Hellboy", descripcion: "Barco fantasma...", capitulos: ["El Barco", "Abismos"] },
    "godzilla": { titulo: "Godzilla", descripcion: "Rey de los Monstruos...", capitulos: ["Monarca", "Ruinas", "El Rey"] }
};

const panel = document.getElementById('info-panel');
const panelImg = document.getElementById('panel-img');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-description');
const listaCaps = document.querySelector('.chapters-list');
const btnLeerAhora = document.getElementById('start-reading-btn');
let comicSeleccionadoId = null;

document.querySelectorAll('.tab-link').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-link, .tab-content').forEach(el => el.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

document.querySelectorAll('.book-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if(e.target.classList.contains('fav-btn')) {
            e.target.classList.toggle('active');
            e.target.style.color = e.target.classList.contains('active') ? "black" : "gold";
    e.target.style.background = e.target.classList.contains('active') ? "gold" : "rgba(0,0,0,0.7)";
            return;

        }
        const id = item.getAttribute('data-id'); 
        const info = bdComics[id];
        if(info) {
            comicSeleccionadoId = id;
            panelImg.src = item.querySelector('img').src;
            panelTitle.textContent = info.titulo;
            panelDesc.textContent = info.descripcion;
            
            listaCaps.innerHTML = "";
            info.capitulos.forEach((cap, index) => {
                const li = document.createElement('li');
                li.className = 'chapter-item';
                li.innerHTML = `<span>${index + 1}</span> ${cap}`;
                li.onclick = () => iniciarLectura(id, index);
                listaCaps.appendChild(li);
            });
            panel.classList.add('active');
        }
    });
});

function iniciarLectura(id, indiceCap) {
    localStorage.setItem(`progreso_${id}`, indiceCap);
    alert(`📖 Leyendo: ${bdComics[id].titulo} - ${bdComics[id].capitulos[indiceCap]}`);
}

btnLeerAhora.onclick = () => {
    if(comicSeleccionadoId) {
        const guardado = localStorage.getItem(`progreso_${comicSeleccionadoId}`) || 0;
        iniciarLectura(comicSeleccionadoId, parseInt(guardado));
    }
};

document.querySelector('.close-panel-btn').onclick = () => panel.classList.remove('active');

document.getElementById('boton-oscuro').onclick = () => {
    document.body.classList.toggle('dark-mode');
};

document.querySelector('.visit-link').onclick = (e) => {
    e.preventDefault();
    document.querySelector('.second-page').style.display = "block";
    document.querySelector('.main-container').style.display = "none";
    document.querySelector('.header').style.display = "none";
    body.style.backgroundColor = '#ADFAC4'
};
document.querySelector('.starlight-logo-text2').onclick = (e) => {
    e.preventDefault();
    document.querySelector('.second-page').style.display = "block";
    document.querySelector('.main-container').style.display = "none";
    document.querySelector('.header').style.display = "none";
    body.style.backgroundColor = '#ADFAC4'
};

document.querySelector('.open-starlight').onclick = (e) => {
    document.querySelector('.starlight').style.display = "flex";
    document.querySelector('.open-starlight').style.display = "none";
    document.querySelector('.close-starlight').style.display = "flex";
}
document.querySelector('.close-starlight').onclick = (e) => {
    document.querySelector('.starlight').style.display = "none";
    document.querySelector('.open-starlight').style.display = "flex";
    document.querySelector('.close-starlight').style.display = "none";
}
