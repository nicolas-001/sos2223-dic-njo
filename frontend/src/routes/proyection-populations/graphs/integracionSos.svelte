<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { Button } from "sveltestrap";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    //import { dev } from "$app/environment";

    let API = "https://sos2223-dic-njo.ew.r.appspot.com/api/v2/proyection-populations"
    let API2 = "https://sos2223-12.ew.r.appspot.com/api/v2/agroclimatic";

    let grafica = [];
    let grafica2 = [];
    let nDatos ;
    let tax = [];
    let asset = [];
    

    let province_period = [];

    
    let minT = [];
    let medT = [];

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
                grafica2 = valores2;
                grafica2.forEach((grafica2) => {
                    console.log(grafica2);
                    province_period.push(
                        grafica2.province + "-" + grafica2.year
                    );
                    
                    minT.push(grafica2["minimun_temperature"]);
                    medT.push(grafica2["medium_temperature"]);

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
                    
                    minT.push(0);
                    medT.push(0);
                });
            } catch (error) {
                console.log(`Error devolviendo la gráfica: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        } else {
            console.log("Error al cargar la gráfica");
        }

        await delay(500);
        nDatos = province_period.length;
        loadChart();
    }

    async function loadChart() {
        var options = {
            series: [
                {
                    name: "Tasas",
                    data: tax,
                },
                {
                    name: "Impuestos",
                    data: asset,
                },
                
                {
                    name: "Temperatura minima",
                    data: minT,
                },
                {
                    name: "Temperatura media",
                    data: medT
                }
            ],
            chart: {
                type: "area",
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            xaxis: {
                categories: province_period,
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

        var chart = new ApexCharts(document.querySelector("#chart"), options);
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

<main>
    <h1
        style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline"
    >
        Integracion con medio-ambiente 
    </h1>

<div style="text-align:center;">
  <strong>Número de datos: {nDatos}</strong>
</div>
    <figure
        class="asalariados-figure"
        style="margin-left: 25px; margin-right:25px"
    >
        <div id="chart" />
        <p class="asalaraidos-description" style="text-align:center">
            Gráfico de Columnas sobre las Proyeccion de poblacion y los datos de medio-ambiente realizada con apexcharts
        </p>
    </figure>
    <br />
</main>