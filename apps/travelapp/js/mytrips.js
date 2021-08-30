var pengine;
var addListPopup = document.getElementsByClassName("popup")[0];

var username = sessionStorage.getItem("username");
var newListName = "";
var query = "";
var adding = false;
var listName;

var resultID = 0;

var colors = ["#feb55b","#febc6b","#fec47c","#fecb8c","#fed39d","#ffdaad","#ffe1bd","#ffe9ce","#57cae9","#68cfeb","#79d5ed","#89daf0","#9adff2","#abe5f4","#bceaf6","#bceaf6","#cdeff8"];

window.onload = function() {
    $("#signOut").on("click", signOut);
    showNavItems();
    $("#cancel").on("click", closePopup);
    $("#addList").on("click", addList);
    query = "user_list('" + username + "',ListName)";
    askQ(query);
};

function askQ(query){
    pengine = new Pengine({
        application: 'travelapp',
        ask: query,
        destroy: false,
        onsuccess: function() {
            //jsonString = JSON.stringify(this.data);
            //writeln(jsonString);
            showResults(this.data);
            if (this.more) {
                pengine.next();
            } else {
                console.log("No more solutions");   
            }
        },
        onfailure: function() {
            console.log("Failure")
        },
        onerror: function() {
            console.log("Error: " + this.data);
        },
        ondestroy: function(){
            console.log("Pengine destroyed!");
            pengine = null;
        }
    });
}

function showResults(y){
    var trips = document.getElementById("trips");

    var mainDiv = document.createElement("div");
    mainDiv.classList.add("result");
    mainDiv.id = resultID;
    
    var h4 = document.createElement("h4");

    var div = document.createElement("div");
    div.classList.add("imgbox");
    var color = colors[Math.floor(Math.random()*colors.length)];
    div.style.backgroundColor = color;
    var name = document.createTextNode(y[0].ListName);

    mainDiv.onclick = function(){
        listName = sessionStorage.setItem("listName", y[0].ListName);
        window.open("mytrip.html?name=" + y[0].ListName, "_self");
    }

    var button = document.createElement("button");
    button.innerHTML = "<img src='./assets/images/delete.svg'></img>";
    button.onclick = deleteList;
    
    h4.appendChild(name);
    trips.appendChild(mainDiv);
    mainDiv.appendChild(div);
    mainDiv.appendChild(h4);
    div.appendChild(button);
    resultID++;
}

function writeln(string) {
    $('#test').append(string + "<br />");
}

function signOut(){
    if(sessionStorage.getItem("username")!= null){
        sessionStorage.removeItem("username");
    }
    showNavItems();
}

function showNavItems(){
    var nav = document.getElementsByTagName("nav")[0];
    var navList = nav.getElementsByTagName("a");
    if(sessionStorage.getItem("username") == null){
        navList[1].style.display = "inline";
        navList[2].style.display = "inline";
        navList[3].style.display = "none";
        navList[4].style.display = "none";
    } else {
        navList[1].style.display = "none";
        navList[2].style.display = "none";
        navList[3].style.display = "inline";
        navList[4].style.display = "inline";
    }
}

function openPopupAddList(){
    addListPopup.style.display = "block";
    adding = true;
}

function closePopup(){
    addListPopup.style.display = "none";
    adding = false;
}

function addList(){
    var name = $("#listName").val();
    var query = "add_list('"+ username + "', '" + name + "')";
    askQ(query);
    closePopup();
    window.location.reload()
}

function deleteList(){
    var id = $(this).parent().parent().attr('id');
    var div = document.getElementById(id);
    var name = div.querySelectorAll("h4")[0].innerHTML;
    var query = "remove_list('" + username + "', '" + name + "')";
    askQ(query);
    window.location.reload();
}

window.onclick = function(event) {
    if (event.target == addListPopup) {
      addListPopup.style.display = "none";
      adding = false;
    }
}
