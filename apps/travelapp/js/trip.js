var pengine;
var resultID = 0;
var username = sessionStorage.getItem("username");
var listName = sessionStorage.getItem("listName");
var activityList = [];
var query = "";
var query2 = "";
var done = false;
let idCounter = 0;

window.onload = function() {
    document.getElementById("trips").getElementsByTagName("h2")[0].innerHTML = listName;
    $("#signOut").on("click", signOut);
    showNavItems();
    query = "trip_activity('" + username + "','" + listName + "', City, Activity), get_activity_type(Activity, Type, City, Image, Review, Price)";
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
                done = true;
            }
        },
        onfailure: function() {
            console.log("Failure")
            done = true;
        },
        onerror: function() {
            console.log("Error: " + this.data);
        },
        ondestroy: function(){
            console.log("Pengine destroyed!");
            pengine = null;
        }
    });
    done = true;
}

function writeln(string) {
    $('#test').append(string + "<br />");
}

function showResults(y){
    activityList.push(y);
    var trips = document.getElementById("trips");

    var mainDiv = document.createElement("div");
    mainDiv.classList.add("result");
    mainDiv.id = resultID;
    
    var h4 = document.createElement("h4");
    var h5 = document.createElement("h5");

    var div = document.createElement("div");
    div.classList.add("imgbox");
    div.style.backgroundImage = "url('"+ y[0].Image +"')";

    var name = document.createTextNode(y[0].Activity);
    var city = document.createTextNode(y[0].City);

    var button = document.createElement("button");
    button.innerHTML = "<img src='./assets/images/delete.svg'></img>";
    button.onclick = deleteActivity;

    var h5_1 = document.createElement("h5");
    var type = document.createTextNode(y[0].Type);
    h5_1.appendChild(type);
        
    var reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");
    showStarReview(reviewDiv, y[0].Review.args[0].args[1]);

    var priceDiv = document.createElement("div");
    priceDiv.classList.add("price");
    showPrice(priceDiv, y[0].Price.args[0].args[1], y[0].Type);

    div.appendChild(h5);
    div.appendChild(reviewDiv);
    div.appendChild(priceDiv);

    h4.appendChild(name);
    h5.appendChild(city);
    trips.appendChild(mainDiv);
    mainDiv.appendChild(div);
    mainDiv.appendChild(h4);
    mainDiv.appendChild(h5);
    mainDiv.appendChild(h5_1);
    mainDiv.appendChild(reviewDiv);
    mainDiv.appendChild(priceDiv);
    div.appendChild(button);
    resultID++;
}

function getInfo(){
    if(done){
        for(let i in activityList){
            activityName = activityList[i][0].Activity;
            city = activityList[i][0].City;
            console.log(activityName + " " + city);
            query2 = "get_activity_type('"+ activityName +"', Type, '" + city +"', Image, Review, Price)";
            ask(query2);
        }
    }
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
        console.log("Hello")
    } else {
        navList[1].style.display = "none";
        navList[2].style.display = "none";
        navList[3].style.display = "inline";
        navList[4].style.display = "inline";
    }
}

function deleteActivity(){
    var id = $(this).parent().parent().attr('id');
    var div = document.getElementById(id);
    var name = div.querySelectorAll("h4")[0].innerHTML;
    var city = div.querySelectorAll("h5")[0].innerHTML;
    var query = "remove_activity('" + username + "', '" + listName + "', '" + city + "', '" + name + "')";
    askQ(query);
    window.location.reload();
}

function showStarReview(reviewDiv, review){
    review = Math.round(review);
    for(let i=0; i<review; i++){
        var img = document.createElement("img");
        img.src = "./assets/images/star_1.svg";
        img.height = 16;
        img.width = 16;
        reviewDiv.appendChild(img);
    }
}

function showPrice(priceDiv, price, activityType){
    let j;
    if(((activityType == "Hotel" || activityType == "Hostel") && price > 0 && price <= 500) || price == -1 || 
    (price > 0 && price <= 200))
        j = 1;
    else if (((activityType == "Hotel" || activityType == "Hostel") && price > 500 && price <= 1000) || price == -2 ||
    (price > 200 && price <= 500))
        j = 2;
    else if (((activityType == "Hotel" || activityType == "Hostel") && price > 1000) || price == -3 || price > 500)
        j = 3;
    else if (price == 0)
        j = 0;

    if(j > 0){
        for(let i=0; i<j; i++){
            var img = document.createElement("img");
            img.src = "./assets/images/price_1.svg";
            img.height = 16;
            img.width = 16;
            priceDiv.appendChild(img);
        }
    } else {
        var p = document.createElement("p");
        p.classList.add("free");
        var txt = document.createTextNode("FREE");
        p.appendChild(txt);
        priceDiv.appendChild(p);
    }
}


function addInfo(y){
    console.log(y);
    var div = document.getElementById(idCounter);
    if(div){
        var imgbox = div.getElementsByClassName("imgbox")[0];
        imgbox.style.backgroundImage = "url('"+ y[0].Image +"')";
            
        var h5 = document.createElement("h5");
        var type = document.createTextNode(y[0].Type);
        h5.appendChild(type);
        
        var reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review");
        showStarReview(reviewDiv, y[0].Review.args[0].args[1]);

        var priceDiv = document.createElement("div");
        priceDiv.classList.add("price");
        showPrice(priceDiv, y[0].Price.args[0].args[1], y[0].Type);

        div.appendChild(h5);
        div.appendChild(reviewDiv);
        div.appendChild(priceDiv);
    }
    idCounter++;
}