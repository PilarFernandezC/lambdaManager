// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Lambda Manager',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {path: '/about/', url: 'about.html'},
      {path: '/registro1/', url: 'registro1.html'},
      {path: '/index/', url: 'index.html'},
      {path: '/registro/', url: 'registro.html'},
      {path: '/coordinador/', url: 'coordinador.html'},
      {path: '/alumno/', url: 'alumno.html'},
      {path: '/alumno/altaObjetivo/', url: 'altaObjetivo.html'},
      {path: '/entrenador/', url: 'entrenador.html'},
      {path: '/entrenador/altaInforme/', url: 'altaInforme.html'},
      {path: '/coordinador/altaAlumno/', url: 'altaAlumno.html'},
      {path: '/coordinador/altaEntrenador/', url: 'altaEntrenador.html'},
      {path: '/coordinador/altaClase/', url: 'altaClase.html'},
      {path: '/coordinador/altaCuota/', url: 'altaCuota.html'},
      {path: '/coordinador/editarAlumno/', url: 'editarAlumno.html'},
      {path: '/coordinador/clasesAlumnos/', url: 'clasesAlumnos.html'},
      {path: '/coordinador/editarEntrenador/', url: 'editarEntrenador.html'},
      {path: '/coordinador/editarClase/', url: 'editarClase.html'},
      {path: '/coordinador/editarCuota/', url: 'editarCuota.html'},
      {path: '/coordinador/caja/', url: 'caja.html'},
      {path: '/coordinador/altaMovimiento/', url: 'altaMovimiento.html'},
      {path: '/coordinador/verAlumno/', url: 'verAlumno.html'}
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var email, contrasena, nombre, apellido, telefono, fechaNacimiento, tipoUsuario, dias, clases, iD, autor, nombreSaludo, detalle, valor, 
codigo, cont, fechaDesde, fechaHasta;
var coleccionUsuarios = db.collection("Usuarios");
var coleccionClases = db.collection("Clases");
var coleccionAlumnos = db.collection("Alumnos");
var coleccionEntrenadores = db.collection("Entrenadores");
var coleccionInformes = db.collection("Informes");
var coleccionObjetivos = db.collection("Objetivos");
var coleccionCuotas = db.collection("Cuotas");
var coleccionMovimientos = db.collection("Movimientos");
var coleccionPagos = db.collection("Pagos");

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$("#btnLogin").on("click", funcionLogin);
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$("#btnFinalizarRegistro").on("click", funcionFinRegistro);
})

$$(document).on('page:init', '.page[data-name="registro1"]', function (e) {
  $$("#btnRegistro").on("click", funcionRegistro);
})

$$(document).on('page:init', '.page[data-name="coordinador"]', function (e) {
  funcionSaludoCoordinador();
  mostrarAlumnos();
  mostrarEntrenadores();
  mostrarClases();
  mostrarInformes();
  mostrarCuotas();
  mostrarCaja();
  $$("#btnAltaAlumno").on("click", function() {
    mainView.router.navigate("/coordinador/altaAlumno/");
  });
  $$("#btnAltaEntrenador").on("click", function() {
    mainView.router.navigate("/coordinador/altaEntrenador/");
  });
  $$("#btnAltaClase").on("click", function() {
    mainView.router.navigate("/coordinador/altaClase/");
  });
  $$("#btnAltaCuota").on("click", function() {
    mainView.router.navigate("/coordinador/altaCuota/");
    cargarClasesCuotas();
  });
  $$("#btnCaja").on("click", function() {
    mainView.router.navigate("/coordinador/caja/");
  });
})

$$(document).on('page:init', '.page[data-name="altaAlumno"]', function (e) {
  $$("#btnFinalizarAltaAlumno").on("click", funcionCrearAlumno);
})

$$(document).on('page:init', '.page[data-name="altaEntrenador"]', function (e) {
  $$("#btnFinalizarAltaEntrenador").on("click", funcionCrearEntrenador);
})

$$(document).on('page:init', '.page[data-name="altaClase"]', function (e) {
  $$("#btnFinalizarAltaClase").on("click", funcionCrearClase);
})

$$(document).on('page:init', '.page[data-name="altaCuota"]', function (e) {
  $$("#btnFinalizarAltaCuota").on("click", funcionCrearCuota);
})

$$(document).on('page:init', '.page[data-name="editarAlumno"]', function (e) {
  $$("#btnFinalizarEditarAlumno").on("click", funcionFinEditarAlumno);
})

$$(document).on('page:init', '.page[data-name="clasesAlumnos"]', function (e) {
  $$("#btnAgregarClaseAlumno").on("click", agregarNuevoSelect);
  $$("#btnFinalizarAgregarClaseAlumno").on("click", funcionFinAgregarClaseAlumno);
})

$$(document).on('page:init', '.page[data-name="editarEntrenador"]', function (e) {
  $$("#btnFinalizarEditarEntrenador").on("click", funcionFinEditarEntrenador);
})

$$(document).on('page:init', '.page[data-name="editarClase"]', function (e) {
  $$("#btnFinalizarEditarClase").on("click", funcionFinEditarClase);
})

$$(document).on('page:init', '.page[data-name="editarCuota"]', function (e) {
  $$("#btnFinalizarEditarCuota").on("click", funcionFinEditarCuota);
})

$$(document).on('page:init', '.page[data-name="caja"]', function (e) {
  mostrarMovimientos();
  $$("#btnAltaMovimiento").on("click", function() {
    mainView.router.navigate("/coordinador/altaMovimiento/");
  });
  $$("#btnFiltrarIngresos").on("click", function() {
    $$("#btnFiltrarEgresos").removeClass('apretado');
    $$(this).toggleClass('apretado');
    funcionActualizarFiltros();
  });
  $$("#btnFiltrarEgresos").on("click", function() {
    $$("#btnFiltrarIngresos").removeClass('apretado');
    $$(this).toggleClass('apretado');
    funcionActualizarFiltros();
  });
  $$("#btnFiltros").on("click", funcionFiltros);
})

$$(document).on('page:init', '.page[data-name="altaMovimiento"]', function (e) {
  funcionEsconderInputs();
  $$("#tipoMovimiento").on("change", function() {
    funcionEsconderInputs();
    var movimiento = $$(this).val();
    funcionTipoMovimiento(movimiento);
  });
  $$("#alumnoMovimiento").on("change", function() {
    var alumno = $$(this).val();
    cargarCuotasMovimiento(alumno);
    crearAlumnoPago(alumno);
    $$("#inputCuotaMovimiento").show();
  });
  $$("#cuotaMovimiento").on("change", function() {
    var cuota = $$(this).val();
    funcionCuotaMovimiento(cuota);
  });

  $$("#btnFinalizarAltaMovimiento").on("click", funcionFinAltaMovimiento);
})

$$(document).on('page:init', '.page[data-name="alumno"]', function (e) {
  funcionSaludoAlumno();
  mostrarClasesAlumno();
  mostrarEntrenadoresAlumno();
  mostrarObjetivosAlumno();
  mostrarPagosAlumno();
  $$("#btnAltaObjetivo").on("click", function() {
    mainView.router.navigate("/alumno/altaObjetivo/");
  });
})

$$(document).on('page:init', '.page[data-name="altaObjetivo"]', function (e) {
  funcionAutorObjetivo();
  $$("#btnFinalizarAltaObjetivo").on("click", funcionCrearObjetivo);
})

$$(document).on('page:init', '.page[data-name="entrenador"]', function (e) {
  funcionSaludoEntrenador();
  mostrarAlumnosEntrenador();
  mostrarInformesEntrenador();
  mostrarObjetivosEntrenador();
  mostrarClasesEntrenador();
  $$("#btnAltaInforme").on("click", function() {
    mainView.router.navigate("/entrenador/altaInforme/");
  });
})

$$(document).on('page:init', '.page[data-name="altaInforme"]', function (e) {
  funcionAutorInforme();
  $$("#btnFinalizarAltaInforme").on("click", funcionCrearInforme);
})

$$(document).on('page:init', '.page[data-name="verAlumno"]', function (e) {
  
})

$$(document).on('page:init', '.page[data-name="about"]', function (e) {
  
})

// FUNCIONES
function funcionRegistro () {
  email = $$("#emailIndex").val();
  contrasena = $$("#contrasenaIndex").val();
  if (email != "" && contrasena != "") {
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
      var user = userCredential.user;
      mainView.router.navigate('/registro/');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      switch (errorCode) {
        case "auth/email-already-in-use": app.dialog.alert("El email ya se encuentra registrado");
        break;
        case "auth/invalid-email": app.dialog.alert("El email no es válido");
        break;
        case "auth/weak-password": app.dialog.alert("La contraseña debe tener al menos 6 caracteres");
        break;
        default:
      }
    });
  }
}

function funcionFinRegistro () {
  var idUsuario = email;
  nombre = $$("#nombreRegistro").val();
  apellido = $$("#apellidoRegistro").val();
  telefono = $$("#telefonoRegistro").val();
  fechaNacimiento = $$("#fechaNacimientoRegistro").val();
  tipoUsuario = $$("#tipoUsuarioRegistro").val();
  datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario};
  coleccionUsuarios.doc(idUsuario).set(datos)
  .then(function (documento) {
    app.dialog.alert("Usuario registrado");
    mainView.router.navigate("/index/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}

function funcionLogin () {
  email = $$("#emailLogin").val();
  contrasena = $$("#contrasenaLogin").val();
  if (email != "" && contrasena != "") {
    firebase.auth().signInWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
    var user = userCredential.user;
    coleccionUsuarios.doc(email).get()
    .then( function(documento) {
      rol = documento.data().rol;
      switch (rol) {
        case "Coordinador": mainView.router.navigate("/coordinador/");
        break;
        case "Alumno": mainView.router.navigate("/alumno/");
        break;
        case "Entrenador": mainView.router.navigate("/entrenador/");
        break;
        default: 
      }
    })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      switch (errorCode) {
        case "auth/internal-error": app.dialog.alert("Usuario o contraseña incorrectos");
        break;
        default:
      }
    });
  }
}

function funcionSaludoCoordinador () {
  var query = coleccionUsuarios.where("rol", "==", "Coordinador");
  query.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        nombreSaludo = documento.data().nombre;
      }
    });
    $$("#saludoCoordinador").html("Hola " + nombreSaludo + "!");
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function mostrarAlumnos () {
  var query = coleccionUsuarios.where("rol", "==", "Alumno");
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Nombre</th>
                  <th class="label-cell">Apellido</th>
                  <th class="label-cell">Acciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  query.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#alumnosCoordinador").html(`<p>No hay alumnos registrados</p>`);
    } else {
    querySnapshot.forEach(function(documento) {
      nombre = documento.data().nombre;
      apellido = documento.data().apellido;
      alumno = nombre + " " + apellido;
      cuerpo += `<tr>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell">${apellido}</td>
      <td class="label-cell divBotones"><button onclick="verAlumno('${alumno}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">eye</i></button><button onclick="editarAlumno('${documento.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">pencil</i></button>
      </button><button onclick="asignarClasesAlumnos('${documento.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">plus</i></button>
      <button onclick="borrarAlumno('${documento.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">trash</i></button></td>
      </tr>`
    });
    $$("#alumnosCoordinador").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function verAlumno (alumno) {
  mainView.router.navigate("/coordinador/verAlumno/");
  var subcoleccionPagos = coleccionPagos.doc(alumno).collection('pagos');
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Observaciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  subcoleccionPagos.get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (documento) {
      fecha = documento.data().fecha;
      monto = documento.data().monto;
      cuota = documento.data().cuota;
      observaciones = documento.data().observaciones;
      cuerpo += `<tr>
      <td class="label-cell">${alumno}</td>
      <td class="label-cell">${fecha}</td>
      <td class="label-cell">${cuota}</td>
      <td class="label-cell">${monto}</td>
      <td class="label-cell">${observaciones}</td>
      </tr>`
    })
    $$("#nombreAlumno").html("Pagos de " + alumno);
    $$("#pagosAlumno").html(inicio + cuerpo + fin);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function editarAlumno(id) {
  mainView.router.navigate("/coordinador/editarAlumno/");
  email = id;
  coleccionUsuarios.doc(id).get()
  .then(function(alumno) {
    $$("#nombreEditarAlumno").val(alumno.data().nombre);
    $$("#apellidoEditarAlumno").val(alumno.data().apellido);
    $$("#telefonoEditarAlumno").val(alumno.data().telefono);
    $$("#fechaNacimientoEditarAlumno").val(alumno.data().nacimiento);
  })
  .catch(function(error) {
    console.log("Error ", error);
  });
}

function agregarNuevoSelect() {
  var i = 1;
  if (cont <= 5) {
    var lista = "";
    coleccionClases.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(documento) {
          var nombreClase = documento.data().nombre;
          lista += `<option value='${nombreClase}'>${nombreClase}</option>`;
      });
      while ((($$("#selectClase"+i).val()) != undefined) && i<7) {
        i++
      }
      var nuevoSelect = `<div class="selectBoton" id="clase${i}"><ul><li class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-title item-label">Clases</div>
                    <div class="item-input-wrap input-dropdown-wrap">
                      <select placeholder="Seleccionar" id="selectClase${i}">
                          <option value="" disabled selected>Seleccionar...</option>
                          ${lista}
                      </select>
                    </div>
                  </div>
              </li></ul>
              <button onclick="eliminarSelect('clase${i}')" class="button button-raised button-fill color-white botones">
                      <i class="icon f7-icons">trash</i>
              </button></div>`;
      $$("#listaClases").append(nuevoSelect);
      cont++;
    })
    .catch(function(error) {
      console.log("Error: " , error);
    });
  } else {
    app.dialog.alert("Llegaste al límite de clases asignadas");
  }
}

function verificarClasesAsignadas(id) {
  coleccionAlumnos.doc(id).get()
  .then(function(documento) {
      if (documento.exists && documento.data().clase && documento.data().clase.length > 0) {
        cont = documento.data().clase.length;
        clasesAsignadas = documento.data().clase;
        for (var i=0; i<cont; i++) {
          generarSelect(clasesAsignadas[i], i+1);
        }
      } else {
        cont = 0;
      }
  })
  .catch(function(error) {
      console.log("Error: ", error);
  });
}

function generarSelect(clase, i) {
  var nuevoSelect = `<div class="selectBoton" id="clase${i}"><ul><li class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-title item-label">Clases</div>
                    <div class="item-input-wrap input-dropdown-wrap">
                      <select placeholder="Seleccionar" id="selectClase${i}">
                      <option value='${clase}'>${clase}</option>;
                      </select>
                    </div>
                  </div>
              </li></ul>
              <button onclick="eliminarSelect('clase${i}')" class="button button-raised button-fill color-white botones">
                      <i class="icon f7-icons">trash</i>
              </button></div>`;
  $$("#listaClases").append(nuevoSelect);
}

function eliminarSelect(id) {
  if (cont > 0) {
    $$("#"+(id)).remove();
    cont--;
  }
}

function asignarClasesAlumnos (id) {
  mainView.router.navigate("/coordinador/clasesAlumnos/");
  email = id;
  coleccionUsuarios.doc(id).get()
  .then(function(documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
    $$("#nombreAlumnoClases").html("Asignar clases a " + nombre + " " + apellido);
  })
  .catch(function(error) {
    console.log("Error ", error);
  });
  verificarClasesAsignadas(id);
}

function funcionFinAgregarClaseAlumno () {
  clases = [];
  for (var i=1; i<=6; i++) {
    if (($$("#selectClase"+i).val()) != undefined) {
      var clase = $$("#selectClase"+i).val();
      clases.push(clase);
    }
  }
  coleccionAlumnos.doc(email).set({clase: clases})
  .then(function() {
    app.dialog.alert("Clase asignada correctamente");
    mainView.router.navigate("/coordinador/");
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function funcionFinEditarAlumno () {
  nombre = $$("#nombreEditarAlumno").val();
  apellido = $$("#apellidoEditarAlumno").val();
  telefono = $$("#telefonoEditarAlumno").val();
  fechaNacimiento = $$("#fechaNacimientoEditarAlumno").val();
  coleccionUsuarios.doc(email).update({nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento})
  .then(function (documento) {
    app.dialog.alert("Usuario editado");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}

function borrarAlumno(id) {
  app.dialog.confirm("¿Desea eliminar el alumno?", function () {
    confirmarBorrarAlumno(id);
  });
}

function confirmarBorrarAlumno (id) {
  coleccionAlumnos.doc(id).delete()
  .then(function() {
    console.log("borro el alumno");
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionUsuarios.doc(id).delete()
  .then(function() {
    app.dialog.alert("Alumno eliminado");
    mostrarAlumnos();
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function mostrarEntrenadores () {
  var query = coleccionUsuarios.where("rol", "==", "Entrenador");
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Nombre</th>
                  <th class="label-cell">Apellido</th>
                  <th class="label-cell">Acciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  query.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#entrenadoresCoordinador").html(`<p>No hay entrenadores registrados</p>`);
    } else {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      apellido = doc.data().apellido;
      cuerpo += `<tr>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell">${apellido}</td>
      <td class="label-cell divBotones"><button onclick="editarEntrenador('${doc.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">pencil</i></button>
      <button onclick="borrarEntrenador('${doc.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">trash</i></button></td>
      </tr>`
    });
    $$("#entrenadoresCoordinador").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function editarEntrenador (id) {
  mainView.router.navigate("/coordinador/editarEntrenador/");
  var lista = "";
  email = id;
  coleccionUsuarios.doc(id).get()
  .then(function(entrenador) {
    $$("#nombreEditarEntrenador").val(entrenador.data().nombre);
    $$("#apellidoEditarEntrenador").val(entrenador.data().apellido);
    $$("#telefonoEditarEntrenador").val(entrenador.data().telefono);
    $$("#fechaNacimientoEditarEntrenador").val(entrenador.data().nacimiento);
  })
  .catch(function(error) {
    console.log("Error ", error);
  });
  coleccionClases.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      var nombreClase = documento.data().nombre;
      lista += `<option value='${nombreClase}'>${nombreClase}</option>`;
    })
    $$("#agregarClaseEntrenador").append(lista);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionFinEditarEntrenador () {
  nombre = $$("#nombreEditarEntrenador").val();
  apellido = $$("#apellidoEditarEntrenador").val();
  telefono = $$("#telefonoEditarEntrenador").val();
  fechaNacimiento = $$("#fechaNacimientoEditarEntrenador").val();
  clase = $$("#agregarClaseEntrenador").val();

  coleccionEntrenadores.doc(email).set({clase: clase})
  .then(function() {
    console.log("Documento creado");
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionUsuarios.doc(email).update({nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento})
  .then(function (documento) {
    app.dialog.alert("Usuario editado");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}

function borrarEntrenador(id) {
  app.dialog.confirm("¿Desea eliminar el entrenador?", function () {
    confirmarBorrarEntrenador(id);
  });
}

function confirmarBorrarEntrenador (id) {
  coleccionEntrenadores.doc(id).delete()
  .then(function() {
    console.log("borro el entrenador");
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionUsuarios.doc(id).delete()
  .then(function() {
    app.dialog.alert("Entrenador eliminado");
    mostrarEntrenadores();
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function mostrarClases () {
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Código</th>
                  <th class="label-cell">Nombre</th>
                  <th class="label-cell">Acciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionClases.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#clasesCoordinador").html(`<p>No hay clases creadas</p>`);
    } else {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      codigo = doc.id;
      cuerpo += `<tr>
      <td class="label-cell">${codigo}</td>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell divBotones"><button onclick="editarClase('${doc.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">pencil</i></button>
      <button onclick="borrarClase('${doc.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">trash</i></button></td>
      </tr>`
    });
    $$("#clasesCoordinador").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function editarClase (id) {
  mainView.router.navigate("/coordinador/editarClase/");
  coleccionClases.doc(id).get()
  .then(function(clase) {
    $$("#nombreEditarClase").val(clase.data().nombre);

    var diasSeleccionados = clase.data().dias;

    $$("input[type='checkbox']").each(function () {
      var checkbox = $$(this);
      var dia = checkbox.val();
      if (diasSeleccionados.includes(dia)) {
        checkbox.prop("checked", true);
      } else {
        checkbox.prop("checked", false);
      }
    });
  })
  .catch(function(error) {
    console.log("Error ", error);
  });
}

function funcionFinEditarClase () {
  var diasSeleccionados = [];
  nombre = $$("#nombreEditarClase").val();

  $$("input[type='checkbox']:checked").each(function() {
    var dia = $$(this).val();
    diasSeleccionados.push(dia);
  });

  coleccionClases.doc(codigo).update({nombre: nombre, dias: diasSeleccionados})
  .then(function (documento) {
    app.dialog.alert("Clase editada");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}

function borrarClase(id) {
  app.dialog.confirm("¿Desea eliminar la clase?", function () {
    confirmarBorrarClase(id);
  });
}

function confirmarBorrarClase (id) {
  coleccionClases.doc(id).delete()
  .then(function() {
    app.dialog.alert("Clase eliminada");
    mostrarClases();
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function mostrarInformes () {
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Autor</th>
                  <th class="label-cell">Detalle</th>
                  <th class="label-cell">Prioridad</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionInformes.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#informesCoordinador").html(`<p>No hay informes creados</p>`);
    } else {
      querySnapshot.forEach(function(documento) {
        autor = documento.data().autor;
        detalle = documento.data().detalle;
        prioridad = documento.data().prioridad;
        cuerpo += `<tr>
        <td class="label-cell">${autor}</td>
        <td class="label-cell">${detalle}</td>
        <td class="label-cell">${prioridad}</td>
        </tr>`;
      })
      $$("#informesCoordinador").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function mostrarCuotas () {
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Clase</th>
                  <th class="label-cell">Valor</th>
                  <th class="label-cell">Acciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionCuotas.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#cuotasCoordinador").html(`<p>No hay cuotas creadas</p>`);
    } else {
    querySnapshot.forEach(function(documento) {
      clase = documento.id;
      valor = documento.data().valor;
      cuerpo += `<tr>
      <td class="label-cell">${clase}</td>
      <td class="label-cell">${valor}</td>
      <td class="label-cell divBotones"><button onclick="editarCuota('${documento.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">pencil</i></button>
      <button onclick="borrarCuota('${documento.id}')" class="button button-raised button-fill color-teal botones"><i class="icon f7-icons">trash</i></button></td>
      </tr>`
    });
    $$("#cuotasCoordinador").html(inicio + cuerpo + fin);
  }
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function editarCuota (id) {
  mainView.router.navigate("/coordinador/editarCuota/");
  coleccionCuotas.doc(id).get()
  .then(function(cuota) {
    $$("#detalleEditarCuota").val(cuota.data().detalle);
    $$("#valorEditarCuota").val(cuota.data().valor);
  })
  .catch(function(error) {
    console.log("Error ", error);
  });
}

function funcionFinEditarCuota () {
  detalle = $$("#detalleEditarCuota").val();
  valor = $$("#valorEditarCuota").val();

  coleccionCuotas.doc(codigo).update({detalle: detalle, valor: valor})
  .then(function (documento) {
    app.dialog.alert("Cuota editada");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}

function borrarCuota(id) {
  app.dialog.confirm("¿Desea eliminar la cuota?", function () {
    confirmarBorrarCuota(id);
  });
}

function confirmarBorrarCuota (id) {
  coleccionCuotas.doc(id).delete()
  .then(function() {
    app.dialog.alert("Cuota eliminada");
    mostrarCuotas();
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function mostrarCaja () {
  var totalIngresos = 0;
  var totalEgresos = 0;
  var totalCaja = 0;
  coleccionMovimientos.get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (documento) {
      var nro = parseInt(documento.data().monto);
      if (documento.data().tipo === "Ingreso") {
        totalIngresos += nro;
      } else {
        totalEgresos += nro;
      }
    })
    totalCaja = totalIngresos + totalEgresos;
    $$("#cajaCoordinador").html("Total caja = $" + totalCaja);
  })
}

function mostrarMovimientos() {
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Forma de pago</th>
                  <th class="label-cell">Observaciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionMovimientos.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#movimientosCaja").html(`<p>No hay movimientos registrados</p>`);
    } else {
      querySnapshot.forEach(function(documento) {
        fecha = documento.data().fecha;
        var nuevaFecha = new Date(fecha);
        nuevaFecha.setUTCHours(0, 0, 0, 0);
        var fechaFormateada = `${nuevaFecha.getUTCFullYear()}-${(nuevaFecha.getUTCMonth() + 1).toString().padStart(2, '0')}-${nuevaFecha.getUTCDate().toString().padStart(2, '0')}`;
        monto = documento.data().monto;
        observaciones = documento.data().observaciones;
        alumno = documento.data().alumno;
        cuota = documento.data().cuota;
        formaPago = documento.data().formaPago;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`;
      })
      $$("#movimientosCaja").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function funcionFiltros () {
  app.dialog.create({
    title: 'Filtros',
    content: `
        <div class="list">
            <ul>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Fecha desde</div>
                  <div class="item-input-wrap">
                    <input type="date" id="fechaDesde">
                  </div>
                </div>
              </li>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Fecha hasta</div>
                  <div class="item-input-wrap">
                    <input type="date" id="fechaHasta">
                  </div>
                </div>
              </li>
            </ul>
        </div>
    `,
    buttons: [
        {
            text: 'Aplicar',
            onClick: function () {
              fechaDesde = $$("#fechaDesde").val();
              fechaHasta = $$("#fechaHasta").val();
              aplicarFiltrosFecha();
            }
        },
        {
            text: 'Cancelar',
            onClick: function () {
            }
        },
    ]
}).open();
}

function aplicarFiltrosFecha () {
  var dateFechaDesde = Date.parse(fechaDesde);
  var dateFechaHasta = Date.parse(fechaHasta);
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Forma de pago</th>
                  <th class="label-cell">Observaciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  query = coleccionMovimientos.where("fecha", ">=" , dateFechaDesde).where("fecha", "<=", dateFechaHasta);
  query.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#movimientosCaja").html(`<p>No hay movimientos registrados</p>`);
    } else {
      querySnapshot.forEach(function(documento) {
        fecha = documento.data().fecha;
        var nuevaFecha = new Date(fecha);
        nuevaFecha.setUTCHours(0, 0, 0, 0);
        var fechaFormateada = `${nuevaFecha.getUTCFullYear()}-${(nuevaFecha.getUTCMonth() + 1).toString().padStart(2, '0')}-${nuevaFecha.getUTCDate().toString().padStart(2, '0')}`;
        monto = documento.data().monto;
        observaciones = documento.data().observaciones;
        alumno = documento.data().alumno;
        cuota = documento.data().cuota;
        formaPago = documento.data().formaPago;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`;
      })
      $$("#movimientosCaja").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function funcionFiltrarMovimientos (tipoMovimiento) {
  var inicio, cuerpo, fin;
  if (tipoMovimiento === "Egreso") {
    inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Concepto</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Forma de pago</th>
                  <th class="label-cell">Observaciones</th>
                </tr>
              </thead>
              <tbody>`;
  } else {
    inicio = `<div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th class="label-cell">Fecha</th>
                    <th class="label-cell">Monto</th>
                    <th class="label-cell">Alumno</th>
                    <th class="label-cell">Cuota</th>
                    <th class="label-cell">Forma de pago</th>
                    <th class="label-cell">Observaciones</th>
                  </tr>
                </thead>
                <tbody>`;
  }
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  var query = coleccionMovimientos.where("tipo", "==", tipoMovimiento);
  query.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#movimientosCaja").html(`<p>No hay movimientos para mostrar</p>`);
    } else {
    querySnapshot.forEach(function(documento) {
        fecha = documento.data().fecha;
        monto = documento.data().monto;
        observaciones = documento.data().observaciones;
        alumno = documento.data().alumno;
        cuota = documento.data().cuota;
        formaPago = documento.data().formaPago;
        conceptoEgreso = documento.data().conceptoEgreso;
        if (tipoMovimiento === "Egreso") {
          cuerpo += `<tr>
          <td class="label-cell">${fecha}</td>
          <td class="label-cell">${conceptoEgreso}</td>
          <td class="label-cell">${monto}</td>
          <td class="label-cell">${formaPago}</td>
          <td class="label-cell">${observaciones}</td>
          </tr>`;
        } else {
          cuerpo += `<tr>
          <td class="label-cell">${fecha}</td>
          <td class="label-cell">${monto}</td>
          <td class="label-cell">${alumno}</td>
          <td class="label-cell">${cuota}</td>
          <td class="label-cell">${formaPago}</td>
          <td class="label-cell">${observaciones}</td>
          </tr>`;
        }
    })
    $$("#movimientosCaja").html(inicio + cuerpo + fin);
  }
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

function funcionActualizarFiltros () {
  var filtroIngresos = $$("#btnFiltrarIngresos").hasClass('apretado');
  var filtroEgresos = $$("#btnFiltrarEgresos").hasClass('apretado');
  if (filtroEgresos) {
    funcionFiltrarMovimientos("Egreso");
  } else if (filtroIngresos) {
    funcionFiltrarMovimientos("Ingreso");
  } else {
    mostrarMovimientos();
  }
}

function funcionEsconderInputs () {
  $$("#inputEgreso").hide();
  $$("#inputCuotaMovimiento").hide();
  $$("#inputAlumnoMovimiento").hide();
  $$("#inputMontoMovimiento").hide();
  $$("#inputObservacionesMovimiento").hide();
  $$("#inputFormaPagoMovimiento").hide();
}

function funcionTipoMovimiento (movimiento) {
  if (movimiento === "Ingreso") {
    $$("#inputAlumnoMovimiento").show();
    cargarAlumnosMovimiento();
  } else {
    $$("#inputEgreso").show();
    $$("#inputMontoMovimiento").show();
    $$("#inputFormaPagoMovimiento").show();
    $$("#inputObservacionesMovimiento").show();
  }
}

function cargarCuotasMovimiento (alumno) {
  var lista = `<option value="" disabled selected>Seleccionar...</option>`;
  coleccionAlumnos.doc(alumno).get()
  .then(function(documento) {
    clases = documento.data().clase;
    for (i=0; i <= (clases.length -1); i++) {
      nombreCuota = clases[i];
      lista += `<option value='${nombreCuota}'>${nombreCuota}</option>`;
    }
    $$("#cuotaMovimiento").append(lista);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionCuotaMovimiento (cuota) {
  coleccionCuotas.doc(cuota).get()
  .then(function(documento) {
    monto = documento.data().valor;
    $$("#inputMontoMovimiento").show();
    $$("#montoMovimiento").val(monto);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
  $$("#inputFormaPagoMovimiento").show();
  $$("#inputObservacionesMovimiento").show();
}

function cargarAlumnosMovimiento() {
  var lista = `<option value="" disabled selected>Seleccionar...</option>`;
  var consultasUsuarios = [];
  coleccionAlumnos.get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (documento) {
        var mailAlumno = documento.id;
        var consultaUsuario = coleccionUsuarios.doc(mailAlumno).get()
          .then(function (documento) {
            var nombre = documento.data().nombre;
            var apellido = documento.data().apellido;
            var nombreAlumno = nombre + " " + apellido;
            lista += `<option value='${mailAlumno}'>${nombreAlumno}</option>`;
          })
          .catch(function (error) {
            console.log("Error: ", error);
          });
        consultasUsuarios.push(consultaUsuario);
      });
      return Promise.all(consultasUsuarios);
    })
    .then(function () {
      $$("#alumnoMovimiento").html(lista);
    })
    .catch(function (error) {
      console.log("Error: ", error);
    });
}

function funcionFinAltaMovimiento() {
  conceptoEgreso = $$("#conceptoEgreso").val();
  fecha = $$("#fechaAltaMovimiento").val();
  var dateFechaMovimiento = Date.parse(fecha);
  observaciones = $$("#observacionesMovimiento").val();
  movimiento = $$("#tipoMovimiento").val();
  monto = $$("#montoMovimiento").val();
  alumno = $$("#alumnoMovimiento").val();
  formaPago = $$("#formaPagoMovimiento").val();
  cuota = $$("#cuotaMovimiento").val();
  if (movimiento === "Egreso") {
    monto = "-" + monto;
    alumnoPago = "-";
    cuota = "-";
  }
  if (movimiento === "Ingreso") {
    var subcoleccionPagos = coleccionPagos.doc(alumnoPago).collection("pagos");
    datosPago = { fecha: dateFechaMovimiento, monto: monto, cuota: cuota, observaciones: observaciones };
    subcoleccionPagos.add(datosPago)
    .then(function(documento) {
      console.log("pago creado correctamente");
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
  }
  if (fecha !== "" && observaciones !== "" && monto !== "" && movimiento !== "" && alumnoPago !== "" && cuota !== "" && formaPago !== "" && conceptoEgreso !== "") {
    datos = { fecha: dateFechaMovimiento, monto: monto, observaciones: observaciones, tipo: movimiento, formaPago: formaPago, cuota: cuota, alumno: alumnoPago, conceptoEgreso: conceptoEgreso };
    coleccionMovimientos.add(datos)
    .then(function(documento) {
      app.dialog.alert("Movimiento creado exitosamente");
      mainView.router.navigate("/coordinador/");
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
  }
}

function crearAlumnoPago (alumno) {
  coleccionUsuarios.doc(alumno).get()
    .then(function (documento) {
      nombre = documento.data().nombre;
      apellido = documento.data().apellido;
      alumnoPago = nombre + " " + apellido;
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
}

function funcionCrearAlumno () {
  email = $$("#emailAltaAlumno").val();
  contrasena = $$("#contrasenaAltaAlumno").val();

  if (email != "" && contrasena != "") {
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
      var user = userCredential.user;
      var idUsuario = email;
      nombre = $$("#nombreAltaAlumno").val();
      apellido = $$("#apellidoAltaAlumno").val();
      telefono = $$("#telefonoAltaAlumno").val();
      fechaNacimiento = $$("#fechaNacimientoAltaAlumno").val();
      tipoUsuario = "Alumno";

      datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario};

      coleccionUsuarios.doc(idUsuario).set(datos)
      .then(function (documento) {
        app.dialog.alert("Alumno creado exitosamente");
        mainView.router.navigate("/coordinador/");
      })
      .catch( function (error) {
        console.log("Error " + error);
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      switch (errorCode) {
        case "auth/email-already-in-use": app.dialog.alert("El email ya se encuentra registrado");
        break;
        case "auth/invalid-email": app.dialog.alert("El email no es válido");
        break;
        case "auth/weak-password": app.dialog.alert("La contraseña debe tener al menos 6 caracteres");
        break;
        default:
      }
    });
  }
}

function funcionCrearEntrenador () {
  email = $$("#emailAltaEntrenador").val();
  contrasena = $$("#contrasenaAltaEntrenador").val();

  if (email != "" && contrasena != "") {
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
      var user = userCredential.user;
      var idUsuario = email;
      nombre = $$("#nombreAltaEntrenador").val();
      apellido = $$("#apellidoAltaEntrenador").val();
      telefono = $$("#telefonoAltaEntrenador").val();
      fechaNacimiento = $$("#fechaNacimientoAltaEntrenador").val();
      tipoUsuario = "Entrenador";

      datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario};

      coleccionUsuarios.doc(idUsuario).set(datos)
      .then(function (documento) {
        app.dialog.alert("Entrenador creado exitosamente");
        mainView.router.navigate("/coordinador/");
      })
      .catch( function (error) {
        console.log("Error " + error);
      })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      switch (errorCode) {
        case "auth/email-already-in-use": app.dialog.alert("El email ya se encuentra registrado");
        break;
        case "auth/invalid-email": app.dialog.alert("El email no es válido");
        break;
        case "auth/weak-password": app.dialog.alert("La contraseña debe tener al menos 6 caracteres");
        break;
        default:
      }
    });
  }
}

function funcionCrearClase () {
  var diasSeleccionados = [];
  var codigo = $$("#codigoAltaClase").val();
  nombre = $$("#nombreAltaClase").val();

  $$("input[type='checkbox']:checked").each(function() {
    var dia = $$(this).val();
    diasSeleccionados.push(dia);
  });

  if (nombre != "" && diasSeleccionados.length != 0 && codigo != "") {
    var idClase = codigo;
    datos = {nombre: nombre, dias: diasSeleccionados};
    coleccionClases.doc(idClase).set(datos)
    .then(function (documento) {
      app.dialog.alert("Clase creada exitosamente");
      mainView.router.navigate("/coordinador/");
    })
    .catch( function (error) {
      console.log("Error " + error);
    })
  }
}

function cargarClasesCuotas () {
  var opcion;
  coleccionClases.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      opcion += `<option value="${nombre}">${nombre}</option>`;
    });
    $$("#agregarClaseCuota").html(opcion);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionCrearCuota () {
  clase = $$("#agregarClaseCuota").val();
  valor = $$("#valorAltaCuota").val();

  if (clase != "" && valor != "") {
    var idCuota = clase;
    datos = {valor: valor};
    coleccionCuotas.doc(idCuota).set(datos)
    .then(function (documento) {
      app.dialog.alert("Cuota creada exitosamente");
      mainView.router.navigate("/coordinador/");
    })
    .catch( function (error) {
      console.log("Error " + error);
    })
  }
}

function funcionSaludoAlumno () {
  var query = coleccionUsuarios.where("rol", "==", "Alumno");
  query.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        nombreSaludo = documento.data().nombre;
      }
    });
    $$("#saludoAlumno").html("Hola " + nombreSaludo + "!");
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionSaludoEntrenador () {
  var query = coleccionUsuarios.where("rol", "==", "Entrenador");
  query.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        nombreSaludo = documento.data().nombre;
      }
    });
    $$("#saludoEntrenador").html("Hola " + nombreSaludo + "!");
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function mostrarAlumnosEntrenador() {
  app.preloader.show();
  coleccionEntrenadores.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(documento) {
        if (documento.id === email) {
          clase = documento.data().clase;
        }
      });
      var inicio = `<div class="data-table">
                        <table>
                          <thead>
                            <tr>
                              <th class="label-cell">Nombre</th>
                              <th class="label-cell">Apellido</th>
                              <th class="label-cell">Clase</th>
                            </tr>
                          </thead>
                          <tbody>`;

      var cuerpo = ``;
      var fin = `</tbody>
                    </table>
                  </div>`;
      coleccionAlumnos.where("clase", "==", clase).get()
        .then(function(querySnapshot) {
          var promesas = [];
          querySnapshot.forEach(function(documento) {
            var iD = documento.id;
            var query = coleccionUsuarios.where("rol", "==", "Alumno").get();
            promesas.push(
              query.then(function(querySnapshot) {
                querySnapshot.forEach(function(documento) {
                  if (documento.id === iD) {
                    nombre = documento.data().nombre;
                    apellido = documento.data().apellido;
                    cuerpo += `<tr>
                                <td class="label-cell">${nombre}</td>
                                <td class="label-cell">${apellido}</td>
                                <td class="label-cell">${clase}</td>
                              </tr>`;
                  }
                });
              })
            );
          });
          Promise.all(promesas)
            .then(function() {
              app.preloader.hide();
              $$("#alumnosEntrenador").html(inicio + cuerpo + fin);
            })
            .catch(function(error) {
              console.log("Error: ", error);
              app.preloader.hide();
            });
        })
        .catch(function(error) {
          console.log("Error: ", error);
          app.preloader.hide();
        });
    })
    .catch(function(error) {
      console.log("Error: ", error);
      app.preloader.hide();
    });
}

function mostrarClasesEntrenador () {
  coleccionEntrenadores.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        clase = documento.data().clase;
      }
    });
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Código</th>
                  <th class="label-cell">Nombre</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionClases.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.data().nombre == clase) {
        nombre = documento.data().nombre;
        codigo = documento.id;
        cuerpo += `<tr>
        <td class="label-cell">${codigo}</td>
        <td class="label-cell">${nombre}</td>
        </tr>`
      }
    })
    $$("#clasesEntrenador").html(inicio + cuerpo + fin);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

async function mostrarClasesAlumno() {
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Código</th>
                  <th class="label-cell">Nombre</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  const documento = await coleccionAlumnos.doc(email).get();
  const clases = documento.data().clase;
  for (var i = 0; i < clases.length; i++) {
    var clase = clases[i];
    var query = coleccionClases.where("nombre", "==", clase)
    query.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(documento) {
        nombre = documento.data().nombre;
        codigo = documento.id;
        cuerpo += `<tr>
        <td class="label-cell">${codigo}</td>
        <td class="label-cell">${nombre}</td>
        </tr>`;
      })
      $$("#clasesAlumno").html(inicio + cuerpo + fin);
    })
    .catch(function(error) {
      console.log("Error: " , error);
    });
  }
}

function mostrarEntrenadoresAlumno () {
  coleccionAlumnos.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        clase = documento.data().clase;
      }
    });
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Nombre</th>
                  <th class="label-cell">Apellido</th>
                  <th class="label-cell">Clase</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionEntrenadores.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if ((documento.data().clase) == clase) {
        iD = documento.id;
        query = coleccionUsuarios.where("rol", "==", "Entrenador");
        query.get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(documento) {
            if (documento.id == iD) {
              nombre = documento.data().nombre;
              apellido = documento.data().apellido;
              cuerpo += `<tr>
              <td class="label-cell">${nombre}</td>
              <td class="label-cell">${apellido}</td>
              <td class="label-cell">${clase}</td>
              </tr>`
            }
          })
          $$("#entrenadoresAlumno").html(inicio + cuerpo + fin);
        })
        .catch(function(error) {
          console.log("Error: " , error);
        });
      }
    });
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function mostrarPagosAlumno() {
  var inicio, cuerpo, fin, nombreAlumno;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Observaciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;

  coleccionUsuarios.doc(email).get()
  .then(function (documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
    nombreAlumno = nombre + " " + apellido;
    var subcoleccionPagos = coleccionPagos.doc(nombreAlumno).collection('pagos');
    return subcoleccionPagos.get();
  })
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (documento) {
      fecha = documento.data().fecha;
      monto = documento.data().monto;
      cuota = documento.data().cuota;
      observaciones = documento.data().observaciones;
      cuerpo += `<tr>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${fecha}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${observaciones}</td>
      </tr>`;
    });

    $$("#pagosDelAlumno").html(inicio + cuerpo + fin);
  })
  .catch(function (error) {
    console.log("Error: ", error);
  });
}

function mostrarObjetivosAlumno () {
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Detalle</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionUsuarios.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if(documento.id == email) {
        nombre = documento.data().nombre;
        apellido = documento.data().apellido;
      }
    })
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionObjetivos.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#objetivosAlumno").html(`<p>No hay objetivos creados</p>`);
    } else {
      querySnapshot.forEach(function(documento) {
        if (documento.data().autor == (nombre + " " + apellido)) {
          detalle = documento.data().detalle;
          cuerpo += `<tr>
                  <td class="label-cell">${detalle}</td>
                  </tr>`;
        }
        $$("#objetivosAlumno").html(inicio + cuerpo + fin);
      })
    }
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionAutorObjetivo () {
  coleccionUsuarios.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        nombre = documento.data().nombre;
        apellido = documento.data().apellido;
      }
    })
    autor = nombre + " " + apellido;
    $$("#autorAltaObjetivo").val(autor);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionCrearObjetivo () {
  var detalle;
  detalle = $$("#detalleAltaObjetivo").val();
  datos = {detalle: detalle, autor: autor};
  coleccionObjetivos.add(datos)
  .then(function (documento) {
    app.dialog.alert("Objetivo creado exitosamente");
    mainView.router.navigate("/alumno/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}

function mostrarInformesEntrenador () {
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Detalle</th>
                  <th class="label-cell">Prioridad</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionUsuarios.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if(documento.id == email) {
        nombre = documento.data().nombre;
        apellido = documento.data().apellido;
      }
    })
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionInformes.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.data().autor == (nombre + " " + apellido)) {
        detalle = documento.data().detalle;
        prioridad = documento.data().prioridad;
        cuerpo += `<tr>
                <td class="label-cell">${detalle}</td>
                <td class="label-cell">${prioridad}</td>
                </tr>`;
      }
      $$("#informesEntrenador").html(inicio + cuerpo + fin);
    })
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function mostrarObjetivosEntrenador() {
  app.preloader.show();
  var inicio = `<div class="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th class="label-cell">Autor</th>
                          <th class="label-cell">Detalle</th>
                        </tr>
                      </thead>
                      <tbody>`;
  var cuerpo = ``;
  var fin = `</tbody>
                </table>
              </div>`;
  coleccionEntrenadores.get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (documento) {
        if (documento.id === email) {
          clase = documento.data().clase;
        }
      });
      return coleccionAlumnos.where("clase", "==", clase).get();
    })
    .then(function (querySnapshot) {
      var promesas = [];
      querySnapshot.forEach(function(documento) {
        var idAlumno = documento.id;
        var alumnoPromesa = coleccionUsuarios.doc(idAlumno).get()
          .then(function (documento) {
            if (documento.exists) {
              nombre = documento.data().nombre;
              apellido = documento.data().apellido;
              return coleccionObjetivos.where("autor", "==", nombre + " " + apellido).get();
            }
          });
        promesas.push(alumnoPromesa);
      });
      return Promise.all(promesas);
    })
    .then(function(querySnapshot) {
      querySnapshot.forEach(function (querySnapshot) {
        if (querySnapshot) {
          querySnapshot.forEach(function (documento) {
            var autor = documento.data().autor;
            var detalle = documento.data().detalle;
            cuerpo += `<tr>
              <td class="label-cell">${autor}</td>
              <td class="label-cell">${detalle}</td>
            </tr>`;
          });
        }
      });
      app.preloader.hide();
      $$("#objetivosEntrenador").html(inicio + cuerpo + fin);
    })
    .catch(function (error) {
      console.log("Error: ", error);
      app.preloader.hide();
    });
}
                
function funcionAutorInforme () {
  coleccionUsuarios.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      if (documento.id == email) {
        nombre = documento.data().nombre;
        apellido = documento.data().apellido;
      }
    })
    autor = nombre + " " + apellido;
    $$("#autorAltaInforme").val(autor);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionCrearInforme () {
  var detalle, prioridad;
  detalle = $$("#detalleAltaInforme").val();
  prioridad = $$("#prioridadAltaInforme").val(); 
  datos = {detalle: detalle, prioridad: prioridad, autor: autor};
  coleccionInformes.add(datos)
  .then(function (documento) {
    app.dialog.alert("Informe creado exitosamente");
    mainView.router.navigate("/entrenador/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  });
}