// Constructores  
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function(){
    let cantidad; 
    const base = 2000;

    switch(this.marca){
        case '1': cantidad = base * 1.15; break; // Americano
        case '2': cantidad = base * 1.05; break; // Asiático
        case '3': cantidad = base * 1.35; break; // Europeo
        default: break;
    } 

    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    return cantidad.toFixed(2);
}

function Interfaz(){}

Interfaz.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

Interfaz.prototype.mostrarMensaje = (mensaje, tipo) => {
    const alertaPrevia = document.querySelector('.mensaje');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    const div = document.createElement('div');
    if(tipo === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'animate-pulse');
    div.textContent = mensaje;

    const resultadoDiv = document.querySelector('#resultado');
    resultadoDiv.insertBefore(div, resultadoDiv.firstChild);

    setTimeout(() => {
        div.remove();
    }, 3000);
}

Interfaz.prototype.mostrarResultado = (seguro, total) => {
    const {marca, year, tipo} = seguro;

    let textoMarca;
    let urlImagenVehiculo;

    switch(marca){
        case '1': 
            textoMarca = 'Americano'; 
            urlImagenVehiculo = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop';
            break;
        case '2': 
            textoMarca = 'Asiático'; 
            urlImagenVehiculo = 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop';
            break;
        case '3': 
            textoMarca = 'Europeo'; 
            urlImagenVehiculo = 'https://images.unsplash.com/photo-1503376710362-80f43a2862bc?q=80&w=800&auto=format&fit=crop';
            break;
        default: break;
    }

    // Actualizar Panel Izquierdo (Imagen, Título y Badge dinámicos)
    const tagIzq = document.querySelector('#tag-izq');
    const tituloIzq = document.querySelector('#titulo-izq');
    const subtituloIzq = document.querySelector('#subtitulo-izq');
    const imagenAuto = document.querySelector('#imagen-auto');

    if(tagIzq) tagIzq.textContent = `Cotización: ${tipo.toUpperCase()}`;
    if(tituloIzq) tituloIzq.textContent = `${textoMarca} ${year}`;
    if(subtituloIzq) subtituloIzq.textContent = `Tu seguro incluye la cobertura ${tipo} con la mejor asistencia vial.`;
    if(imagenAuto) imagenAuto.src = urlImagenVehiculo;

    // Resumen Compacto en el Panel Derecho (SIN imagen)
    const div = document.createElement('div');
    div.classList.add('bg-gray-50', 'border', 'border-indigo-100', 'rounded-xl', 'overflow-hidden', 'shadow-sm');
    div.innerHTML = `
        <div class="bg-indigo-600 text-white font-bold text-center py-2 uppercase tracking-wider text-xs">
            Resumen de tu Cotización
        </div>
        <div class="p-4 space-y-2 text-xs text-gray-700">
            <p class="flex justify-between border-b border-gray-200 pb-1.5"><span class="font-semibold text-gray-600">Marca:</span> <span class="text-gray-900 font-medium">${textoMarca}</span></p>
            <p class="flex justify-between border-b border-gray-200 pb-1.5"><span class="font-semibold text-gray-600">Año:</span> <span class="text-gray-900 font-medium">${year}</span></p>
            <p class="flex justify-between border-b border-gray-200 pb-1.5"><span class="font-semibold text-gray-600">Tipo:</span> <span class="text-gray-900 font-medium capitalize">${tipo}</span></p>
            <div class="flex justify-between items-center pt-2">
                <span class="font-bold text-sm text-indigo-600">Total Estimado:</span> 
                <span class="font-extrabold text-xl text-indigo-700">$${total}</span>
            </div>
        </div>
    `;

    const resultadoDiv = document.querySelector('#resultado'); 
    const spinner = document.querySelector('#cargando');
    
    // Limpiar resultados anteriores
    const resumenPrevio = resultadoDiv.querySelector('.bg-gray-50');
    if(resumenPrevio){
        resumenPrevio.remove();
    }
    
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 1500);
}

const interfaz = new Interfaz();

document.addEventListener('DOMContentLoaded', () => {
    interfaz.llenarOpciones();
    listaEventos();
});

function listaEventos(){
    const form = document.querySelector('#cotizar-seguro');
    form.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipoSeleccionado = document.querySelector('input[name=tipo]:checked');
    
    if(marca === '' || year === '' || !tipoSeleccionado){
        interfaz.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    const tipo = tipoSeleccionado.value;

    interfaz.mostrarMensaje('Calculando tu cotización...', 'correcto');

    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    interfaz.mostrarResultado(seguro, total);
}
