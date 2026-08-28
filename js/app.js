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
        case '1': cantidad = base * 1.15; break;
        case '2': cantidad = base * 1.05; break;
        case '3': cantidad = base * 1.35; break;
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

Interfaz.prototype.llenarOpciones = () =>{
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

    div.classList.add('mensaje', 'mt-4', 'animate-pulse');
    div.textContent = mensaje;

    const form = document.querySelector('#cotizar-seguro');
    form.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

Interfaz.prototype.mostrarResultado = (seguro, total)=>{
    const {marca, year, tipo} = seguro;

    let textoMarca;
    switch(marca){
        case '1': textoMarca = 'Americano'; break;
        case '2': textoMarca = 'Asiático'; break;
        case '3': textoMarca = 'Europeo'; break;
        default: break;
    }

    // Definir imagen temática según el tipo de seguro
    const imagenSeguro = tipo === 'basico' 
        ? 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80' // Imagen protectora / auto estándar
        : 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'; // Imagen auto de lujo / cobertura total

    const div = document.createElement('div');
    div.classList.add('mt-6', 'bg-gray-50', 'border', 'border-indigo-100', 'rounded-2xl', 'overflow-hidden', 'shadow-md');
    div.innerHTML = `
        <div class="bg-indigo-600 text-white font-bold text-center py-3 uppercase tracking-wider text-sm">
            Resumen de tu Cotización
        </div>
        <div class="relative h-40 w-full overflow-hidden">
            <img src="${imagenSeguro}" alt="Seguro ${tipo}" class="w-full h-full object-cover">
            <span class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full uppercase font-semibold">
                ${tipo}
            </span>
        </div>
        <div class="p-6 space-y-2 text-gray-700">
            <p class="flex justify-between border-b pb-2"><span class="font-semibold">Marca:</span> <span class="text-gray-900">${textoMarca}</span></p>
            <p class="flex justify-between border-b pb-2"><span class="font-semibold">Año:</span> <span class="text-gray-900">${year}</span></p>
            <p class="flex justify-between border-b pb-2"><span class="font-semibold">Tipo:</span> <span class="text-gray-900 capitalize">${tipo}</span></p>
            <div class="flex justify-between items-center pt-2">
                <span class="font-bold text-lg text-indigo-600">Total Estimado:</span> 
                <span class="font-extrabold text-2xl text-indigo-700">$${total}</span>
            </div>
        </div>
    `;

    const resultadoDiv = document.querySelector('#resultado'); 
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 2000);
}

const interfaz = new Interfaz();

document.addEventListener('DOMContentLoaded', () => {
    interfaz.llenarOpciones();
});

listaEventos();
function listaEventos(){
    const form = document.querySelector('#cotizar-seguro');
    form.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name=tipo]:checked').value;

    if(marca === '' || year === '' || tipo === ''){
        interfaz.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    interfaz.mostrarMensaje('Calculando tu cotización...', 'exito');

    const resultados = document.querySelector('#resultado div');
    if(resultados != null){
        resultados.remove();
    }

    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    interfaz.mostrarResultado(seguro, total);
}
