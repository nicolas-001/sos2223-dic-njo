<script>
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";
    // @ts-ignore
    import * as echarts from 'echarts';
  
    let chart;
    /**
     * @type {HTMLDivElement}
     */
    let chartContainer;
  
    let API = "/api/v2/proyection-populations";
  
    if (dev) {
      API = "http://localhost:12345" + API;
    }
  
    /**
     * @type {any[]}
     */
    let populations = [];
    let result = "";
    let resultStatus = "";
    
    onMount(async () => {
      await getpopulations();
      createChart();
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
        // @ts-ignore
        prueba = true;
      } catch (error) {
        console.log(`Error parsing result: ${error}`);
      }
      const status = await res.status;
      // @ts-ignore
      resultStatus = status;
      
    }
    function createChart() {
      const xAxisData = populations.map(populations => `${populations.province}/${populations.gender}/${populations.period}`);
  

      const ageData = populations.map(populations => populations.age);
      const taxData = populations.map(populations => populations.tax);
      const assetData = populations.map(populations => populations.asset_thousand);
  
      const chartOptions = {
        tooltip: {},
        legend: {
          data: ['Año', 'Edad', 'Tasas','Impuestos']
        },
        xAxis: {
          data: xAxisData,
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: 'Value'
        },
        series: [ {
          name: 'Edad',
          type: 'line',
          data: ageData,
          itemStyle: {
            color: '#1f78b4'
          }
        }, {
          name: 'Tasas',
          type: 'line',
          data: taxData,
          itemStyle: {
            color: '#b2df8a'
          }
        }, {
          name: 'Impuestos',
          type: 'line',
          data: assetData,
          itemStyle: {
            color: '#b2bc1f'
          }
        }]
      };
      chart = echarts.init(chartContainer);
      chart.setOption(chartOptions);
    }
  </script>
 <h1 style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline">Gráfica sobre todos mis datos</h1>
 <div style="text-align:center;">
    <strong>Número de datos: {populations.length}</strong>
  </div>

  <div class="chart-container" bind:this={chartContainer}></div>
  <p class="asalaraidos-description" style="text-align:center">
    Gráfico usando echarts
</p>
  <style>
    .chart-container {
      width: 100%;
      height: 500px;
    }
  </style>