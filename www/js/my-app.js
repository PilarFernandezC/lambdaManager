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
      {path: '/login/', url: 'login.html'},
      {path: '/index/', url: 'index.html'},
      {path: '/registro/', url: 'registro.html'},
      {path: '/coordinador/', url: 'coordinador.html'},
      {path: '/alumno/', url: 'alumno.html'},
      {path: '/entrenador/', url: 'entrenador.html'},
      {path: '/coordinador/altaAlumno', url: 'altaAlumno.html'},
      {path: '/coordinador/altaEntrenador', url: 'altaEntrenador.html'},
      {path: '/coordinador/altaClase', url: 'altaClase.html'},
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var email, contrasena, nombre, apellido, telefono, fechaNacimiento, tipoUsuario, dias;
var coleccionUsuarios = db.collection("Usuarios");
var coleccionClases = db.collection("clases");

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
  $$("#btnRegistro").on("click", funcionRegistro);
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$("#btnFinalizarRegistro").on("click", funcionFinRegistro);
})

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$("#btnLogin").on("click", funcionLogin);
})

$$(document).on('page:init', '.page[data-name="coordinador"]', function (e) {
  mostrarAlumnos();
  mostrarEntrenadores();
  mostrarClases();
  $$("#btnAltaAlumno").on("click", function() {
    mainView.router.navigate("/coordinador/altaAlumno")
  });
  $$("#btnAltaEntrenador").on("click", function() {
    mainView.router.navigate("/coordinador/altaEntrenador")
  });
  $$("#btnAltaClase").on("click", function() {
    mainView.router.navigate("/coordinador/altaClase")
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

$$(document).on('page:init', '.page[data-name="alumno"]', function (e) {
  
})

$$(document).on('page:init', '.page[data-name="entrenador"]', function (e) {
  
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
      console.error(errorCode);
      console.error(errorMessage);
      if (errorCode == "auth/email-already-in-use") {
        console.error("El email ya se encuentra registrado");
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
    mainView.router.navigate("/login/");
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

      console.error(errorCode);
      console.error(errorMessage);
    });
  }
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
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      apellido = doc.data().apellido;
      cuerpo += `<tr>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell">${apellido}</td>
      <td class="label-cell"><button onclick="editarAlumno('${doc.id}')" class="button button-raised button-fill">E</button>
      <button onclick="borrarAlumno('${doc.id}')" class="button button-raised button-fill">B</button></td>
      </tr>`
    });
    $$("#alumnosCoordinador").html(inicio + cuerpo + fin);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function borrarAlumno(id) {
  app.dialog.confirm("¿Desea eliminar el alumno?", function () {
    confirmarBorrarAlumno(id);
  });
}

function confirmarBorrarAlumno (id) {
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
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      apellido = doc.data().apellido;
      cuerpo += `<tr>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell">${apellido}</td>
      <td class="label-cell"><button onclick="editarEntrenador('${doc.id}')" class="button button-raised button-fill">E</button>
      <button onclick="borrarEntrenador('${doc.id}')" class="button button-raised button-fill">B</button></td>
      </tr>`
    });
    $$("#entrenadoresCoordinador").html(inicio + cuerpo + fin);
  })
  .catch(function(error) {
    console.log("Error: " , error);
  });
}

function borrarEntrenador(id) {
  app.dialog.confirm("¿Desea eliminar el entrenador?", function () {
    confirmarBorrarEntrenador(id);
  });
}

function confirmarBorrarEntrenador (id) {
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
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      codigo = doc.id;
      cuerpo += `<tr>
      <td class="label-cell">${codigo}</td>
      <td class="label-cell">${nombre}</td>
      <td class="label-cell"><button onclick="editarClase('${doc.id}')" class="button button-raised button-fill">E</button>
      <button onclick="borrarClase('${doc.id}')" class="button button-raised button-fill">B</button></td>
      </tr>`
    });
    $$("#clasesCoordinador").html(inicio + cuerpo + fin);
  })
  .catch(function(error) {
    console.log("Error: " , error);
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
      console.error(errorCode);
      console.error(errorMessage);
      if (errorCode == "auth/email-already-in-use") {
        console.error("El email ya se encuentra registrado");
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
      console.error(errorCode);
      console.error(errorMessage);
      if (errorCode == "auth/email-already-in-use") {
        console.error("El email ya se encuentra registrado");
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