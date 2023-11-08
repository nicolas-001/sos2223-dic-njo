<script>
    // @ts-nocheck
   import { onMount } from "svelte";
        import { dev } from "$app/environment";
        import { Button, Table } from 'sveltestrap';
        import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
    
        onMount(async () =>{
            getPopulations();
        });
        let API = "/api/v2/proyection-populations";
        let mensajeUsuario = "";
        let mensajePaginacion = "";
        if(dev)
            API = "http://localhost:12345"+API
            
        let populations = [];
        let newPopulationsProvince = "";
        let newPopulationsPeriod = "";
        let newPopulationsGender = "";
        let newPopulationsAge= "";
        let newPopulationsAssetThousand = "";
        let newPopulationsTax= "";
        let result = "";
        let resultStatus = "";
        let from = "";
        let to = "";
        let period = "";
        let province = "";
        let gender = "";
        let age_under = "";
        let age_over = "";
        let asset_under = "";
        let asset_over = "";
        let tax_under = "";
        let tax_over = "";
    
        async function loadData(){
            resultStatus = result = "";
            const res = await fetch(API+'/loadInitialData', {
                method: 'GET'
            });
            const status = await res.status;
            resultStatus = status;
            if(status==200){
                mensajeUsuario = "Se han insertado los datos de nuevo";
                getPopulations();
            }else{
                mensajeUsuario = "No se han podido insertar los datos de nuevo";
            }
        }
        async function getPopulations(){
            resultStatus = result = "";
            const res = await fetch(API+"?offset=-1&limit=10", {
                method: "GET"
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                populations = data;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        }
        async function getPopulationsFiltrado(){
            const consulta = {}; // crea un objeto vacío para los otros campo
            if (province) { 
                consulta.province = province; 
            }
            if (period) { 
                consulta.period = period; 
            }
            if (from) { 
                consulta.from = from; 
            }
            if (to) { 
                consulta.to = to; 
            }
            if (gender) { 
                consulta.gender = gender; 
            }
            if (age_under) { 
                consulta.age_under = age_under; 
            }
            if (age_over) { 
                consulta.age_over = age_over; 
            }
            if (tax_under) { 
                consulta.tax_under = tax_under; 
            }
            if (tax_over) { 
                consulta.tax_over = tax_over; 
            }
            if (asset_under) { 
                consulta.asset_under = asset_under; 
            }
            if (asset_over) { 
                consulta.asset_over = asset_over; 
            }
            console.log(new URLSearchParams(consulta).toString());
            const res = await fetch(API+`?${new URLSearchParams(consulta).toString()}`, {
                method: "GET"
            });
            
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                populations = data;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
            if(status==200){
                mensajeUsuario = `Datos correspondientes al filtro.`;
                setTimeout(() => {mensajeUsuario = '';}, 3000);
            }else{
                mensajeUsuario = "No se han podido encontrar los datos";
                setTimeout(() => {mensajeUsuario = '';}, 3000);
            }
        }
        async function getPaginacion(offsetFiltro, limitFiltro){
            resultStatus = result = "";
            const res = await fetch(API+"?offset="+offsetFiltro+"&limit="+limitFiltro, {
                method: "GET"
            });
            console.log(API+"?offset="+offsetFiltro+"&limit="+limitFiltro);
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                populations = data;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        }
        let insertedData = [];
        async function createPopulations(){
            resultStatus = result = "";
            const newPopulations = {
                province: newPopulationsProvince,
                period: parseInt(newPopulationsPeriod),
                gender: newPopulationsGender,
                age: parseFloat(newPopulationsAge),
                asset_thousand: parseFloat(newPopulationsAssetThousand),
                tax: parseFloat(newPopulationsTax)
            };
    
            const existingData = insertedData.find(data => 
                data.province === newPopulationsProvince && data.period === newPopulationsPeriod && data.gender === newPopulationsGender
                    && data.age === newPopulationsAge&& data.asset_thousand === newPopulationsAssetThousand && data.tax === newPopulationsTax
            );
            if (existingData) {
                mensajeUsuario = "Ya existe ese dato";
                return;
            }
    
            const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPopulations)
            });
    
            const status = await res.status;
            resultStatus = status;
            if (status == 201) {
                getPopulations();
                mensajeUsuario = "Se ha creado el nuevo dato introducido";
                insertedData.push(newPopulations);
            } else if (status == 409) {
                mensajeUsuario = "El dato introducido ya existe";
                
            } else if (status == 400) {
                mensajeUsuario = "Las propiedades introducidas no tienen un formato correcto";
                
            } else {
                mensajeUsuario = "No se ha podido crear el dato introducido";
            }     
        }
        async function deletePopulations(populationsProvince){
            resultStatus = result = "";
            const res = await fetch(API+"/"+populationsProvince, {
                method: "DELETE"
            });
            const status = await res.status;
            resultStatus = status;
            if(status==200){
                getPopulations();
                mensajeUsuario = "Se ha borrado correctamente el dato seleccionado";
            }else{
                mensajeUsuario = "No se ha podido borrar el dato";
            }
        }
        async function deletePopulationsAll(){
            resultStatus = result = "";
            const res = await fetch(API, {
                method: "DELETE"
            });
            const status = await res.status;
            resultStatus = status;
            if(status==200 || status == 204){
                await getPopulations();
                mensajeUsuario = "Se han borrado correctamente los datos";
            }else{
                mensajeUsuario = "No se han podido borrar los datos";
            }
        }
        async function getLimpiarFiltros(){
        resultStatus = result = "";
        if(from != "" || to != "" || province != "" || period != "" || age_under != "" || age_over != "" 
            || tax_under != "" || tax_over != "" || asset_under != "" || asset_over != ""|| gender != ""){
            from = "";
            to = "";
            province = "";
            period = "";
            age_under = "";
            age_over = "";
            tax_under = "";
            tax_over = "";
            asset_under = "";
            asset_over = "";
            gender = "";
        }
        getPopulations();
        return;
        } 
</script>

   
<head>
    <title>
        Proyection-populations data
    </title>
</head>
    
    

    <h1 style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 60px;">Datos poblacionales</h1>
    <p></p>
    {#if mensajeUsuario !=""}
    <h2 style="color: red; text-align: center; font-family:Arial, Helvetica, sans-serif">{mensajeUsuario}</h2>
    {/if}

    <div class="camposFiltros">
        <label class="columna">
            Desde el año:
            <input bind:value={from} type="text"/>
        </label>
        <label class="columna">
            Hasta el año:
            <input bind:value={to} type="text"/>
        </label>
        <label class="columna">
            Provincia:
            <input bind:value={province} type="text"/>
        </label>
        <label class="columna">
            Año:
            <input bind:value={period} type="text"/>
        </label>
        <label class="columna">
            Género:
            <input bind:value={gender} type="text"/>
        </label>
    </div>

    <div class="camposFiltros">
        <label class="columna">
            Edad mayor o igual:
            <input bind:value={age_over} type="text"/>
        </label>
        <label class="columna">
            Edad menor o igual:
            <input bind:value={age_under} type="text"/>
        </label>
    </div>
    
    <div class="camposFiltros">
        <label class="columna">
            Impuestos mayores o iguales:
            <input bind:value={asset_over} type="text"/>
        </label>
        <label class="columna">
            Impuestos menores o iguales:
            <input bind:value={asset_under} type="text"/>
        </label>
    </div>
    <div class="camposFiltros">
        <label class="columna">
            Tasas mayores o iguales:
            <input bind:value={tax_over} type="text"/>
        </label>
        <label class="columna">
            Tasas menor o iguales:
            <input bind:value={tax_under} type="text"/>
        </label>
    </div>
    <p></p>
    <div style="text-align: center; word-spacing: 15px;">
        <Button color = "primary" on:click={getPopulationsFiltrado}>Filtrar</Button>

        <Button color="secondary" on:click={getLimpiarFiltros}>Limpiar Filtros</Button>
    </div>

    <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">

    <strong style="margin-left: 10px;">Número de datos: {populations.length}</strong>
    <Table striped>
        <thead>
          <tr>
            <th style="text-decoration: underline;">Provincia:</th>
            <th style="text-decoration: underline;">Año:</th>
            <th style="text-decoration: underline;">Género:</th>
            <th style="text-decoration: underline;">Edad:</th>
            <th style="text-decoration: underline;">Impuestos:</th>
            <th style="text-decoration: underline;">Tasas:</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td><input placeholder="Provincia" bind:value={newPopulationsProvince}></td>
                <td><input placeholder="Año" bind:value={newPopulationsPeriod}></td>
                <td><input placeholder="Género" bind:value={newPopulationsGender}></td>
                <td><input placeholder="Edad" bind:value={newPopulationsAge}></td>
                <td><input placeholder="Impuestos" bind:value={newPopulationsAssetThousand}></td>
                <td><input placeholder="Tasas" bind:value={newPopulationsTax}></td>
                <td><Button color="success" on:click={createPopulations}>Crear</Button></td>
            </tr>
        
        {#each populations as populations }
          <tr class="datosPoblacion">
            <td><a href="/proyection-populations/{populations.province}/{populations.period}/{populations.age}">{populations.province}</a></td>
            <td>{populations.period}</td>
            <td>{populations.gender}</td>
            <td>{populations.age}</td>
            <td>{populations.asset_thousand}</td>
            <td>{populations.tax}</td>
            <td><Button on:click={deletePopulations(populations.province)}>Borrar</Button></td>
          </tr>
        {/each}
        </tbody>
    </Table>
    
    <Pagination style="text-align: center; display: flex; justify-content: center; flex-direction: row; gap: 15px;" ariaLabel="Page navigation example">
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(-1,10)} first/>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(-1,10)}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(9,10)}>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(19,10)}>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(19,10)} last/>
        </PaginationItem>
    </Pagination>
    <div style="text-align: center; word-spacing: 20px;">
        <Button color="danger" on:click={deletePopulationsAll}>Borrar Datos</Button>
        <Button color="success" on:click={loadData}>Cargar Datos</Button>
    </div>

    <style>
        label{
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            font-size: 17px;
            margin-left: 10px;
        }
        .camposFiltros{
            display: flex;
            justify-content: center;
        }
        .columna{
            padding: 15px;
            margin: 5px;
        }
    </style>