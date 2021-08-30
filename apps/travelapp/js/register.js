var pengine;
var jsonList = [];
var username = "";
var password = "";
var password2 = "";

$(document).ready(function() {
    $("#register").on("click", register);
    
});

function register(){
    document.getElementById("register_message").innerHTML = "";
    username = $("#username").val();
    password = $("#password").val();
    password2 = $("#password2").val();
    if(password == password2){
        query = "register_user('" + username + "', '" + password + "')."
        askQ(query); 
    } else {
        document.getElementById("register_message").innerHTML = "Passwords don't match!";
    }
}

function askQ(query){
    pengine = new Pengine({
        application: 'travelapp',
        ask: query,
        destroy: false,
        onsuccess: function() {
            jsonString = JSON.stringify(this.data);
            console.log(jsonString);
            if (this.more) {
                pengine.next();
            } else {  
                console.log("No more solutions");   
            }
            success();
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
        },
        onoutput: function(){
            $("#register_message").html(this.data);
        }
    });
}

function success(){
    //document.getElementById("register_message").innerHTML = "Registration successful!";
}

function writeln(string) {
    $('#results').append(string + "<br />");
}

function fail(){
    document.getElementById("register_message").innerHTML = "Username already exists!";
}