            //################################################//
            //#                                              #//
            //#      TRABAJO SEGUNDA EVALUACIÓN LMSXI        #//
            //#                                              #//
            //#      Archivo: script1.js                     #//
            //#      Autor: Francisco J. Pájaro Rives        #//
            //#      Última modificación: 2015-02-16         #//
            //#                                              #//
            //################################################//

(function main() {

            ///////////////////////////////////
            ///     VARIABLES GLOBALES      ///
            ///////////////////////////////////

"use strict";
var re = /img\/galeria\/imagen..\.jpg/, // expresión regular para extraer la ruta relativa de los <img>.
    imagesRoutes = [], // array para poner las rutas relativas de los <img> de la galería.
    canvasOpeners = document.getElementsByClassName('ampliar'), // array con los enlaces de los <img> que inician el slider.

    i, // contador que usan todos los for.
    canvas = document.getElementById('marco').parentElement, // caja que contiene el slider.
    placeholders = document.getElementById('marco').getElementsByTagName('div'), // array con los 3 <div> que forman el slider.

    // Estas tres variables guardan qué placeholders se encuentran posicionados a la izquierda, derecha, y centro (el único visible del slide).
    // Aunque se inicialicen con el mismo orden con el que aparecen en el código html, conforme se mueva el slider esto ya no será así.
    phIzq = placeholders[0],
    phCtro = placeholders[1],
    phDcha = placeholders[2],
    currPhotoIndex,
    nav1Links = document.getElementById('slideNav1').getElementsByTagName('a'), // array con los enlaces de navegación del slider.
    nav2Links = document.getElementById('slideNav2').getElementsByTagName('a'),
    slideCloseButton = document.getElementById('marco').parentElement.getElementsByTagName('a')[document.getElementById('marco').parentElement.getElementsByTagName('a').length - 1], // botón para cerrar el slider.
    on = 0,
    state;

            ///////////////////////////
            ///     FUNCIONES       ///
            ///////////////////////////

// Asigna al array imagesRoutes las rutas relativas de las imágenes de la galería.
function relRoutes() {
    var galImgs = document.getElementsByTagName('section')[0].getElementsByTagName('img');
    for (i = 0; i < galImgs.length; i++) {
        imagesRoutes[i] = galImgs[i].src.match(re)[0];
    }
}

// Carga las imágenes de previsualización que correspondan a cada botón.
function loadPreview() {
    for (i = 0; i < imagesRoutes.length; i++) {
        nav2Links[i + 12].style.backgroundImage = 'url(' + imagesRoutes[i] + ')';
    }
}

// Muestra y oculta alternativamente la caja del slider (coge como parámetro el evento que la ha iniciado).
function switchCanvas(e) {
    if (window.getComputedStyle(canvas).display === "none") { // si está invisible, 1º le asigna las fotos iniciales y después la hace visible.
        loadInitialPhoto(e);
        canvas.style.display = "initial";
    } else { // si está visible, la hace invisible
        on = 1;
        clearInterval(state);
        canvas.style.display = "none";
        toggleSlider();
        nav2Links[currPhotoIndex].style.backgroundColor = "red";
    }
}

// Asigna la foto inicial que se verá en el marco del slider y las que están a su izquierda y a su derecha.
function loadInitialPhoto(e) {
    // Extrae la ruta relativa del enlace de imagen que abrió el slider (match devuelve un array aunque solo haya una coincidencia).
    var currPhoto = e.target.parentElement.parentElement.getElementsByTagName('img')[0].src.match(re)[0];

    // Examina las rutas relativas de todas las imágenes de la galería hasta encontrar una coincidencia con la imagen del enlace que abrió el slider.
    // Después configura la imagen de fondo de cada placeholder acorde a su posición.
    for (i = 0; i < imagesRoutes.length; i++) {
        if (currPhoto === imagesRoutes[i]) {
            currPhotoIndex = i;
            phCtro.style.backgroundImage = 'url(' + imagesRoutes[currPhotoIndex] + ')';
            changeNavLinks();
            break;
        }
    }
}

// Mueve las cajas con las fotos según se pulsen los enlaces.
function triggerSlider(e) {
    var phTemp = phCtro;

    // si pulsamos el enlace de navegación de la izquierda, los placeholders se mueven de manera distinta a si pulsamos el de la derecha.
    if (e.target === nav1Links[0]) {
        loadLeftPhoto();

        phIzq.style.animation = "fromLeftToCenter 2s";
        phIzq.style.animationFillMode = "forwards";
        phCtro.style.animation = "fromCenterToRight 2s";
        phCtro.style.animationFillMode = "forwards";
        phDcha.style.left = "auto";
        phDcha.style.right = "100%";

        phCtro = phIzq;
        phIzq = phDcha;
        phDcha = phTemp;

        changeNavLinks();

    } else {
        loadRightPhoto();

        phIzq.style.left = "100%";
        phIzq.style.right = "auto";
        phCtro.style.animation = "fromCenterToLeft 2s";
        phCtro.style.animationFillMode = "forwards";
        phDcha.style.animation = "fromRightToCenter 2s";
        phDcha.style.animationFillMode = "forwards";

        phCtro = phDcha;
        phDcha = phIzq;
        phIzq = phTemp;

        changeNavLinks();
    }
}

/*loadLeftPhoto y loadRightPhoto cargan las fotos que se verán cuando pulsemos los botones de retroceso, avance, o le demos al play y cargen automáticamente.*/
function loadLeftPhoto() {
    if (imagesRoutes[currPhotoIndex] === imagesRoutes[0]) {
        phIzq.style.backgroundImage = 'url(' + imagesRoutes[imagesRoutes.length - 1] + ')';
        currPhotoIndex = imagesRoutes.length - 1;
    } else {
        phIzq.style.backgroundImage = 'url(' + imagesRoutes[currPhotoIndex - 1] + ')';
        currPhotoIndex--;
    }
}

function loadRightPhoto() {
    if (imagesRoutes[currPhotoIndex] === imagesRoutes[imagesRoutes.length - 1]) {
        phDcha.style.backgroundImage = 'url(' + imagesRoutes[0] + ')';
        currPhotoIndex = 0;
    } else {
        phDcha.style.backgroundImage = 'url(' + imagesRoutes[currPhotoIndex + 1] + ')';
        currPhotoIndex++;
    }
}

/*Activa el slider automático.*/
function toggleSlider() {
    if (on === 0) {
        on = 1;
        nav1Links[2].style.backgroundImage = "url('img/galeria/PauseButton1.png')";
        nav1Links[0].style.display = "none";
        nav1Links[1].style.display = "none";
        triggerSlider(on);
        state = setInterval(function () {triggerSlider(on); }, 6667);
    } else {
        on = 0;
        nav1Links[2].style.backgroundImage = "url('img/galeria/PlayButton1.png')";
        nav1Links[0].style.display = "initial";
        nav1Links[1].style.display = "initial";
        clearInterval(state);
    }
}

/*Activa la imagen de previsualización correspondiente.*/
function activPreview(i) {
    return function () {
        if (i != currPhotoIndex) {
            nav2Links[i + 12].style.display = "initial";
        }
    };
}

/*Desactiva la imagen de previsualización correspondiente.*/
function deactivPreview(i) {
    return function () {
        nav2Links[i + 12].style.display = "none";
    };
}

/*Carga en el marco del slider la imagen correspondiente al botón que hayamos clicado.*/
function loadPreviewPhoto(i) {
    return function () {
        if (i != currPhotoIndex) {
            currPhotoIndex = i;
            phCtro.style.backgroundImage = 'url(' + imagesRoutes[currPhotoIndex] + ')';
            changeNavLinks();
        }
    };
}

/*Reasigna los estilos de los botones de la 2ª barra de navegación para que el botón de la imagen que se esté viendo actualmente en el slider tenga un estilo diferente al resto.*/
function changeNavLinks() {
    for (i = 0; i < imagesRoutes.length; i++) {
        nav2Links[i].style.backgroundColor = "red";
    }
    nav2Links[currPhotoIndex].style.backgroundColor = "orange";
}

            ///////////////////////
            ///     EVENTOS     ///
            ///////////////////////

window.addEventListener('load', relRoutes); // guardamos todas las rutas relativas al cargar la página...
window.addEventListener('load', loadPreview); // ... así como las imágenes de previsualización correspondientes.

for (i = 0; i < canvasOpeners.length; i++) { // todos los enlaces para ampliar imágenes abrirán el slider.
    canvasOpeners[i].addEventListener('click', switchCanvas);
}

slideCloseButton.addEventListener('click', switchCanvas); // este botón cerrará el slider.

// se podrá navegar por el slider tanto hacia adelante como hacia atrás.
nav1Links[0].addEventListener("click", triggerSlider);
nav1Links[1].addEventListener("click", triggerSlider);
nav1Links[2].addEventListener("click", toggleSlider);

// todos los botones de la 2ª barra de navegación del slider cargarán su foto correspondiente y activarán/desactivarán su imagen de previsualización correspondiente.
for (i = 0; i < canvasOpeners.length; i++) {
    nav2Links[i].addEventListener('mouseover', activPreview(i));
    nav2Links[i].addEventListener('mouseout', deactivPreview(i));
    nav2Links[i].addEventListener('click', loadPreviewPhoto(i));
}

})();
