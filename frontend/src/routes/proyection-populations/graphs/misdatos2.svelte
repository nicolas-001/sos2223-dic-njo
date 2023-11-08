<script>
    // @ts-nocheck
    
        import { onMount } from "svelte";
        import Highcharts from 'highcharts';
        import { dev } from "$app/environment";
    
        let API = "/api/v2/proyection-populations";
        let populations = [];
        let resultStatus = ""; 
        let result = "";
        let nDatos;
        
    
    
        if (dev) {
            API = "http://localhost:12345" + API;
        }
        
        onMount(async () => {
            await getpopulations();
            grafica(populations);
        });
    
        async function getpopulations() {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: "GET",
            });
            try {
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                populations = data;
                nDatos = populations.filter(p => p.period == 2021).length;
            } catch (error) {
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        }
    
        function grafica(datos){
        var filtro = datos.filter(p => p.period == 2021)
        var datax = filtro.map(p=> p.province + "-"+ p.gender)
            
        var serie = [
          
        {
            name: "Tasas",
            data: filtro.map(p => p.tax)
        },
        {
            name: "Impuestos",
            data: filtro.map(p => p.asset_thousand)
        }
      ]
      console.log(serie);
      Highcharts.chart("chart-container", {
        chart: {
          type: 'spline',
        },
        title: {
          text: 'Datos Poblacionales en 2021'
        },
        xAxis: {
          categories: datax,
        },
        yAxis: {
          title: {
            text: 'Datos anuales',
          },
        },
        series: serie
    })
    
        }
      
    </script>
    <h1 style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline">Gráfica sobre los datos en 2021</h1>
    <div style="text-align:center;">
       <strong>Número de datos: {nDatos}</strong>
     </div>
    <div id="chart-container">
    
    </div>
    <p class="asalaraidos-description" style="text-align:center">
      Gráfico usando highcharts
  </p>