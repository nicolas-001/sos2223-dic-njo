<script>
    //@ts-nocheck
    import { Table } from "sveltestrap";
    import { Button} from "sveltestrap";
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  
    let result = "";
    let resultStatus = "";
  
    let datos = [];
    let nDatos = 0;
  
    let nombre = [];
    let temporada = [];
    let posicion = [];
    let name = [];
  
    
  
    onMount(async () => {
      getDatos3();
    });
  
    const url = 'https://api-formula-1.p.rapidapi.com/rankings/drivers?season=2021';
    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '812e20fa2bmsh0bb10e8b6ffd031p11e6a1jsn3a9cfee14d26',
		'X-RapidAPI-Host': 'api-formula-1.p.rapidapi.com'
	}
};
    async function getDatos3() {
      resultStatus = result = "";
      const res = await fetch(url, options); //rest.then(res =>fetch(res.url, options));//fetch(rest,{
      //method: "GET"
      //});
      if (res.ok) {
        try {
          const data = await res.json();
          result = JSON.stringify(data, null, 2);
          datos = data;
          const extractedData = data.response.map(driver => ({
    position: driver.position,
    name: driver.driver.name,
    
        }));
        function compareRandom() {
    return Math.random() - 0.5;
}

// Ordenar los objetos de manera aleatoria
const shuffledData = extractedData.slice().sort(compareRandom);  
        shuffledData.forEach((element) => {
            posicion.push(element["position"]);
            name.push(element["name"]);
            nDatos +=1;
          });
        } catch (error) {
          console.log(`Error parseando el resultado: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
      } else {
        console.log("Error al devolver la gráfica");
      }
      await delay(500);
      loadChart3();
    }
  
    async function loadChart3() {
      var dataPlot = [
        {
          x: name,
          y: posicion,
          type: "bars",
          name: "Posicion",
        },
        {
          x: name,
          y: name,
          type: "bars",
          name: "Nombre",
        },
      ];
  
      var layout = {
        font: { size: 8 },
      };
  
      var config = {
        responsive: true,
      };
  
      Plotly.newPlot("myDiv", dataPlot, layout, config);
    }
    
  </script>
  <br />
  <svelte:head>
    <script src="https://cdn.plot.ly/plotly-2.20.0.min.js"></script>
  </svelte:head>
  
  
  
  <main>
    <h2
      style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline"
    >
      Uso de datos Fórmula 1
    </h2>
    <div
  style="text-align: center; font-family:'Times New Roman', Times, serif; font-weight: bold; font-size:20px; color:blue"
>
  Uso api sobre Formula 1
  <br />
</div>
    <div style="text-align:center;">
      <strong>Número de datos: {nDatos}</strong>
    </div>
    <h4
      style="font-size:12px; font-family: 'Times New Roman', Times, serif; text-align:center; font-weight: bold;"
    >
      Gráfica con Plotly
    </h4>
    <br />
    <p style="text-align: center;">
      
    </p>
    <div id="myDiv" />
  
    <p style="text-align: center;">
      Datos sobre el ranking de Fórmula 1 realizando con plotly
    </p>
    <br />
    <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">
      <div style="text-align:center">
          <Button color="primary" href="/">Volver a Inicio</Button>
      </div>
  </main>