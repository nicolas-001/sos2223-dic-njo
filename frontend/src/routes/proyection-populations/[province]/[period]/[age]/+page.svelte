<script>
    // @ts-nocheck
        import { onMount } from "svelte";
        import { dev } from "$app/environment";
        import { Button, Table } from 'sveltestrap';
        import { page } from "$app/stores";
        onMount(async () =>{
            getPopulations_dato();
        });
        let mensajeUsuario = "";
        let province = $page.params.province;
        let period = $page.params.period;
        let age = $page.params.age;
        let API = "/api/v2/proyection-populations/"+province+ "/" +period+ "/"+age;
        if(dev)
            API = "http://localhost:12345"+API
    
        let updatePopulationsProvince = province;
        let updatePopulationsPeriod = period; 
        let updatePopulationsGender = "Género";
        let updatePopulationsAge = age;
        let updatePopulationsAssetThousand = "Impuestos";
        let updatePopulationsTax = "Tasas";
        let result = "";
        let resultStatus = "";
        async function getPopulations_dato(){
            resultStatus = result = "";
            const res = await fetch(API, {
                method: "GET"
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                updatePopulationsProvince = data.province;
                updatePopulationsPeriod = data.period;
                updatePopulationsGender = data.gender;
                updatePopulationsAge = data.age;
                updatePopulationsAssetThousand = data.asset_thousand;
                updatePopulationsTax = data.tax;
                
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            
            const status = await res.status;
            resultStatus = status;
            if(status==404){
                mensajeUsuario = `La ruta solicitada "${province}/${period}/${age}" no existe`;
            }
            
        }
        async function updatePopulations(){
            resultStatus = result = "";
            const res = await fetch(API, {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    province: updatePopulationsProvince,
                    period: updatePopulationsPeriod,
                    gender: updatePopulationsGender,
                    age: updatePopulationsAge,
                    tax: updatePopulationsTax,
                    asset_thousand: updatePopulationsAssetThousand
                })
            });
            const status = await res.status;
            resultStatus = status;
            if(status==200){
                getPopulations_dato();
                mensajeUsuario = "Los datos han sido actualizados con éxito";
            }else if(status==400){ 
                mensajeUsuario = "Los datos introducidos no son válidos";
            }
            
            else{
                mensajeUsuario = "No se ha podido actualizar el dato";
            }       
        }
    </script>

    <h1 style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 60px;">Agroclimáticas Cambios</h1>
      
    {#if mensajeUsuario !=""}
        <h2 style="color: red; text-align: center; font-family:Arial, Helvetica, sans-serif">{mensajeUsuario}</h2>
    {/if}

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
                <td>{updatePopulationsProvince}</td>
                <td>{updatePopulationsPeriod}</td>
                <td><input bind:value={updatePopulationsGender}></td>
                <td>{updatePopulationsAge}</td>
                <td><input bind:value={updatePopulationsAssetThousand}></td>
                <td><input bind:value={updatePopulationsTax}></td>
                <td><Button color="primary" on:click={updatePopulations}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>

    <div style="justify-content: center; display:flex;">
        <Button color="secondary" href= "/proyection-populations">Atrás</Button>
    </div>

    