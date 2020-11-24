
function startProfile(){
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
          document.getElementById('logged-name').innerHTML=fullname;
        }
    };
    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
    //setup
    editType();
    calendarDate();
    loadProfile();
    loadLeaves();

}

function loadProfile(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var profileInfo = JSON.parse(this.responseText);
          var id=profileInfo[0].id;
          var manager=profileInfo[0].manager;
          var email=profileInfo[0].email;
          var fullname=profileInfo[0].fullname;
          var image=profileInfo[0].image;
          $('#avatar').prepend('<img class="img-thumbnail" width="300" height="300" src="'+image+'"></img>');
          var isMan="User";
          if(manager==1){
            isMan="Manager";
          }
          $('.dName strong:first-child').append(fullname);
          $('.dMail strong:first-child').append(email);
          $('.dMan strong:first-child').append(isMan);
          var tr = $('<tr class="profile table"></tr>');
          //changing the actual profile
          var td = $('<td></td>').text(name);
          tr.append(td.text(id));
          tr.append(td.clone().text(manager));
          tr.append(td.clone().text(email));
          tr.append(td.clone().text(fullname));
          tr.append(td.clone().text(image));
          $( '#profileTable tbody' ).append(tr);
        }
    };
    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
}




function editLoad(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var profileInfo = JSON.parse(this.responseText);
          //id,manager,email,fullname,image
          var email=profileInfo[0].email;
          var fullname=profileInfo[0].fullname;
          var isManager=profileInfo[0].manager;
          document.getElementById("change-name").value= fullname;
          document.getElementById("change-email").value= email;
          document.getElementById("changeManager").checked= isManager;
        }
    };

    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
}


function saveProfile(){
    var xhttp = new XMLHttpRequest();
    var manager=0;
    if ($('#changeManager').is(":checked"))
    {
        manager=1;
    }
    var save = { name:$( '#change-name' ).val(),
                     email:$('#change-email').val(),
                     isManager:manager

    };
    xhttp.open("POST", "/saveProfile", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(save));
    location.reload();
}


function addLeave(){
    var xhttp = new XMLHttpRequest();
    var date = { days:$( '#leavesel' ).val()
    };
    xhttp.open("POST", "/newLeave", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(date));
    location.reload();
}


function loadLeaves(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var profileInfo = JSON.parse(this.responseText);
          for(var i=0;i<profileInfo.length;i++){
              var node = document.createElement("li");
              node.className = "list-group-item";
              var nodetext;
              nodetext=document.createTextNode(profileInfo[i].leave_date);
              node.id=profileInfo[i].id;
              var span=document.createElement("span");
              var txt = document.createTextNode("\u00D7");
              span.className = "close";
              span.id=profileInfo[i].id;
              span.onclick = function() {
                removeLeaves(this.id);
                var over=this.parentNode;
                over.parentNode.removeChild(over);
                location.reload();
              };
              span.appendChild(txt);
              node.appendChild(nodetext);
              node.appendChild(span);
              document.getElementById('leave-points').appendChild(node);
          }
        }
    };
    xhttp.open("GET", "/leaves.json", true);
    xhttp.send();
}


function removeLeaves(id){
    var xhttp = new XMLHttpRequest();
    var removeLeaves = { id:id
    };
    xhttp.open("POST", "/removeLeaves", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(removeLeaves));
    calendarDate();

}



function calendarDate(){
            $("#leavesel").flatpickr({
                minDate: "today",
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var leaves = JSON.parse(this.responseText);
            var dates = [];
            for (var i=0; i<leaves.length; i++) {
                dates[i]=leaves[i].leave_date;
            }
            $("#leavesel").flatpickr({
                disable: dates,
                minDate: "today",
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });
        }
    };

    xhttp.open("GET", "/leaves.json", true);
    xhttp.send();
}



function editType(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var profileType = JSON.parse(this.responseText);
          var vegetable=profileType[0].vegetable;
          var livestock=profileType[0].livestock;
          var office=profileType[0].office;
          document.getElementById("checkV").checked= vegetable;
          document.getElementById("checkL").checked= livestock;
          document.getElementById("checkO").checked= office;
        }
    };
    xhttp.open("GET", "/profile.json", true);
    xhttp.send();
}



function saveType(){
    var xhttp = new XMLHttpRequest();
    var vege=0;
    if ($('#checkV').is(":checked"))
    {
        vege=1;
    }
    var liv=0;
    if ($('#checkL').is(":checked"))
    {
        liv=1;
    }
    var off=0;
    if ($('#checkO').is(":checked"))
    {
        off=1;
    }
    var save = { vegetable:vege,
    livestock:liv,
    office:off
    };

    xhttp.open("POST", "/saveType", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(save));

}