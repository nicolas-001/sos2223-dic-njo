import Datastore from "nedb";
var db = new Datastore();
//const _ = require("underscore");

const pagina = "https://documenter.getpostman.com/view/26062660/2s93RQSDWT";



              
          const BASE_API_URL = "/api/v2"
              
        
          function loadBackend_njo_v2(app){       

          
var njoAPI = [
    {"province":"Almeria", "gender":"Hombres","age": 21,"period":2021,"asset_thousand": 13.2,"tax":38.30},
    {"province": "Cadiz","gender": "Hombres","age": 55,"period": 2018,"asset_thousand": 51.7,"tax": 30.7},
    {"province": "Cadiz","gender": "Mujeres","age": 55,"period": 2018,"asset_thousand": 31.7,"tax": 16.5},
    {"province": "Cadiz","gender": "Mujeres","age": 16,"period": 2018,"asset_thousand": 248.9,"tax": 47.6},
    {"province": "Cadiz","gender": "Mujeres","age": 24,"period": 2019,"asset_thousand": 16.8,"tax": 29.4},
    {"province": "Cadiz","gender": "Mujeres","age": 34,"period": 2019,"asset_thousand": 60.5,"tax": 83.1},
    {"province": "Cadiz","gender": "Mujeres","age": 44,"period": 2019,"asset_thousand": 72.5,"tax": 74.2},
    {"province": "Cadiz","gender": "Mujeres","age": 54,"period": 2019,"asset_thousand": 66.5,"tax": 66.4},
    {"province": "Granada","gender": "Hombres","age": 16,"period": 2018,"asset_thousand": 235.7,"tax": 62.9},
    {"province": "Granada","gender": "Hombres","age": 24,"period": 2019,"asset_thousand": 15.7,"tax": 35.0},
    {"province": "Granada","gender": "Hombres","age": 34,"period": 2019,"asset_thousand": 49.1,"tax": 87.7},
    {"province": "Granada","gender": "Hombres","age": 44,"period": 2019,"asset_thousand": 65.1,"tax": 91.7},
    {"province": "Cordoba","gender": "Mujeres","age": 55,"period": 2018,"asset_thousand": 31.3,"tax": 20.7},
    {"province":"Sevilla","gender":"Hombres", "age":31,"period": 2020,"asset_thousand": 40.1, "tax":90.6},
    {"province":"Almeria","gender":"Hombres","age": 40, "period":2018, "asset_thousand":57.3,"tax": 92.9},
    {"province":"Malaga","gender":"Hombres", "age":50, "period":2022, "asset_thousand":54.3,"tax": 89.5},
    {"province":"Almeria",	"gender":"Hombres", "age":55, "period":2021, "asset_thousand":31.3, "tax":31.9},
    {"province":"Cordoba",	"gender":"Hombres","age": 16, "period":2021, "asset_thousand":196.2,"tax": 65.6},
    {"province":"Cordoba","gender":"Mujeres","age": 16, "period":2021, "asset_thousand":150.7,"tax":51.8},
    {"province":"Malaga","gender":"Mujeres", "age":20, "period":2021,"asset_thousand": 11.2, "tax":34.1},
    {"province":"Almeria",	"gender":"Hombres", "age":55, "period":2017, "asset_thousand":31.3, "tax":31.9},
    {"province":"Cordoba",	"gender":"Hombres","age": 16, "period":2017, "asset_thousand":196.2,"tax": 65.6},
    {"province":"Cordoba","gender":"Mujeres","age": 16, "period":2017, "asset_thousand":150.7,"tax":51.8},
    {"province":"Malaga","gender":"Mujeres", "age":20, "period":2017,"asset_thousand": 11.2, "tax":34.1}
    
]    

db.insert(njoAPI);
    console.log("Insertados los datos en ProyectionPopulations");

 
//ruta api
app.get(BASE_API_URL+"/proyection-populations/loadInitialData", (request, response) => {
  console.log("New GET to /proyection-populations");
  db.find({}, (err, proyectionPopulations)=>{
  if(proyectionPopulations.length>0){
      response.json("Los datos proyection-populations estan cargados.");
      console.log("Los datos proyection-populations estan cargados.")
  }else if(err){
          console.log(`Error geting /proyection-populations/loadInitialData: ${err}`);
          response.sendStatus(500);
  }else{
      db.insert(njoAPI)
      console.log(`proyection-populations returned ${proyectionPopulations.length}`);
      response.sendStatus(200);
  }
  });
  });
  app.get(BASE_API_URL+"/proyection-populations", (request, response) => {
    db.find({}, {_id: 0}, (err, filteredList) => {
        // Comprobamos los errores que han podido surgir
        if(err){
            console.log(`Error getting populations`);
            // El estado es el 500 de Internal Server Error
            response.sendStatus(500);
        // Comprobamos si existen datos:
        }else{
            // Tenemos que inicializar los valores necesarios para filtrar: tenemos que ver el limit y offset
            let i = -1;
            if(!request.query.offset){ 
              var offset = -1;
            }else{ 
              var offset = parseInt(request.query.offset);
            }
            // Tenemos que filtrar los datos, para ver cada posible campo y devolver true si no se pasa en la query, 
            // y si es un parámetro en la query se comprueba la condicion
            let datitos = filteredList.filter((x) => {
                return (((request.query.period == undefined)||(parseInt(request.query.period) === x.period))&&
                ((request.query.gender == undefined)||(request.query.gender) === x.gender)&&
                ((request.query.from == undefined)||(parseInt(request.query.from) <= x.period))&&
                ((request.query.to == undefined)||(parseInt(request.query.to) >= x.period))&&
                ((request.query.province == undefined)||(request.query.province === x.province))&&
                ((request.query.asset_over == undefined)||(parseFloat(request.query.asset_over) <= x.asset_thousand))&&
                ((request.query.asset_under == undefined)||(parseFloat(request.query.asset_under) >= x.asset_thousand))&&
                ((request.query.tax_over == undefined)||(parseFloat(request.query.tax_over) <= x.tax))&&
                ((request.query.tax_under == undefined)||(parseFloat(request.query.tax_under) >= x.tax))&&
                ((request.query.age_over == undefined)||(parseFloat(request.query.age_over) <= x.age))&&
                ((request.query.age_under == undefined)||(parseFloat(request.query.age_under) >= x.age)));
            }).filter((x) => {
                // La paginación
                i = i+1;
                if(request.query.limit==undefined){ 
                  var cond = true;
                }else{ 
                  var cond = (parseInt(offset) + parseInt(request.query.limit)) >= i;
                }
                return (i>offset)&&cond;
            });

            // Comprobamos si tras el filtrado sigue habiendo datos, si no hay:
        if(datitos.length == 0){
            console.log(`populations not found`);
              // Estado 404: Not Found
              response.status(404).json(datitos);

          // Si por el contrario encontramos datos
        }else{
            console.log(`Datos de populations devueltos: ${datitos.length}`);
            // Devolvemos dichos datos, estado 200: OK
            response.json(datitos);

        }  
    }
})
    
    console.log("GET con los datos");
});
function pagination(request, lista){
  var res = [];
  const limit = request.query.limit;
  const offset = request.query.offset;
  
  if(limit < 1 || offset < 0 || offset > lista.length){
      res.push("Hay un error en los parametros offset y limit");
      return res;
  }else{
  res = lista.slice(offset,parseInt(limit)+parseInt(offset));
  return res;
  }     
};
  
app.get(BASE_API_URL+"/proyection-populations/:province", (request, response) => {
  const province = request.params.province;
  const from = request.query.from;
  const to = request.query.to;
  db.find({}, (err, proyectionPopulations)=>{
      if (from && to && !err) {
          if (from > to) {
              response.status(400).json("El rango de meses especificado es inválido");
          } else {
              const datosFiltrados = proyectionPopulations.filter(x => x.province === province && x.period >= from && x.period <= to);
              response.status(200).json(datosFiltrados.map((c) =>{
                  delete c._id;
                  return c;
              }));
              console.log(`/GET en /proyection-populations/${province}?from=${from}&to=${to}`);
          }
      }else if(!err){
          const datosFiltrados = proyectionPopulations.filter(x => x.province == province);
          
          if(datosFiltrados.length == 0){
              response.status(404).json('La ruta solicitada no existe');
          }else{
          response.status(200).json(datosFiltrados.map((c)=>{
              delete c._id;
              return c;
          }));
          console.log(`New GET /proyection-populations/${province}`); 
          }
          console.log(`Nuevo GET en /proyection-populations/${province}`); 
      }else{
          response.sendStatus(500);
          console.log("No se ha podido hacer la busqueda");
      }
  });    
});

app.get(BASE_API_URL+"/proyection-populations/:province/:period/:age", (request,response) => {
  const province = request.params.province;
  const period = request.params.period;
  const age = request.params.age;
  db.find({}, (err, list)=>{
      if(!err){
          var filtro = list.filter(x => x.province == province && x.period == period && x.age == age);
          if (filtro.length == 0) {            
              response.status(404).json('La ruta solicitada no existe');
          }else if(filtro.length == 1){
              filtro.forEach(element => {
                  delete element._id;
              });
              response.status(200).send(JSON.stringify(filtro[0], null, 2));
          }else {
              response.status(200).json(filtro.map((c)=>{
                  delete c._id;
                  return c;
              }));
          }
      }else{
          console.log("No se ha podido obtener los datos");
          response.sendStatus(500);
      }   
  });
  console.log("Datos de /proyection-populations/:province/:period/:age");
});
app.get(BASE_API_URL+"/proyection-populations/:province/:period/", (request,response) => {
    const province = request.params.province;
    const period = request.params.period;
    const age = request.params.age;
    db.find({}, (err, list)=>{
        if(!err){
            var filtro = list.filter(x => x.province == province && x.period == period);
            if (filtro.length == 0) {            
                response.status(404).json('La ruta solicitada no existe');
            }else if(filtro.length == 1){
                filtro.forEach(element => {
                    delete element._id;
                });
                response.status(200).send(JSON.stringify(filtro[0], null, 2));
            }else {
                response.status(200).json(filtro.map((c)=>{
                    delete c._id;
                    return c;
                }));
            }
        }else{
            console.log("No se ha podido obtener los datos");
            response.sendStatus(500);
        }   
    });
    console.log("Datos de /proyection-populations/:province/:period/");
  });

app.post(BASE_API_URL + "/proyection-populations", (request, response) => {
  const province = request.body.province;
  const period = request.body.period;
  const tax = request.body.tax;
  const asset_thousand = request.body.asset_thousand;
  const age = request.body.age;
  const gender = request.body.gender;
  db.find({},function(err,filteredList){

      if(err){
          response.sendStatus(500);
      }
      const requiredFields = ['province', 'period', 'tax', 'asset_thousand', 'age', 'gender'];
      for (const field of requiredFields) {
          if (!request.body.hasOwnProperty(field)) {
          return response.status(400).json(`Falta alguno de los campos: ${field}`);
          }
      }
      
          filteredList = filteredList.filter((obj)=>
                          {
                              return(province == obj.province && period == obj.period && tax == obj.tax &&
                                  asset_thousand == obj.asset_thousand && age == obj.age && gender == obj.gender)
                          });
          
          if (filteredList.length !=0) {
              response.status(409).json(`El recurso ya existe.`);
          } else {
              db.insert(request.body);
              response.sendStatus(201);
              console.log("Se ha insertado un nuevo dato");
          }
      
  });
  console.log("Nuevo POST en /proyection-populations"); 
});
  app.post(BASE_API_URL+"/proyection-populations/:province", (request, response) =>{
    console.log("No se puede hacer este POST /proyection-populations/:province");
    response.sendStatus(405);
  });
  app.put(BASE_API_URL + "/proyection-populations/:province", (request, response) => {
    const province = request.params.province;
    const body = request.body;
    if (province === body.province) {
        const requiredFields = ['province', 'period', 'tax', 'asset_thousand', 'gender','age'];
            for (const field of requiredFields) {
                if (!request.body.hasOwnProperty(field)) {
                return response.status(400).json(`Falta alguno de los campos: ${field}`);
                }
            }
    
        db.update({ province: province }, 
            { $set: 
                { period: body.period, 
                tax: body.tax, 
                asset_thousand: body.asset_thousand, 
                gender: body.gender,
              age: body.age} }, {}, (err, numAffected) => {
            if (err) {
                console.log("Error actualizando el objeto: ", err);
                response.status(500).send("Error actualizando el objeto");
            } else if (numAffected === 0) {
                console.log("No se ha encontrado el objeto con la provincia especificada");
                response.status(400).send("No se ha encontrado el objeto con la provincia especificada");
            } else {
                console.log("Nuevo objeto actualizado en la base de datos");
                response.status(200).send("Actualizado");
            }
        });
    }else {
        console.log("La provincia en la URL no coincide con la provincia en la solicitud");
        response.status(400).send("La provincia en la URL no coincide con la provincia en la solicitud");
    }
});
app.put(BASE_API_URL + "/proyection-populations/:province/:period", (request, response) => {
  const provinceId = request.params.province;
  const periodId = parseInt(request.params.period);
  const body = request.body;

  // Verifica si los valores de año coinciden
  if (provinceId === body.province && periodId === body.period) {
      // Actualiza el registro en la base de datos
      db.update(
          { province: provinceId, period: periodId },
          { $set: {
            tax: body.tax, 
            asset_thousand: body.asset_thousand, 
            gender: body.gender,
          age: body.age
          }},
          {},
          function (err, numReplaced) {
              if (numReplaced === 1) {
                  console.log("Nuevo PUT a /proyection-populations/:province/:period");
                  response.status(200).send("Actualizado");
              } else {
                  console.log("No se ha encontrado el objeto con la provincia y mes especificados");
                  response.status(400).send("No se ha encontrado el objeto con la provincia y mes especificados");
              }
          }
      );
  } else {
      console.log("El año o provincia en la URL no coincide con el mes en la solicitud");
      response.status(400).send("El año o provincia en la URL no coincide con el mes en la solicitud");
  }
});
app.put(BASE_API_URL + "/proyection-populations/:province/:period/:age", (request, response) => {
    const provinceId = request.params.province;
    const periodId = parseInt(request.params.period);
    const ageId = parseInt(request.params.age);
    const body = request.body;
  
    // Verifica si los valores de año coinciden
    if (provinceId === body.province && periodId === body.period && ageId === body.age) {
        // Actualiza el registro en la base de datos
        db.update(
            { province: provinceId, period: periodId, age: ageId},
            { $set: {
              tax: body.tax, 
              asset_thousand: body.asset_thousand, 
              gender: body.gender
            
            }},
            {},
            function (err, numReplaced) {
                if (numReplaced === 1) {
                    console.log("Nuevo PUT a /proyection-populations/:province/:period/:age");
                    response.status(200).send("Actualizado");
                } else {
                    console.log("No se ha encontrado el objeto con la provincia, mes,edad especificados");
                    response.status(400).send("No se ha encontrado el objeto con la provincia ,mes y edad especificados");
                }
            }
        );
    } else {
        console.log("El año , provincia o edad en la URL no coincide con el mes en la solicitud");
        response.status(400).send("El año ,provincia o edad en la URL no coincide con el mes en la solicitud");
    }
  });
app.put(BASE_API_URL+"/proyection-populations", (request,response) =>{
  console.log("No se puede hacer este PUT /proyection-populations");
  response.sendStatus(405);
});

app.delete(BASE_API_URL+"/proyection-populations/:province", (request, response) => {
  const province = request.params.province;
  db.remove({province : province}, {}, (err, numRemoved)=>{
      if(err){
          console.log("Error para borrar todos los datos");
          response.status(500).send("Error");

      }else if(numRemoved === 0){
          console.log("No se encuentran datos");
          response.status(400).send("No se encuentran datos");
      }else{
          console.log("Borrado el dato");
          response.status(200).send("Se ha borrado el dato");
      }
  
  });
  console.log("Se ha borrado la provincia en /proyection-populations/:province");
});

// DELETE de provincia y año
app.delete(BASE_API_URL+"/proyection-populations/:province/:period", (request, response) => {
  const province = request.params.province;
  const period = request.params.period;
  db.remove({province : province , period : parseInt(period)}, {}, (err, numRemoved)=>{
      if(err){
          console.log("Error para borrar todos los datos");
          response.status(500).send("Error");

      }else if(numRemoved == 0){
          console.log("No se encuentran datos");
          response.status(400).send("No se encuentran datos");
      }else{
          console.log("Borrado el dato");
          response.status(200).send("Se ha borrado el dato");
      }
  });
  console.log("Se ha borrado la provincia en /proyection-populations/:province");
});
app.delete(BASE_API_URL+"/proyection-populations/", (req, res) => {
  db.remove({}, { multi: true }, (err, numRemoved) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(`Se eliminaron ${numRemoved} documentos de la colección.`);
    }
  });
});
//PROXY
app.get(BASE_API_URL+"/market", async (req, res) => {
    try {
      const url = 'https://sos2223-21.ew.r.appspot.com/api/v3/market-prices-stats';
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
      console.log("Proxy OK");
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get("/proyection-populations/docs",(req,res)=>
  {
      res.redirect("https://documenter.getpostman.com/view/26062660/2s93RQSDWT");
  });

          }
          export {loadBackend_njo_v2 };