const input = document.querySelector("#input")
const btn = document.querySelector("#btn")
//obteneniendo data de la API
async function divisas(){
    const res = await fetch ("https://mindicador.cl/api")
    const monedas = await res.json()
    return monedas

}
//obteniendo valores especificos de la API
async function divisasHistoricas(moneda, fecha){
    const res = await fetch ("https://mindicador.cl/api/${moneda}/${fecha}")
    const monedas = await res.json()
    return monedas

}

//template asincrono del select
async function opciones(){
    const data = await divisas()
    const divisa =(Object.keys(data))//object pide la data y la conviere en array
    //template
    let html = `<select name="divisa" id="seleccionador">`//se inicia la etiqueta select
   divisa.forEach(element =>  {
       if(data[element].unidad_medida == 'Pesos'){

        html +=`<option value="${data[element].codigo}-${data[element].valor}">${data[element].nombre}}</option>`;//opciones dinamicas

       }
    })
    html += `</select>`//cierre de etiqueta
    document.querySelector("#select").innerHTML= html
}
//funcion del boton
btn.addEventListener("click", async function(){
    const valor = input.value;
    divisa = document.querySelector("#seleccionador").value.split('-');
    const operacion = valor/divisa[1] //division entre valores
    document.querySelector("#resultado").innerHTML= `<p>Resultado: $${operacion.toFixed(4)}</p>`;
    //obteniendo fecha
    const codigoMoneda = divisa[0];
    const fecha = new Date();
    let fechas =[];
    let valores = [];

let ultimoValor= 0;
    for(i = 10; i > 0 ;i --){
        
        const dia = fecha.getDate()-i
        const mes = fecha.getMonth()+1
        const ano = fecha.getFullYear() 
        const fechaCompleta = `${dia},${mes},${ano}`//variable que muestra la fecha completa
        const dataHistorico = await divisasHistoricas(codigoMoneda,fechaCompleta);

        fechas.push(fechaCompleta);
        if (dataHistorico.serie.length > 0){
           
        valores.push(dataHistorico.serie[0].valor);
        ultimoValor = dataHistorico.serie[0].valor;
        }else{
        valores.push(ultimoValor)
        }
    }

    grafica(fechas,valores)//funcion que llama al grafio al momento de hace click
} )


// chart de grafica
function grafica (fechas, valores){
  const ctx = document.getElementById('myChart');


  const data = {
    labels: fechas,
    datasets: [{
      label: 'Historico',
      data: valores,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  new Chart(ctx, {
    type: 'line',
    data: data
    
  });
}
opciones()

