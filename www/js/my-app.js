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
  // fechaNacimiento = $$("#fechaNcimientoRegistro").val();
  tipoUsuario = $$("#tipoUsuarioRegistro").val();

  datos = {nombre: nombre, apellido: apellido, telefono: telefono, rol: tipoUsuario};
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
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.error(errorCode);
    console.error(errorMessage);
  });
  }
}
