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
codigo, cont, fechaDesde, fechaHasta, clase, club, idClase, mes;
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
  $$("#clubRegistro").on("change", function() {
    club = $$(this).val();
    cargarClasesRegistro(club);
  });
  $$("#btnFinalizarRegistro").on("click", funcionFinRegistro);
})

$$(document).on('page:init', '.page[data-name="registro1"]', function (e) {
  $$("#btnRegistro").on("click", funcionRegistro);
})

$$(document).on('page:init', '.page[data-name="coordinador"]', function (e) {
  app.preloader.show();
  function cargarDatos() {
    funcionSaludoCoordinador();
    mostrarAlumnos();
    mostrarEntrenadores();
    mostrarInformes();
    mostrarCuotas();
    mostrarCaja();
    cargarClasesCuotas();
  }
  cargarDatos();
  $$(document).on('page:afterin', '.page[data-name="coordinador"]', function (e) {
    app.preloader.hide();
  });
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
  $$("#btnFiltrarEfectivo").on("click", function() {
    $$("#btnFiltrarTransferencia").removeClass('apretado');
    $$(this).toggleClass('apretado');
    funcionActualizarFiltros();
  });
  $$("#btnFiltrarTransferencia").on("click", function() {
    $$("#btnFiltrarEfectivo").removeClass('apretado');
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
  $$("#alumnoMovimiento").on("change", funcionAlumnoMovimiento)
  $$("#cuotaMovimiento").on("change", function() {
    var cuota = $$(this).val();
    funcionCuotaMovimiento(cuota);
  });

  $$("#btnFinalizarAltaMovimiento").on("click", funcionFinAltaMovimiento);
})

$$(document).on('page:init', '.page[data-name="alumno"]', function (e) {
  app.preloader.show();
  function cargarDatos() {
    funcionSaludoAlumno();
    mostrarClasesAlumno();
    mostrarEntrenadoresAlumno();
    mostrarObjetivosAlumno();
    mostrarPagosAlumno();
  }
  cargarDatos();
  $$(document).on('page:afterin', '.page[data-name="alumno"]', function (e) {
    app.preloader.hide();
  });
  $$("#btnAltaObjetivo").on("click", function() {
    mainView.router.navigate("/alumno/altaObjetivo/");
  });
})

$$(document).on('page:init', '.page[data-name="altaObjetivo"]', function (e) {
  $$("#btnFinalizarAltaObjetivo").on("click", funcionCrearObjetivo);
})

$$(document).on('page:init', '.page[data-name="entrenador"]', function (e) {
  app.preloader.show();
  function cargarDatos() {
    funcionSaludoEntrenador();
    mostrarAlumnosEntrenador();
    mostrarInformesEntrenador();
    mostrarObjetivosEntrenador();
    mostrarClasesEntrenador();
  }
  cargarDatos();
  $$(document).on('page:afterin', '.page[data-name="entrenador"]', function (e) {
    app.preloader.hide();
  });
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

function cargarClasesRegistro (club) {
  app.preloader.show();
  var lista = `<option value="" disabled selected>Seleccionar...</option>`;
  var subcoleccionClases = coleccionClases.doc(club).collection('clases');
  subcoleccionClases.get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (documento) {
      nombre = documento.data().nombre;
      lista += `<option value='${nombre}'>${nombre}</option>`
    });
    app.preloader.hide();
    $$("#claseRegistro").html(lista);
  })
  .catch(function (error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionFinRegistro () {
  app.preloader.show();
  var idUsuario = email;
  nombre = $$("#nombreRegistro").val();
  apellido = $$("#apellidoRegistro").val();
  telefono = $$("#telefonoRegistro").val();
  fechaNacimiento = $$("#fechaNacimientoRegistro").val();
  club = $$("#clubRegistro").val();
  clase = $$("#claseRegistro").val();
  tipoUsuario = $$("#tipoUsuarioRegistro").val();
  clases = [clase];
  datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario, club: club, clase: clases};
  switch (tipoUsuario){
    case "Alumno": coleccionAlumnos.doc(email).set({clase: clases})
    .then(function (documento) {
      console.log("alumno creado");
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
    break;
    case "Entrenador": coleccionEntrenadores.doc(email).set({clase: clases})
    .then(function (documento) {
      console.log("entrenador creado");
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
    break;
    default:
  }
  coleccionUsuarios.doc(idUsuario).set(datos)
  .then(function (documento) {
    app.preloader.hide();
    app.dialog.alert("Usuario registrado");
    mainView.router.navigate("/index/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}

function funcionLogin () {
  app.preloader.show();
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
      app.preloader.hide();
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
        club = documento.data().club;
      }
    });
    $$("#saludoCoordinador").html("Hola " + nombreSaludo + "!");
    mostrarClases(club);
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
      <td class="label-cell divBotones"><button onclick="verAlumno('${alumno}')" class="button button-raised button-fill botones"><i class="icon f7-icons">eye</i></button><button onclick="editarAlumno('${documento.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">pencil</i></button>
      </button><button onclick="asignarClasesAlumnos('${documento.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">plus</i></button>
      <button onclick="borrarAlumno('${documento.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">trash</i></button></td>
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
  app.preloader.show();
  var subcoleccionPagos = coleccionPagos.doc(alumno).collection('pagos');
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Mes cuota</th>
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
    if (querySnapshot.size === 0) {
      app.preloader.hide();
      $$("#pagosAlumno").html(`<p>No hay pagos registrados</p>`);
    } else {
      querySnapshot.forEach(function (documento) {
        fecha = documento.data().fecha;
        var nuevaFecha = new Date(fecha);
        nuevaFecha.setUTCHours(0, 0, 0, 0);
        var fechaFormateada = `${nuevaFecha.getUTCFullYear()}-${(nuevaFecha.getUTCMonth() + 1).toString().padStart(2, '0')}-${nuevaFecha.getUTCDate().toString().padStart(2, '0')}`;
        monto = documento.data().monto;
        cuota = documento.data().cuota;
        mes = documento.data().mes;
        observaciones = documento.data().observaciones;
        cuerpo += `<tr>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${mes}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`
      })
      app.preloader.hide();
      $$("#pagosAlumno").html(inicio + cuerpo + fin);
    }
    $$("#nombreAlumno").html("Pagos de " + alumno);
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: " , error);
  });
}

function editarAlumno(id) {
  mainView.router.navigate("/coordinador/editarAlumno/");
  app.preloader.show();
  email = id;
  coleccionUsuarios.doc(id).get()
  .then(function(alumno) {
    $$("#nombreEditarAlumno").val(alumno.data().nombre);
    $$("#apellidoEditarAlumno").val(alumno.data().apellido);
    $$("#telefonoEditarAlumno").val(alumno.data().telefono);
    $$("#fechaNacimientoEditarAlumno").val(alumno.data().nacimiento);
    app.preloader.hide();
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error ", error);
  });
}

function agregarNuevoSelect() {
  var i = 1;
  if (cont <= 5) {
    var lista = "";
    coleccionClases.doc(club).collection("clases").get()
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
    if (documento.exists) {
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
  app.preloader.show();
  clases = [];
  for (var i=1; i<=6; i++) {
    if (($$("#selectClase"+i).val()) != undefined) {
      var clase = $$("#selectClase"+i).val();
      clases.push(clase);
    }
  }
  coleccionAlumnos.doc(email).set({clase: clases})
  .then(function() {
    app.preloader.hide();
    app.dialog.alert("Clase asignada correctamente");
    mainView.router.navigate("/coordinador/");
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionFinEditarAlumno () {
  app.preloader.show();
  nombre = $$("#nombreEditarAlumno").val();
  apellido = $$("#apellidoEditarAlumno").val();
  telefono = $$("#telefonoEditarAlumno").val();
  fechaNacimiento = $$("#fechaNacimientoEditarAlumno").val();
  coleccionUsuarios.doc(email).update({nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento})
  .then(function (documento) {
    app.preloader.hide();
    app.dialog.alert("Usuario editado");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}

function borrarAlumno(id) {
  app.dialog.confirm("¿Desea eliminar el alumno?", function () {
    confirmarBorrarAlumno(id);
  });
}

function confirmarBorrarAlumno (id) {
  app.preloader.show();
  coleccionAlumnos.doc(id).delete()
  .then(function() {
    console.log("borro el alumno");
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionUsuarios.doc(id).delete()
  .then(function() {
    app.preloader.hide();
    app.dialog.alert("Alumno eliminado");
    mostrarAlumnos();
  })
  .catch(function(error) {
    app.preloader.hide();
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
      <td class="label-cell divBotones"><button onclick="editarEntrenador('${doc.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">pencil</i></button>
      <button onclick="borrarEntrenador('${doc.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">trash</i></button></td>
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
  app.preloader.show();
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
    app.preloader.hide();
    app.dialog.alert("Usuario editado");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}

function borrarEntrenador(id) {
  app.dialog.confirm("¿Desea eliminar el entrenador?", function () {
    confirmarBorrarEntrenador(id);
  });
}

function confirmarBorrarEntrenador (id) {
  app.preloader.show();
  coleccionEntrenadores.doc(id).delete()
  .then(function() {
    console.log("borro el entrenador");
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionUsuarios.doc(id).delete()
  .then(function() {
    app.preloader.hide();
    app.dialog.alert("Entrenador eliminado");
    mostrarEntrenadores();
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function mostrarClases (club) {
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
  var subcoleccionClases = coleccionClases.doc(club).collection('clases');
  subcoleccionClases.get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#clasesCoordinador").html(`<p>No hay clases creadas</p>`);
    } else {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      idClase = doc.id;
      cuerpo += `<tr>
      <td class="label-cell">${idClase}</td>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell divBotones"><button onclick="editarClase('${doc.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">pencil</i></button>
      <button onclick="borrarClase('${doc.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">trash</i></button></td>
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
  coleccionClases.doc(club).collection("clases").doc(id).get()
  .then(function(clase) {
    $$("#nombreEditarClase").val(clase.data().nombre);
    var diasSeleccionados = clase.data().dias;
    idClase = id;
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
  app.preloader.show();
  var diasSeleccionados = [];
  nombre = $$("#nombreEditarClase").val();
  $$("input[type='checkbox']:checked").each(function() {
    var dia = $$(this).val();
    diasSeleccionados.push(dia);
  });
  coleccionClases.doc(club).collection("clases").doc(idClase).update({nombre: nombre, dias: diasSeleccionados})
  .then(function (documento) {
    app.preloader.hide();
    app.dialog.alert("Clase editada");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}

function borrarClase(id) {
  app.dialog.confirm("¿Desea eliminar la clase?", function () {
    confirmarBorrarClase(id);
  });
}

function confirmarBorrarClase (id) {
  app.preloader.show();
  coleccionClases.doc(club).collection("clases").doc(id).delete()
  .then(function() {
    app.preloader.hide();
    app.dialog.alert("Clase eliminada");
    mostrarClases(club);
  })
  .catch(function(error) {
    app.preloader.hide();
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
                  <th class="label-cell">Detalle</th>
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
      <td class="label-cell divBotones"><button onclick="editarCuota('${documento.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">pencil</i></button>
      <button onclick="borrarCuota('${documento.id}')" class="button button-raised button-fill botones"><i class="icon f7-icons">trash</i></button></td>
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
  app.preloader.hide();
  detalle = $$("#detalleEditarCuota").val();
  valor = $$("#valorEditarCuota").val();
  coleccionCuotas.doc(codigo).update({detalle: detalle, valor: valor})
  .then(function (documento) {
    app.preloader.hide();
    app.dialog.alert("Cuota editada");
    mainView.router.navigate("/coordinador/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}

function borrarCuota(id) {
  app.dialog.confirm("¿Desea eliminar la cuota?", function () {
    confirmarBorrarCuota(id);
  });
}

function confirmarBorrarCuota (id) {
  app.preloader.show();
  coleccionCuotas.doc(id).delete()
  .then(function() {
    app.preloader.hide();
    app.dialog.alert("Cuota eliminada");
    mostrarCuotas();
  })
  .catch(function(error) {
    app.preloader.hide();
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
  app.preloader.show();
  var inicio, cuerpo, fin;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Mes</th>
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
      app.preloader.hide();
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
        mes = documento.data().mes;
        formaPago = documento.data().formaPago;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${mes}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`;
      })
      app.preloader.hide();
      $$("#movimientosCaja").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    app.preloader.hide();
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
  app.preloader.show();
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
                  <th class="label-cell">Mes</th>
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
      app.preloader.hide();
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
        mes = documento.data().mes;
        formaPago = documento.data().formaPago;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${mes}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`;
      })
      app.preloader.hide();
      $$("#movimientosCaja").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionFiltrarMovimientos (tipoMovimiento) {
  app.preloader.show();
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
                    <th class="label-cell">Mes cuota</th>
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
        app.preloader.hide();
        $$("#movimientosCaja").html(`<p>No hay movimientos para mostrar</p>`);
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
          mes = documento.data().mes;
          formaPago = documento.data().formaPago;
          conceptoEgreso = documento.data().conceptoEgreso;
          if (tipoMovimiento === "Egreso") {
            cuerpo += `<tr>
            <td class="label-cell">${fechaFormateada}</td>
            <td class="label-cell">${conceptoEgreso}</td>
            <td class="label-cell">${monto}</td>
            <td class="label-cell">${formaPago}</td>
            <td class="label-cell">${observaciones}</td>
            </tr>`;
          } else {
            cuerpo += `<tr>
            <td class="label-cell">${fechaFormateada}</td>
            <td class="label-cell">${monto}</td>
            <td class="label-cell">${alumno}</td>
            <td class="label-cell">${cuota}</td>
            <td class="label-cell">${mes}</td>
            <td class="label-cell">${formaPago}</td>
            <td class="label-cell">${observaciones}</td>
            </tr>`;
          }
      })
      app.preloader.hide();
      $$("#movimientosCaja").html(inicio + cuerpo + fin);
    }
    })
    .catch(function(error) {
      app.preloader.hide();
      console.log("Error: ", error);
    });
}

function funcionActualizarFiltros () {
  var filtroIngresos = $$("#btnFiltrarIngresos").hasClass('apretado');
  var filtroEgresos = $$("#btnFiltrarEgresos").hasClass('apretado');
  var filtroEfectivo = $$("#btnFiltrarEfectivo").hasClass('apretado');
  var filtroTransferencia = $$("#btnFiltrarTransferencia").hasClass('apretado');
  if (filtroIngresos) {
    if (filtroEfectivo) {
      funcionFiltrarIngresos("Efectivo");
    } else if (filtroTransferencia) {
      funcionFiltrarIngresos("Transferencia");
    } else {
      funcionFiltrarMovimientos("Ingreso");
    }
  } else if (filtroEgresos) {
    if (filtroEfectivo) {
      funcionFiltrarEgresos("Efectivo");
    } else if (filtroTransferencia) {
      funcionFiltrarEgresos("Transferencia");
    } else {
      funcionFiltrarMovimientos("Egreso");
    }
  } else if (filtroEfectivo) {
    funcionFiltrarEfectivo();
  } else if (filtroTransferencia) {
    funcionFiltrarTransferencia();
  } else {
    mostrarMovimientos();
  }
}

function funcionFiltrarIngresos (formaPago) {
  app.preloader.show();
  inicio = `<div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th class="label-cell">Fecha</th>
                    <th class="label-cell">Monto</th>
                    <th class="label-cell">Alumno</th>
                    <th class="label-cell">Cuota</th>
                    <th class="label-cell">Mes cuota</th>
                    <th class="label-cell">Forma de pago</th>
                    <th class="label-cell">Observaciones</th>
                  </tr>
                </thead>
                <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionMovimientos.where("tipo", "==", "Ingreso").where("formaPago", "==", formaPago).get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      app.preloader.hide();
      $$("#movimientosCaja").html(`<p>No hay movimientos para mostrar</p>`);
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
        mes = documento.data().mes;
        formaPago = documento.data().formaPago;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${mes}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`;
    })
    app.preloader.hide();
    $$("#movimientosCaja").html(inicio + cuerpo + fin);
  }
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionFiltrarEgresos (formaPago) {
  app.preloader.show();
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
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionMovimientos.where("tipo", "==", "Egreso").where("formaPago", "==", formaPago).get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      app.preloader.hide();
      $$("#movimientosCaja").html(`<p>No hay movimientos para mostrar</p>`);
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
        conceptoEgreso = documento.data().conceptoEgreso;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${conceptoEgreso}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${observaciones}</td>
        </tr>`;
    })
    app.preloader.hide();
    $$("#movimientosCaja").html(inicio + cuerpo + fin);
  }
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionFiltrarEfectivo () {
  app.preloader.show();
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Concepto</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Forma de pago</th>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Mes cuota</th>
                  <th class="label-cell">Observaciones</th>
                  <th class="label-cell">Tipo movimiento</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionMovimientos.where("formaPago", "==", "Efectivo").get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      app.preloader.hide();
      $$("#movimientosCaja").html(`<p>No hay movimientos para mostrar</p>`);
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
        mes = documento.data().mes;
        formaPago = documento.data().formaPago;
        conceptoEgreso = documento.data().conceptoEgreso;
        tipoMovimiento = documento.data().tipo;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${conceptoEgreso}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${mes}</td>
        <td class="label-cell">${observaciones}</td>
        <td class="label-cell">${tipoMovimiento}</td>
        </tr>`;
    })
    app.preloader.hide();
    $$("#movimientosCaja").html(inicio + cuerpo + fin);
  }
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionFiltrarTransferencia () {
  app.preloader.show();
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Concepto</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Forma de pago</th>
                  <th class="label-cell">Alumno</th>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Mes cuota</th>
                  <th class="label-cell">Observaciones</th>
                  <th class="label-cell">Tipo movimiento</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  coleccionMovimientos.where("formaPago", "==", "Transferencia").get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      app.preloader.hide();
      $$("#movimientosCaja").html(`<p>No hay movimientos para mostrar</p>`);
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
        mes = documento.data().mes;
        formaPago = documento.data().formaPago;
        conceptoEgreso = documento.data().conceptoEgreso;
        tipoMovimiento = documento.data().tipo;
        cuerpo += `<tr>
        <td class="label-cell">${fechaFormateada}</td>
        <td class="label-cell">${conceptoEgreso}</td>
        <td class="label-cell">${monto}</td>
        <td class="label-cell">${formaPago}</td>
        <td class="label-cell">${alumno}</td>
        <td class="label-cell">${cuota}</td>
        <td class="label-cell">${mes}</td>
        <td class="label-cell">${observaciones}</td>
        <td class="label-cell">${tipoMovimiento}</td>
        </tr>`;
    })
    app.preloader.hide();
    $$("#movimientosCaja").html(inicio + cuerpo + fin);
  }
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionEsconderInputs () {
  $$("#inputEgreso").hide();
  $$("#inputCuotaMovimiento").hide();
  $$("#inputAlumnoMovimiento").hide();
  $$("#inputMontoMovimiento").hide();
  $$("#inputObservacionesMovimiento").hide();
  $$("#inputFormaPagoMovimiento").hide();
  $$("#inputMesMovimiento").hide();
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

async function cargarCuotasMovimiento(alumno) {
  app.preloader.show();
  var lista = `<option value="" disabled selected>Seleccionar...</option>`;
  try {
    const documento = await coleccionAlumnos.doc(alumno).get();
    const clases = documento.data().clase;
    for (let i = 0; i < clases.length; i++) {
      const clase = clases[i];
      const querySnapshot = await coleccionCuotas.where("clase", "==", clase).get();
      querySnapshot.forEach(documento => {
        lista += `<option value='${documento.id}'>${documento.id}</option>`;
      });
    }
    app.preloader.hide();
    $$("#cuotaMovimiento").html(lista);
  } catch (error) {
    app.preloader.hide();
    console.log("Error: ", error);
  }
}

function funcionCuotaMovimiento (cuota) {
  app.preloader.show();
  coleccionCuotas.doc(cuota).get()
  .then(function(documento) {
    monto = documento.data().valor;
    $$("#inputMontoMovimiento").show();
    $$("#montoMovimiento").val(monto);
    app.preloader.hide();
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: " , error);
  });
  $$("#inputMesMovimiento").show();
  $$("#inputFormaPagoMovimiento").show();
  $$("#inputObservacionesMovimiento").show();
}

async function cargarAlumnosMovimiento() {
  app.preloader.show();
  var lista = `<option value="" disabled selected>Seleccionar...</option>
  <option value="Sin alumno">Sin alumno / otros ingresos</option>`;
  coleccionUsuarios.where("rol", "==", "Alumno").get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (documento) {
      var nombre = documento.data().nombre;
      var apellido = documento.data().apellido;
      var nombreAlumno = nombre + " " + apellido;
      lista += `<option value='${documento.id}'>${nombreAlumno}</option>`;
    })
    app.preloader.hide();
    $$("#alumnoMovimiento").html(lista);
  })
  .catch(function (error) {
    app.preloader.hide();
    console.log("Error: ", error);
  });
}

function funcionAlumnoMovimiento () {
  var valor = $$(this).val();
  if (valor == "Sin alumno") {
    $$("#inputMontoMovimiento").show();
    $$("#inputFormaPagoMovimiento").show();
    $$("#inputObservacionesMovimiento").show();
  } else {
    cargarCuotasMovimiento(valor);
    crearAlumnoPago(valor);
    $$("#inputCuotaMovimiento").show();
  }
}

function funcionFinAltaMovimiento() {
  app.preloader.show();
  conceptoEgreso = $$("#conceptoEgreso").val();
  fecha = $$("#fechaAltaMovimiento").val();
  var dateFechaMovimiento = Date.parse(fecha);
  observaciones = $$("#observacionesMovimiento").val();
  movimiento = $$("#tipoMovimiento").val();
  monto = $$("#montoMovimiento").val();
  alumno = $$("#alumnoMovimiento").val();
  formaPago = $$("#formaPagoMovimiento").val();
  cuota = $$("#cuotaMovimiento").val();
  mes = $$("#mesCuota").val()
  if (movimiento === "Egreso") {
    monto = "-" + monto;
    alumnoPago = "-";
    cuota = "-";
    mes = "-";
  }
  if (alumno == "Sin alumno") {
    cuota = "-";
    alumno = "-";
    mes = "-";
  }
  if (movimiento === "Ingreso") {
    conceptoEgreso = "-";
    var subcoleccionPagos = coleccionPagos.doc(alumnoPago).collection("pagos");
    datosPago = { fecha: dateFechaMovimiento, monto: monto, cuota: cuota, observaciones: observaciones, mes: mes };
    subcoleccionPagos.add(datosPago)
    .then(function(documento) {
      console.log("pago creado correctamente");
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
  }
  if (fecha !== "" && observaciones !== "" && monto !== "" && movimiento !== "" && alumnoPago !== "" && cuota !== "" && formaPago !== "" && conceptoEgreso !== "") {
    datos = { fecha: dateFechaMovimiento, monto: monto, observaciones: observaciones, tipo: movimiento, formaPago: formaPago, cuota: cuota, alumno: alumnoPago, conceptoEgreso: conceptoEgreso, mes: mes };
    coleccionMovimientos.add(datos)
    .then(function(documento) {
      app.preloader.hide();
      app.dialog.alert("Movimiento creado exitosamente");
      mainView.router.navigate("/coordinador/");
    })
    .catch( function (error) {
      app.preloader.hide();
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
  idClase = $$("#codigoAltaClase").val();
  nombre = $$("#nombreAltaClase").val();
  $$("input[type='checkbox']:checked").each(function() {
    var dia = $$(this).val();
    diasSeleccionados.push(dia);
  });
  if (nombre != "" && diasSeleccionados.length != 0 && codigo != "") {
    var subcoleccionClases = coleccionClases.doc(club).collection("clases");
    datos = {nombre: nombre, dias: diasSeleccionados};
    subcoleccionClases.doc(idClase).set(datos)
    .then(function(documento) {
      app.dialog.alert("Clase creada exitosamente");
      mainView.router.navigate("/coordinador/");
    })
    .catch( function (error) {
      console.log("Error " + error);
    });
  }
}

function cargarClasesCuotas () {
  app.preloader.show();
  var opcion = `<option value="" disabled selected>Seleccionar...</option>`;
  coleccionClases.doc(club).collection("clases").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      opcion += `<option value="${nombre}">${nombre}</option>`;
    });
    app.preloader.hide();
    $$("#agregarClaseCuota").html(opcion);
  })
  .catch(function(error) {
    app.preloader.hide();
    console.log("Error: " , error);
  });
}

function funcionCrearCuota () {
  app.preloader.show();
  clase = $$("#agregarClaseCuota").val();
  valor = $$("#valorAltaCuota").val();
  detalle = $$("#detalleAltaCuota").val();
  if (clase != "" && valor != "" && detalle != "") {
    var idCuota = detalle;
    datos = {valor: valor, clase: clase};
    coleccionCuotas.doc(idCuota).set(datos)
    .then(function (documento) {
      app.preloader.hide();
      app.dialog.alert("Cuota creada exitosamente");
      mainView.router.navigate("/coordinador/");
    })
    .catch( function (error) {
      app.preloader.hide();
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
        club = documento.data().club;
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
        club = documento.data().club;
      }
    });
    $$("#saludoEntrenador").html("Hola " + nombreSaludo + "!");
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

async function mostrarAlumnosEntrenador() {
  await coleccionEntrenadores.doc(email).get()
  .then(function(documento) {
    clase = documento.data().clase;
  })
  .catch(function(error) {
    console.log("Error: ", error);
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
  var query = coleccionAlumnos.where("clase", "array-contains", clase)
  query.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(documento) {
      iD = documento.id;
      coleccionUsuarios.doc(iD).get()
      .then(function(documento) {
        nombre = documento.data().nombre;
        apellido = documento.data().apellido;
        cuerpo += `<tr>
                    <td class="label-cell">${nombre}</td>
                    <td class="label-cell">${apellido}</td>
                    <td class="label-cell">${clase}</td>
                  </tr>`;
        $$("#alumnosEntrenador").html(inicio + cuerpo + fin);
      });
    })
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
}

async function mostrarClasesEntrenador () {
  await coleccionEntrenadores.doc(email).get()
  .then(function(documento) {
    clases = documento.data().clase;
  })
  .catch(function(error) {
    console.log("Error: ", error);
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
  if (clases.length == 0) {
    $$("#clasesEntrenador").html(`<p>No estás dando clases por el momento</p>`);
  } else {
    for (var i = 0; i < clases.length; i++) {
      var clase = clases[i];
      var query = coleccionClases.doc(club).collection("clases").where("nombre", "==", clase)
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
        $$("#clasesEntrenador").html(inicio + cuerpo + fin);
      })
      .catch(function(error) {
        console.log("Error: " , error);
      });
    }
  }
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
  if (clases.length == 0) {
    $$("#clasesAlumno").html(`<p>No estás tomando clases por el momento</p>`);
  } else {
    for (var i = 0; i < clases.length; i++) {
      var clase = clases[i];
      var query = coleccionClases.doc(club).collection("clases").where("nombre", "==", clase)
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

async function mostrarPagosAlumno() {
  var inicio, cuerpo, fin, nombreAlumno;
  inicio = `<div class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Cuota</th>
                  <th class="label-cell">Fecha</th>
                  <th class="label-cell">Mes cuota</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Observaciones</th>
                </tr>
              </thead>
              <tbody>`;
  cuerpo = ``;
  fin = `</tbody>
            </table>
          </div>`;
  await coleccionUsuarios.doc(email).get()
  .then(function (documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
    nombreAlumno = nombre + " " + apellido;
  })
  var subcoleccionPagos = coleccionPagos.doc(nombreAlumno).collection('pagos');
  subcoleccionPagos.get()
  .then(function (querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#pagosDelAlumno").html(`<p>No hay pagos registrados</p>`);
    } else {
      querySnapshot.forEach(function (documento) {
        fecha = documento.data().fecha;
        var nuevaFecha = new Date(fecha);
        nuevaFecha.setUTCHours(0, 0, 0, 0);
        var fechaFormateada = `${nuevaFecha.getUTCFullYear()}-${(nuevaFecha.getUTCMonth() + 1).toString().padStart(2, '0')}-${nuevaFecha.getUTCDate().toString().padStart(2, '0')}`;
        monto = documento.data().monto;
        cuota = documento.data().cuota;
        mes = documento.data().mes;
        observaciones = documento.data().observaciones;
        cuerpo += `<tr>
          <td class="label-cell">${cuota}</td>
          <td class="label-cell">${fechaFormateada}</td>
          <td class="label-cell">${mes}</td>
          <td class="label-cell">${monto}</td>
          <td class="label-cell">${observaciones}</td>
        </tr>`;
      });
      $$("#pagosDelAlumno").html(inicio + cuerpo + fin);
    }
  })
  .catch(function (error) {
    console.log("Error: ", error);
  });
}

async function mostrarObjetivosAlumno () {
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
  await coleccionUsuarios.doc(email).get()
  .then(function(documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
    autor = nombre + " " + apellido;
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  await coleccionObjetivos.where("autor", "==", autor).get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#objetivosAlumno").html(`<p>No hay objetivos creados</p>`);
    } else {
      querySnapshot.forEach(function(documento) {
        detalle = documento.data().detalle;
        cuerpo += `<tr>
                <td class="label-cell">${detalle}</td>
                </tr>`;
      })
      $$("#objetivosAlumno").html(inicio + cuerpo + fin);
    }
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

async function funcionCrearObjetivo () {
  app.preloader.show();
  await coleccionUsuarios.doc(email).get()
  .then(function(documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
    autor = nombre + " " + apellido;
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
  var detalle;
  detalle = $$("#detalleAltaObjetivo").val();
  datos = {detalle: detalle, autor: autor};
  coleccionObjetivos.add(datos)
  .then(function (documento) {
    app.preloader.hide();
    app.dialog.alert("Objetivo creado exitosamente");
    mainView.router.navigate("/alumno/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}

async function mostrarInformesEntrenador () {
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
  await coleccionUsuarios.doc(email).get()
  .then(function(documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
  })
  .catch(function(error) {
    console.log("Error: ", error);
  });
  coleccionInformes.where("autor", "==", (nombre + " " + apellido)).get()
  .then(function(querySnapshot) {
    if (querySnapshot.size === 0) {
      $$("#informesEntrenador").html(`<p>No hay informes creados</p>`);
    } else {
      querySnapshot.forEach(function(documento) {
        detalle = documento.data().detalle;
        prioridad = documento.data().prioridad;
        cuerpo += `<tr>
                <td class="label-cell">${detalle}</td>
                <td class="label-cell">${prioridad}</td>
                </tr>`;
      })
      $$("#informesEntrenador").html(inicio + cuerpo + fin);
    }
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
      return coleccionAlumnos.where("clase", "array-contains", clase).get();
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
  coleccionUsuarios.doc(email).get()
  .then(function(documento) {
    nombre = documento.data().nombre;
    apellido = documento.data().apellido;
    autor = nombre + " " + apellido;
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function funcionCrearInforme () {
  app.preloader.show();
  var detalle, prioridad;
  detalle = $$("#detalleAltaInforme").val();
  prioridad = $$("#prioridadAltaInforme").val(); 
  datos = {detalle: detalle, prioridad: prioridad, autor: autor};
  coleccionInformes.add(datos)
  .then(function (documento) {
    app.preloader.hide();
    app.dialog.alert("Informe creado exitosamente");
    mainView.router.navigate("/entrenador/");
  })
  .catch( function (error) {
    app.preloader.hide();
    console.log("Error " + error);
  });
}