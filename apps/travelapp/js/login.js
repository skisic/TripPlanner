var pengine;
var jsonList = [];
var username = "";
var password = "";

$(document).ready(function() {
    $("#signin").on("click", signIn);
});

function signIn(){
    document.getElementById("login_message").innerHTML = "";
    username = $("#username").val();
    password = $("#password").val();
    query = "login('" + username + "', '" + password + "')."
    askQ(query); 
}

function askQ(query){
    pengine = new Pengine({
        application: 'travelapp',
        ask: query,
        destroy: false,
        onsuccess: function() {
            jsonString = JSON.stringify(this.data);
            jsonList.push(this.data);
            //writeln(jsonString);
            if (this.more) {
                pengine.next();
            } else {
                console.log("No more solutions");   
            }
            success();
            jsonList = [];
        },
        onfailure: function() {
            console.log("Failure");
            fail();
        },
        onerror: function() {
            console.log("Error: " + this.data);
        },
        ondestroy: function(){
            console.log("Pengine destroyed!");
            pengine = null;
            jsonList=[];
        }
    });
}

function writeln(string) {
    $('#results').append(string + "<br />");
}

function success(){
    window.location.replace("index.html");
    sessionStorage.setItem('username', username);
}

function fail(){
    document.getElementById("login_message").innerHTML = "Username or password is incorrect!"
}