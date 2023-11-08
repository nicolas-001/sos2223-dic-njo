
<script>
    //@ts-nocheck
    import { Table } from "sveltestrap";
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  
    let datos = [];
    let result = "";
    let resultStatus = "";
  
    let API = "https://sos2223-12.ew.r.appspot.com/api/v2/pollutions";
  
   
  
    let rank = [];
    
  
    
  
    let ejex = [];
  
    onMount(async () => {
      getDatos();
    });
  
  
    const url = 'https://tennis-live-data.p.rapidapi.com/rankings/ATP';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '812e20fa2bmsh0bb10e8b6ffd031p11e6a1jsn3a9cfee14d26',
		'X-RapidAPI-Host': 'tennis-live-data.p.rapidapi.com'
	}
};
//data.results.rankings.map
async function getDatos() {
    resultStatus = result = "";
    const res = await fetch(url, options);

    if (res.ok) {
      try {
        const data = await res.json();
        result = JSON.stringify(data, null, 2);
        datos = data.results.rankings.slice(0,20);
        console.log(datos.length);
        datos.forEach((element) => {
          ejex.push(element["full_name"] + "-" +element["country"]);
          rank.push(element["ranking"]);

          
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
    loadChartA();
  }

  async function loadChartA() {
    var options = {
      series: [
        {
          name: "Posicion",
          data: rank,
        },
        
      ],
      chart: {
        type: "bar",
        height: 350,
      },plotOptions: {
          bar: {
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ejex,
      },
      yaxis: {
        title: {
          text: "Valor",
        },
      },
      fill: {
        opacity: 1,
      },
    };

    var chart = new ApexCharts(document.querySelector("#chart7"), options);
    chart.render();
  }
</script>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  <script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"
  ></script>
  <link rel="stylesheet" type="text/css" href="css/style.css" />
</svelte:head>

<h1
style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline"
>
Uso de Api sobre ranking de tenis
</h1>
<div
  style="text-align: center; font-family:'Times New Roman', Times, serif; font-weight: bold; font-size:20px; color:blue"
>
  Uso de datos del ranking ATP.
  <br />
</div>
<hr style="text-align: right; margin-left: 100px; margin-right: 100px;" />

<main>
  <div style="text-align:center;">
    <strong>Número de datos: {datos.length}</strong>
  </div>
  <h4
    style="font-size:12px; font-family: 'Times New Roman', Times, serif; text-align:center; font-weight: bold;"
  >
    Gráfica con ApexChart
  </h4>

  <div style="max-width: 600px; margin: 0 auto;">
    <figure class="figure" style="margin-left: 25px; margin-right:25px">
      <div id="chart7" />
      <p class="description" style="text-align:center">
        Gráfica de datos sobre el ranking ATP.
      </p>
    </figure>
  </div>
  <br />
</main>