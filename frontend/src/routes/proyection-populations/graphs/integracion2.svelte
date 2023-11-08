<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { Button } from "sveltestrap";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    //import { dev } from "$app/environment";
    import * as echarts from 'echarts';
    let API = "https://sos2223-dic-njo.ew.r.appspot.com/api/v2/proyection-populations"
    let API2 = "https://sos2223-dic-njo.appspot.com/api/v2/market";

    let grafica = [];
    let grafica2 = [];
  let nDatos;
    let tax = [];
    let asset = [];
    let chart;
    /**
     * @type {HTMLDivElement}
     */
    let chartContainer;

    let province_period = [];

    
    let pibC = [];
    let pibP = [];

    let result = "";
    let resultStatus = "";
    let result2 = "";
    let resultStatus2 = "";

    onMount(async () => {
        getGraph();
        
    });

    async function getGraph() {
        resultStatus2 = result2 = "";
        const res2 = await fetch(API2, {
            method: "GET",
        });

        if (res2.ok) {
            try {
                const valores2 = await res2.json();
                result2 = JSON.stringify(valores2, null, 2);
                grafica2 = valores2.slice(0,20);
  //              for (let i = 0; i < grafica2.response.length; i++) {
  //grafica2.response[i].pib_current_price /= 1000; // Dividir el campo 'age' por 2
//}
                grafica2.forEach((grafica2) => {
                    console.log(grafica2);
                    province_period.push(
                        grafica2.province + "-" + grafica2.year
                    );
                    
                    pibC.push(grafica2["pib_current_price"]);
                    pibP.push(grafica2["pib_percentage_structure"]);
                    pibC = pibC.map(element => element % 100);


                    tax.push(0);
                    asset.push(0);
                    
                });
            } catch (error) {
                console.log(`Error devolviendo la gráfica: ${error}`);
            }
            const status2 = await res2.status;
            resultStatus2 = status2;
        } else {
            console.log("Error al cargar la gráfica");
        }

        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });

        if (res.ok) {
            try {
                const valores = await res.json();
                result = JSON.stringify(valores, null, 2);

                grafica = valores;
                grafica.sort((a, b) =>
                    a.period> b.period
                        ? 1
                        : b.period > a.period
                        ? -1
                        : 0
                );
                grafica.sort((a, b) =>
                    a.province > b.province
                        ? 1
                        : b.province > a.province
                        ? -1
                        : 0
                );
                
                grafica.forEach((grafica) => {
                    console.log(grafica);

                    tax.push(parseInt(grafica["tax"]));
                    asset.push(parseInt(grafica["asset_thousand"]));
                    
                    province_period.push(
                         grafica.period +"-"+ grafica.province
                    );
                    
                    pibC.push(0);
                    pibP.push(0);
                });
            } catch (error) {
                console.log(`Error devolviendo la gráfica: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        } else {
            console.log("Error al cargar la gráfica");
        }
        
        createChart();
        
    }

    function createChart() {
      const xAxisData = province_period;
      const taxData = tax;
      const assetData = asset;
      const pibcData = pibC;
      const pibpData = pibP;
      nDatos = province_period.length;

      
  
      const chartOptions = {
        tooltip: {},
        legend: {
          data: ['PibC', 'PibP', 'Tasas','Impuestos']
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
          name: 'Tasas',
          type: 'bar',
          data: taxData,
          itemStyle: {
            color: '#1f78b4'
          }
        }, {
          name: 'Impuestos',
          type: 'bar',
          data: assetData,
          itemStyle: {
            color: '#b2df8a'
          }
        }, {
          name: 'PibC',
          type: 'bar',
          data: pibcData,
          itemStyle: {
            color: '#b2bc1f'
          },
          
        },
        {
          name: 'PibP',
          type: 'bar',
          data: pibpData,
          itemStyle: {
            color: '#b2bc1f'
          },
          
        }]
      };
      chart = echarts.init(chartContainer);
      chart.setOption(chartOptions);
    }
  </script>
  <h1
  style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline"
>
  Integracion con Economía
</h1>
<div style="text-align:center;">
  <strong>Número de datos: {nDatos}</strong>
</div>
  <div class="chart-container" bind:this={chartContainer}></div>
  <p class="asalaraidos-description" style="text-align:center">
    Gráfico de Columnas sobre las Proyeccion de poblacion y los datos de economia realizada con echarts
    y usando un proxy
</p>
  <style>
    .chart-container {
      width: 100%;
      height: 500px;
    }
  </style>