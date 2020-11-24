
function register(){
    var xhttp = new XMLHttpRequest();
    var manager = document.getElementById("isManager").checked;

    xhttp.onreadystatechange = function() {
    if (this.readyState == 2 && this.status == 200) {
            document.getElementById("ealert").style.display="block";
            document.getElementById("ealert").classList.remove('alert-danger');
            document.getElementById("ealert").classList.add('alert-success');
            document.getElementById("ealert").innerHTML = "<h3>Register Successful</h3>";
            location.reload();
        } else if (this.readyState == 2 && this.status >= 400) {
            document.getElementById("ealert").style.display="block";
            $( '#errors' ).text("Your request could not be processed. Please check all fields.");

        }
    };

    var newAccount= { name:$( '#fullname' ).val(),
                     email: $( '#email'  ).val(),
                     password:$('#password').val(),
                     cpassword:$('#cpassword').val(),
                     isManager:manager

    };

    xhttp.open("POST", "/emailReg", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newAccount));


}




function login(){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 2 && this.status == 200) {
            document.getElementById("lealert").style.display="block";
            document.getElementById("lealert").classList.remove('alert-danger');
            document.getElementById("lealert").classList.add('alert-success');
            document.getElementById("lealert").innerHTML = "<h3>Login Successful...</h3>";
            location.reload();
        } else if (this.readyState == 2 && this.status >= 400) {
            document.getElementById("lealert").style.display="block";
            $( '#lerrors' ).text("Incorrect email/password");

        }
    };

    var credentials = { email:$( '#lemail' ).val(),
                        password:$( '#lpassword' ).val()  };
    xhttp.open("POST", "/emailLog", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(credentials));
    resetFields();

}



function logout(){
    signOut();

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 2 && this.status == 200) {
            location.reload();

        }
    };

    xhttp.open("POST", "/logout", true);
    xhttp.send();

    resetFields();

}

function resetFields(){
    $('form').get(0).reset();
}

function onSignIn(googleUser) {

  var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        $('#loginModal').modal('hide');
       startRoster();
    }
  };
    xhr.open('POST', '/gLog');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'idtoken':id_token}));

}

function onRegister(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200 || this.status==302 ) {
        $('#registerModal').modal('hide');
       startRoster();
       onSignIn(googleUser);
    }
  };
    xhr.open('POST', '/gReg');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'idtoken':id_token}));

}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        location.reload();
    });
}