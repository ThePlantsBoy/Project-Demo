const portadas = document.querySelectorAll('.book-item img');
const btnOscuro = document.getElementById('boton-oscuro');
const startlightbtn = document.querySelector('.visit-link')
const secondpage = document.querySelector('.second-page')
const maincontainer = document.querySelector('.main-container')
const body = document.querySelector('body')
const header = document.querySelector('.header')

function change_page() {
    secondpage.style.display = "flex";
    maincontainer.style.display = "none";
    header.style.display = "none";
    body.style.backgroundColor = "#46b973"
}

portadas.forEach(portada => {
    portada.addEventListener('click', () => {
        const nombreLibro = portada.alt;

        console.log("Seleccionado: " + nombreLibro);
    });
});


    if (btnOscuro) {
        btnOscuro.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                btnOscuro.textContent = '☀️ Modo Claro';
            } else {
                btnOscuro.textContent = '🌙 Modo Oscuro';
            }
        });
    }

startlightbtn.addEventListener('click', () => (
    change_page()
))
