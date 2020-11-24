function startRoster(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var profileInfo = JSON.parse(this.responseText);
      if(profileInfo.length!==0){
              document.getElementById("profile-element").style.display='block';
              document.getElementById("logout-element").style.display='block';
              document.getElementById("register-element").style.display='none';
              document.getElementById("login-element").style.display='none';
          }
        }
    };
    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var profileInfo = JSON.parse(this.responseText);
          var fullname=profileInfo[0].fullname;
          var id=profileInfo[0].id;
          var email=profileInfo[0].email;
          document.getElementById('logged-name').innerHTML=fullname;
          document.getElementById('logged-email').innerHTML=email;
          document.getElementById('logged-id').innerHTML=id;
          document.getElementById('warning-login').style.display='none';
        }
    };
    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
//startup
    addButton();
    showTasks();
    checkLeaves();

}


function showTasks(){
    document.getElementById("refresh-icon").className += " fa-spin";
        $(document).ready(function() {
      setTimeout(function() {
        document.getElementById("refresh-icon").classList.remove("fa-spin");
      }, 2000);
    });
    loadRemover();
    clearUsers();
    loadUsers();
    infoCards();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var tasks = JSON.parse(this.responseText);
            $( 'tr.xtasks' ).remove();

            for (var i=0; i<tasks.length; i++) {
                var id=tasks[i].id;
                var name = tasks[i].name;
                var description = tasks[i].description;
                var uid = tasks[i].userid;
                var uname=tasks[i].fullname;
                var dateData = tasks[i].days;
                var complete = tasks[i].complete;
                var category = tasks[i].category;
                var dateObject = new Date(Date.parse(dateData));
                var days = dateObject.toDateString();
                if(category==1){
                    category="Vegetation";
                }else if(category==2){
                    category="Livestock";
                }else if(category==3){
                    category="Office";
                }
                tr = $('<tr class="xtasks table-danger"></tr>');
                var my_tr = $('<tr class="xtasks"></tr>');
                if(tasks[i].complete==1){
                    var tr = $('<tr class="xtasks table-success"></tr>');
                    complete='Complete';
                }else{
                    complete='Not Complete';
                }
                var td = $('<td></td>').text(name);
                var my_td = $('<td></td>').text(name);
                tr.append(td.text(id));
                tr.append(td.clone().text(name));
                tr.append(td.clone().text(description));
                tr.append(td.clone().text("("+uid+ ") " + uname));
                tr.append(td.clone().text(days));
                tr.append(td.clone().text(category));
                tr.append(td.clone().text(complete));
                var loggedID=document.getElementById("logged-id").innerText;
                if(loggedID==uid && tasks[i].complete==0){
                    my_tr.append(my_td.text(name));
                    my_tr.append(my_td.clone().text(description));
                    my_tr.append(my_td.clone().text(days));
                    my_tr.append(my_td.clone().text(category));
                }
                $( '#tasks tbody' ).append(tr);
                $( '#myTasks tbody' ).append(my_tr);
            }
        }
    };
    xhttp.open("GET", "/tasks1.json", true);
    xhttp.send();
}



function newTask(){
    newTaskEmail();
    var xhttp = new XMLHttpRequest();
    var newTask = { name:$( '#name' ).val(),
                     description: $( '#description'  ).val(),
                     users:$('#usersel').val(),
                     days:$('#daysel').val(),
                     category:$('#categories').val()
    };
    xhttp.open("POST", "/newTask", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newTask));
    showTasks();
    resetFields();
}

function refreshPage(){
    window.location.reload();
}


function loadRemover(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var tasks = JSON.parse(this.responseText);
            var rtasks = document.getElementById("rtasks");
            var ctasks =document.getElementById("ctasks");
            rtasks.innerHTML = '';
            ctasks.innerHTML = '';
            var lengthTasks=0;
            for (var i=0; i<tasks.length; i++) {
                lengthTasks++;
                var option = document.createElement("option");
                option.text = "(" +tasks[i].id+ ") " +tasks[i].name;
                option.value = tasks[i].id;
                rtasks.add(option);
            }
            for (i=0; i<tasks.length; i++) {
                option = document.createElement("option");
                option.text = "(" +tasks[i].id+ ") " +tasks[i].name;
                option.value = tasks[i].id;
                ctasks.add(option);
            }
            document.getElementById("rtasks").size=lengthTasks;
            document.getElementById("ctasks").size=lengthTasks;
        }
    };
    xhttp.open("GET", "/tasks1.json", true);
    xhttp.send();

}

function removeTask(){
    var xhttp = new XMLHttpRequest();
    var removeTask = { id:$( '#rtasks' ).val()
    };
    xhttp.open("POST", "/removeTask", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(removeTask));
    showTasks();
}

function infoCards(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var userid = document.getElementById("logged-id").innerText;
            var tasks = JSON.parse(this.responseText);
            var available = document.getElementById("availableTasks");
            var completeText = document.getElementById("comtext");
            var incompText = document.getElementById("inctext");
            var incomplete=0;
            var complete=0;
            for(var i=0;i<tasks.length;i++){
                if(tasks[i].complete===1){
                    complete++;
                }else if(tasks[i].complete===0){
                    incomplete++;
                }
            }
            available.innerHTML = tasks.length;
            incompText.innerHTML = incomplete;
            completeText.innerHTML = complete;
            var mytasks=0;
            for(i=0;i<tasks.length;i++){
                if(tasks[i].userid==userid && tasks[i].complete==0){
                    mytasks++;
                }
            }
            document.getElementById("task-count").innerHTML=mytasks;
        }
    };
    xhttp.open("GET", "/tasks1.json", true);
    xhttp.send();
}

function loadUsers(){
    document.getElementById("usersel").options.length=0;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var userList = JSON.parse(this.responseText);
            var categories = $('#categories').val();
            var selection = document.getElementById("usersel");
            for(var i=0;i<userList.length;i++){
            if(categories=="1"){
                var option = document.createElement("option");
                if(userList[i].vegetable==1){
                    option.text = "("+userList[i].id+") "+userList[i].fullname;
                    option.value = userList[i].id;
                    selection.add(option);
                }
            }else if(categories =="2"){
                var option1 = document.createElement("option");
                if(userList[i].livestock==1){
                    option1.text = "("+userList[i].id+") "+userList[i].fullname;
                    option1.value = userList[i].id;
                    selection.add(option1);

                }

            }else if(categories=="3"){
                var option2 = document.createElement("option");
                if(userList[i].office==1){
                    option2.text = "("+userList[i].id+") "+userList[i].fullname;
                    option2.value = userList[i].id;
                    selection.add(option2);
                    }
                }

            }

        }
    };

    xhttp.open("GET", "/users.json", true);
    xhttp.send();
}

function completeTask(){
    var xhttp = new XMLHttpRequest();
    var completeTask = { id:$( '#ctasks' ).val()
    };
    xhttp.open("POST", "/completeTask", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(completeTask));
    showTasks();
}

function uncompleteTask(){
    var xhttp = new XMLHttpRequest();
    var uncompleteTask = { id:$( '#ctasks' ).val()
    };
    xhttp.open("POST", "/uncompleteTask", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(uncompleteTask));
    showTasks();

}

function clearTasks(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/clearTasks", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    showTasks();
}

function resetFields(){
    $('form').get(0).reset();
}

function addButton(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var profileInfo = JSON.parse(this.responseText);
          var manager=profileInfo[0].manager;
          if(manager==1){
              document.getElementById("trhide").disabled=false;
              document.getElementById("disabled-tbtn").removeAttribute("data-original-title");
              document.getElementById("rm-tab").classList.remove("disabled");
              document.getElementById("add-tab").classList.remove("disabled");
              document.getElementById("blockadd").style.display='none';
          }
        }
    };

    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
}

function checkLeaves(){
    $("#daysel").flatpickr({
                        minDate: "today",
                        altInput:true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                    });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // users = document.getElementsByClassName("usersel").value;
            var users = $('#usersel').val();
            var leavesList = JSON.parse(this.responseText);
            var dates = [];
            for (var i=0; i<leavesList.length; i++) {
                if (users == leavesList[i].userid){
                    dates[i]=leavesList[i].leave_date;
                }
                    $("#daysel").flatpickr({
                        disable: dates,
                        minDate: "today",
                        altInput:true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                    });
            }
        }
    };

    xhttp.open("GET", "/allLeaves.json", true);
    xhttp.send();
}

function clearUsers(){
    var selection=document.getElementById("usersel");
    var length = selection.options.length;
        for (var i = length-1; i >= 0; i--) {
          selection.options[i] = null;
        }
}


function newTaskEmail(){
    var uval=document.getElementById("usersel").value;
    var tname=$( '#name' ).val();
    var uday=$( '#daysel' ).val();
    var descr=$( '#description' ).val();
    var cat=$('#categories').val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var loggedmail="";
            var usersList = JSON.parse(this.responseText);
            for(var i=0;i<usersList.length;i++){
                if(usersList[i].id==uval){
                    loggedmail=usersList[i].email;
                    TaskEmail(loggedmail,uday,descr,cat,tname);
                }
            }
        }
    };
    xhttp.open("GET", "/users.json", true);
    xhttp.send();
}

function TaskEmail(x,y,z,cat,tname){
    var xhttp = new XMLHttpRequest();
    var taskemail = { tname:tname,
    to:x,
    due:y,
    desc:z,
    category:cat
    };
    xhttp.open("POST", "/taskemail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(taskemail));
}

