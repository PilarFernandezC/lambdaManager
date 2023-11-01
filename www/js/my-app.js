// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
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
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var email, contrasena, nombre, apellido, telefono, fechaNacimiento, tipoUsuario;
var coleccionUsuarios = db.collection("Usuarios");

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
  $$("#btnAltaAlumno").on("click", funcionDirigirseAlumno);
  $$("#btnAltaEntrenador").on("click", funcionDirigirseEntrenador);
})

$$(document).on('page:init', '.page[data-name="altaAlumno"]', function (e) {
  $$("#btnFinalizarAltaAlumno").on("click", funcionCrearAlumno);
})

$$(document).on('page:init', '.page[data-name="altaEntrenador"]', function (e) {
  $$("#btnFinalizarAltaEntrenador").on("click", funcionCrearEntrenador);
})

$$(document).on('page:init', '.page[data-name="alumno"]', function (e) {
  
})

$$(document).on('page:init', '.page[data-name="entrenador"]', function (e) {
  
})

$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    alert('Hello');
})




// FUNCIONES
function funcionRegistro () {
  email = $$("#emailIndex").val();
  contrasena = $$("#contrasenaIndex").val();

  if (email != "" && contrasena != "") {
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Bienvenid@!!! " + email);
      // ...
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
        // ..
    });
  }
}

function funcionFinRegistro () {
  nombre = $$("#nombreRegistro").val();
  apellido = $$("#apellidoRegistro").val();
  telefono = $$("#telefonoRegistro").val();
  fechaNacimiento = $$("#fechaNacimientoRegistro").val();
  tipoUsuario = $$("#tipoUsuarioRegistro").val();

  datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario};
  idUsuario = email;

  coleccionUsuarios.doc(idUsuario).set(datos)
  .then(function (documento) {
    alert("Registración exitosa");
    mainView.router.navigate("/login/");
  })
  .catch( function (error) {
    console.log("Error " + error);
  })
}

function funcionLogin () {
  email = $$("#emailLogin").val();
  contrasena = $$("#contrasenaLogin").val();

  if (email != "" && contrasena != "") {
    firebase.auth().signInWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log("Bienvenid@!!! " + email);
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
  query.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      apellido = doc.data().apellido;
      $$("#alumnosCoordinador").append("<p>" + nombre + " " + apellido + "<p>");
    })
  })
  .catch(function(error) {
    console.log("Error: " , error);
  })
}

function mostrarEntrenadores () {
  var query = coleccionUsuarios.where("rol", "==", "Entrenador");
  query.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      nombre = doc.data().nombre;
      apellido = doc.data().apellido;
      $$("#entrenadoresCoordinador").append("<p>" + nombre + " " + apellido + "<p>");
    })
  })
  .catch(function(error) {
    console.log("Error: " , error);
  })
}

function funcionDirigirseAlumno () {
  mainView.router.navigate("/coordinador/altaAlumno");
}

function funcionDirigirseEntrenador () {
  mainView.router.navigate("/coordinador/altaEntrenador");

}

function funcionCrearAlumno () {
  email = $$("#emailAltaAlumno").val();
  contrasena = $$("#contrasenaAltaAlumno").val();

  if (email != "" && contrasena != "") {
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      nombre = $$("#nombreAltaAlumno").val();
      apellido = $$("#apellidoAltaAlumno").val();
      telefono = $$("#telefonoAltaAlumno").val();
      fechaNacimiento = $$("#fechaNacimientoAltaAlumno").val();
      tipoUsuario = "Alumno";

      datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario};
      idUsuario = email;

      coleccionUsuarios.doc(idUsuario).set(datos)
      .then(function (documento) {
        alert("Alta de alumno exitosa");
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
        // ..
    });
  }
}

function funcionCrearEntrenador () {
  email = $$("#emailAltaEntrenador").val();
  contrasena = $$("#contrasenaAltaEntrenador").val();

  if (email != "" && contrasena != "") {
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      nombre = $$("#nombreAltaEntrenador").val();
      apellido = $$("#apellidoAltaEntrenador").val();
      telefono = $$("#telefonoAltaEntrenador").val();
      fechaNacimiento = $$("#fechaNacimientoAltaEntrenador").val();
      tipoUsuario = "Entrenador";

      datos = {nombre: nombre, apellido: apellido, telefono: telefono, nacimiento: fechaNacimiento, rol: tipoUsuario};
      idUsuario = email;

      coleccionUsuarios.doc(idUsuario).set(datos)
      .then(function (documento) {
        alert("Alta de entrenador exitosa");
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
        // ..
    });
  }
}