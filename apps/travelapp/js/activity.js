var pengine;
var jsonList = [];
var activityName = localStorage.getItem("activityName");
var activityType = localStorage.getItem("activityType");
var city = localStorage.getItem("city");
var image = localStorage.getItem("image");

var query = "";
var query2 = "";
var description;
var review;
var price;
var address;
var phone;
var website;

var username = sessionStorage.getItem("username");

var addListPopup = document.getElementsByClassName("popup")[0];
var addTripPopup = document.getElementsByClassName("popup")[1];

var listCount = 0;
var adding = false;

window.onload = function() {
    getLists();
    $("#signOut").on("click", signOut);
    showNavItems();
    document.getElementById("activityName").innerHTML = activityName;
    document.getElementById("location-type").innerHTML = city + " - " + activityType;
    document.getElementById("activityImg").src = image;
    document.getElementById("descInfo").style.display = "block";
    if(activityType == "Restaurant" || activityType == "Bar"){
        query = "get_bar_restaurant_info('" + activityName + "', Review, Price, Address, Phone, Website)";
        query2 = "get_bar_restaurant_services('" + activityName + "', Service)";
        document.getElementById("descInfo").style.display = "none";
        ask(query);    
        ask(query2);
    } else {
        query = "get_activity_info('" + activityName + "', Description, Review, Price, Address, Phone, Website)";
        ask(query);
        document.getElementById("service").style.display = "none";
    }

    $("#addList").on("click", addList);
    $("#addActivity").on("click", addToTrip);
    $("#cancel").on("click", closePopup);
    $("#cancel2").on("click", closePopup2);

    var button = document.getElementById("addBtn")
    button.onclick = function(){
        if(sessionStorage.getItem("username") != null && listCount != 0){
            openAddTripPopup();
        } else if (sessionStorage.getItem("username") != null && listCount == 0){
            openAddListPopup();
        } else if (sessionStorage.getItem("username") == null ){
            window.open("./login.html","_self");
        }
    };
};

function ask(query){
    pengine = new Pengine({
        application: 'travelapp',
        ask: query,
        destroy: false,
        onsuccess: function() {
            //jsonString = JSON.stringify(this.data);
            //writeln(jsonString);
            if(!adding && (query.startsWith("get_bar_restaurant_info") || query.startsWith("get_activity_info"))){
                showResults(this.data);
            }
            if(!adding && query.startsWith("get_bar_restaurant_services")){
                showServiceResults2(this.data);
            }
            if (this.more) {
                pengine.next();
            } else {
                console.log("No more solutions");
                adding = false;
            }
            
        },
        onfailure: function() {
            console.log("Failure")
            //onFailure();
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


function showResults(y){
    review = y[0].Review.args[0].args[1];
    price = y[0].Price.args[0].args[1];
    address = y[0].Address.args[0].args[1];
    phone = y[0].Phone.args[0].args[1];
    website = y[0].Website.args[0].args[1];
    if(y[0].Description != null)
        description = y[0].Description.args[0].args[1];
    
    var reviewDiv = document.getElementById("review");
    var priceDiv = document.getElementById("price");

    document.getElementById("description").innerHTML = description;

    reviewDiv.innerHTML = "<h4>Review:</h4>";
    showStarReview(reviewDiv, review);
    reviewDiv.innerHTML += "<p class='review'>" + review + "</p>";

    priceDiv.innerHTML = "<h4>Price:</h4>";
    showPrice(priceDiv, price, activityType);
    if(price != 0)
        priceDiv.innerHTML += "<p>From <span>" + price + "</span> kn</p>";

    document.getElementById("address").innerHTML = address;
    document.getElementById("phone").innerHTML = phone;
    document.getElementById("website").innerHTML = "<a href='"+ website+ "'>Visit Website</a>";

    if(phone == "-")
        document.getElementsByClassName("info")[1].style.display = "none";
    if(address == "-")
        document.getElementsByClassName("info")[0].style.display = "none";
    if(website == "-")
        document.getElementsByClassName("info")[2].style.display = "none";
    if (phone == "-" && address == "-" && website == "-"){
        var x = document.getElementById("info");
        var p = document.createElement("p");
        var element = document.createTextNode("No available info");
        x.appendChild(p);
        p.appendChild(element);
    }
}

function showServiceResults2(y){
    var div = document.getElementById("services");
    var li = document.createElement("li");
    var element = document.createTextNode(y[0].Service);
    li.appendChild(element);
    div.appendChild(li);
}

function writeln(string) {
    $('#results').append(string + "<br />");
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

function closePopup(){
    addListPopup.style.display = "none";
    clicked = false;
}

function closePopup2(){
    addTripPopup.style.display = "none";
    clicked = false;
}

function addList(){
    var name = $("#listName").val();
    var query = "add_list('"+ username + "', '" + name + "')";
    ask(query);
    closePopup();
    //window.location.reload()
}

function openAddListPopup(){
    clicked = true;
    addListPopup.style.display = "block";
}

function openAddTripPopup(){
    clicked = true;
    addTripPopup.style.display = "block";
    
}

function getLists(){
    var query = "user_list('" + username + "', ListName)";
    pengine = new Pengine({
        application: 'travelapp',
        ask: query,
        destroy: false,
        onsuccess: function() {
            //jsonString = JSON.stringify(this.data);
            //writeln(jsonString);
            populateSelect(this.data);
            listCount++;
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

function populateSelect(y){
    var select = document.getElementById("tripList");
    var option = document.createElement("option")
    option.textContent = y[0].ListName;
    option.value = y[0].ListName;
    select.appendChild(option);
    tripName = sessionStorage.setItem("tripName", y[0].ListName);
}

function addToTrip(){
    adding = true;
    var e = document.getElementById("tripList");
    var listName = e.value;
    var query = "add_activity('" + username + "', '" + listName + "', '" + city + "', '" + activityName + "')";
    ask(query);
    addTripPopup.style.display = "none";
}