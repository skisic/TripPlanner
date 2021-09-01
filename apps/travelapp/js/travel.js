var pengine;
let accommodationCount = 0;
let barCount = 0;
let landmarkCount = 0;
let sportCount = 0;
let beachCount = 0;
let tourCount = 0;
var acc = document.getElementById("accommodation");
var bar = document.getElementById("bar_restaurant");
var landmark = document.getElementById("landmark_museum_other");
var sport = document.getElementById("sports_activities");
var beach = document.getElementById("beach");
var tour = document.getElementById("tour_cruise");
var addListPopup = document.getElementsByClassName("popup")[0];
var addTripPopup = document.getElementsByClassName("popup")[1];
var clicked = false;
var tripName;
var currentActivity = null;
var city = "";
var listCount = 0;

var username = sessionStorage.getItem("username");

document.getElementById("results").style.display = "none";
var resultNumber = 5;

function smoothScroll(){
        $('html,body').animate({
            scrollTop: $("#cityName").offset().top},
            'slow');
}

function search() {
    clearAll();
    city = $("#search").val();
    city = capitalizeFirstLetter(city);
    document.getElementById("cityName").innerHTML = city;
    localStorage.setItem("city",city);
    document.getElementById("results").style.display = "block";
    var query = "get_activity_type(Activity, Type, '" + city + "', Image, Review, Price)";
    ask(query);
    smoothScroll();
}

function ask(query){
    pengine = new Pengine({
        application: 'travelapp',
        ask: query,
        destroy: true,
        onsuccess: function() {
            //jsonString = JSON.stringify(this.data);
            //console.log(this.data);
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

function capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
function writeln(string) {
    $('#results').append(string + "<br />");
}

function countResults(y){
    y = y[0];
    if(y.Type == "Hotel" || y.Type == "Hostel"){
        accommodationCount++;
    } else if (y.Type == "Bar" || y.Type == "Restaurant"){
        barCount++;
    } else if (y.Type == "Landmark" || y.Type == "Museum"){
        landmarkCount++;
    } else if (y.Type == "Sport"){
        sportCount++;
    } else if (y.Type == "Beach"){
        beachCount++;
    } else if (y.Type == "Tour" || y.Type == "Cruise"){
        tourCount++;
    }
}

function hideEmptyCategory(){
    if(sportCount == 0)
        sport.style.display = "none";
    else
        sport.style.display = "block";
    if (beachCount == 0)
        beach.style.display = "none";
    else
        beach.style.display = "block";
    if (barCount == 0)
        bar.style.display = "none";
    else
        bar.style.display = "block";
    if (landmarkCount == 0)
        landmark.style.display = "none";
    else
        landmark.style.display = "block";
    if (accommodationCount == 0)
        acc.style.display = "none";
    else
        acc.style.display = "block";
    if (tourCount == 0)
        tour.style.display = "none";
    else
        tour.style.display = "block";
}

function showResults(y){
    countResults(y);
    groupResults(y);
    hideEmptyCategory();
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

function displayHotelResult(y){
    var mainDiv = document.createElement("div");
    mainDiv.classList.add("result");
    mainDiv.style.cursor = "pointer";
    var button = document.createElement("button");
    button.onclick = function(){
        if(sessionStorage.getItem("username") != null && listCount != 0){
            openAddTripPopup();
            currentActivity = y;
        } else if (sessionStorage.getItem("username") != null && listCount == 0){
            openAddListPopup();
            currentActivity = y;
        } else if (sessionStorage.getItem("username") == null ){
            window.open("./login.html","_self");
        }
        
    };

    mainDiv.onclick = function(){
        localStorage.setItem("activityName",y.Activity);
        localStorage.setItem("activityType",y.Type);
        localStorage.setItem("image",y.Image);
        if(!clicked)
            window.open("hotel.html?type=" + y.Type + "?activity="+y.Activity);
    }
    
    var h4 = document.createElement("h4");
    var h5 = document.createElement("h5");
    var div = document.createElement("div");
    
    div.classList.add("imgbox");
   
    div.style.backgroundImage = "url('"+ y.Image +"')";

    var element = document.createTextNode(y.Activity);
    var type = document.createTextNode(y.Type);

    h4.appendChild(element);
    h5.appendChild(type);
    acc.appendChild(mainDiv);

    
    var reviewDiv = document.createElement("div");
    reviewDiv.classList = "review";

    var priceDiv = document.createElement("div");
    priceDiv.classList = "price";

    mainDiv.appendChild(div); 
    div.appendChild(button);
    mainDiv.appendChild(h4); 
    mainDiv.appendChild(h5); 
    mainDiv.appendChild(reviewDiv);
    mainDiv.appendChild(priceDiv);
    
    showStarReview(reviewDiv, y.Review.args[0].args[1]);
    showPrice(priceDiv, y.Price.args[0].args[1], y.Type)
}

function displayOtherResult(y, divType){
    var mainDiv = document.createElement("div");
    mainDiv.classList.add("result");
    mainDiv.style.cursor = "pointer";
    var button = document.createElement("button");
    button.onclick = function(){
        if(sessionStorage.getItem("username") != null && listCount != 0){
            openAddTripPopup();
            currentActivity = y;

        } else if (sessionStorage.getItem("username") != null && listCount == 0){
            openAddListPopup();
            currentActivity = y;
        } else if (sessionStorage.getItem("username") == null ){
            window.open("./login.html","_self");
        }
    };

    mainDiv.onclick = function(){
        localStorage.setItem("activityName",y.Activity);
        localStorage.setItem("activityType",y.Type);
        localStorage.setItem("image",y.Image);
        if(!clicked)
            window.open("activity.html?type=" + y.Type + "?activity="+y.Activity);
    }
    var h4 = document.createElement("h4");
    var h5 = document.createElement("h5");
    var div = document.createElement("div");
    div.classList.add("imgbox");
    div.style.backgroundImage = "url('"+ y.Image +"')";
    var element = document.createTextNode(y.Activity);
    var type = document.createTextNode(y.Type);

    h4.appendChild(element);
    h5.appendChild(type);

    var reviewDiv = document.createElement("div");
    reviewDiv.classList = "review";

    var priceDiv = document.createElement("div");
    priceDiv.classList = "price";

    divType.appendChild(mainDiv);
    mainDiv.appendChild(div); 
    div.appendChild(button);
    mainDiv.appendChild(h4); 
    mainDiv.appendChild(h5); 
    mainDiv.appendChild(reviewDiv);
    mainDiv.appendChild(priceDiv);
    

    showStarReview(reviewDiv, y.Review.args[0].args[1]);
    showPrice(priceDiv, y.Price.args[0].args[1], y.Type)
}

function groupResults(y){
    y = y[0];
    if(y.Type == "Hotel" || y.Type == "Hostel"){
        displayHotelResult(y);
    } else if (y.Type == "Bar" || y.Type == "Restaurant"){
        displayOtherResult(y,bar);
    } else if (y.Type == "Landmark" || y.Type == "Museum"){
        displayOtherResult(y,landmark);
    } else if (y.Type == "Sport"){
        displayOtherResult(y,sport);
    } else if (y.Type == "Beach"){
        displayOtherResult(y,beach);
    } else if (y.Type == "Tour" || y.Type == "Cruise"){
        displayOtherResult(y,tour);
    }
}

function clearAll(){
    accommodationCount = 0;
    barCount = 0;
    landmarkCount = 0;
    sportCount = 0;
    beachCount = 0;
    tourCount = 0;
    
    for(let i = 1; i < acc.getElementsByTagName("P").length; i++)
        acc.getElementsByTagName("P")[i].remove();
    for(let i = 1; i < bar.getElementsByTagName("P").length; i++)
        bar.getElementsByTagName("P")[i].remove();
    for(let i = 1; i < landmark.getElementsByTagName("P").length; i++)
        landmark.getElementsByTagName("P")[i].remove();
    for(let i = 1; i < sport.getElementsByTagName("P").length; i++)
        sport.getElementsByTagName("P")[i].remove();
    for(let i = 1; i < beach.getElementsByTagName("P").length; i++)
        beach.getElementsByTagName("P")[i].remove();
    for(let i = 1; i < tour.getElementsByTagName("P").length; i++)
        beach.getElementsByTagName("P")[i].remove();
    
    $('.result').remove();
    $('.imgbox').remove();
}

$(document).ready(function() {
    $("#searchBtn").on("click", search);
    console.log(sessionStorage.getItem("username"));
    $("#signOut").on("click", signOut);
    $("#addList").on("click", addList);
    $("#addActivity").on("click", addToTrip);
    $("#cancel").on("click", closePopup);
    $("#cancel2").on("click", closePopup2);
    showNavItems();
    getLists();
    addPopularDestinations();
});

function showNavItems(){
    var nav = document.getElementsByTagName("nav")[0];
    var navList = nav.getElementsByTagName("a");
    console.log(navList);
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

function showLess(){
    $(".result").slice(resultNumber).hide();
    if(resultNumber >= accommodationCount){
        $("#accBtn").hide();
    }
}

function showMore(){
    $(".result").slice(resultNumber, resultNumber+5).show();
    resultNumber = resultNumber + 5;
    if(resultNumber >= accommodationCount){
        $("#accBtn").hide();
        resultNumber = 5;
    }
}

function signOut(){
    if(sessionStorage.getItem("username")!= null){
        sessionStorage.removeItem("username");
        listCount = 0;
    }
    showNavItems();
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
    var e = document.getElementById("tripList");
    var listName = e.value;
    var query = "add_activity('" + username + "', '" + listName + "', '" + city + "', '" + currentActivity.Activity + "')";
    ask(query);
    addTripPopup.style.display = "none";
}

function addPopularDestinations(){
    var destination1 = document.getElementsByClassName("destination")[0];
    var destination2 = document.getElementsByClassName("destination")[1];
    var destination3 = document.getElementsByClassName("destination")[2];

    var div1 = document.getElementsByClassName("img")[0];
    var div2 = document.getElementsByClassName("img")[1];
    var div3 = document.getElementsByClassName("img")[2];

    div1.style.backgroundImage = "url(./assets/images/dubrovnik.jpg)";
    div2.style.backgroundImage = "url(./assets/images/varazdin.jpg)";
    div3.style.backgroundImage = "url(./assets/images/hvar.jpg)";

    div1.onclick = function(){
        clearAll();
        city = "Dubrovnik";
        document.getElementById("cityName").innerHTML = city;
        localStorage.setItem("city",city);
        document.getElementById("results").style.display = "block";
        var query = "get_activity_type(Activity, Type, '" + city + "', Image, Review, Price)";
        ask(query);
        smoothScroll();
    }

    div2.onclick = function(){
        clearAll();
        city = "Varazdin";
        document.getElementById("cityName").innerHTML = city;
        localStorage.setItem("city",city);
        document.getElementById("results").style.display = "block";
        var query = "get_activity_type(Activity, Type, '" + city + "', Image, Review, Price)";
        ask(query);
        smoothScroll();
    }

    div3.onclick = function(){
        clearAll();
        city = "Hvar";
        document.getElementById("cityName").innerHTML = city;
        localStorage.setItem("city",city);
        document.getElementById("results").style.display = "block";
        var query = "get_activity_type(Activity, Type, '" + city + "', Image, Review, Price)";
        ask(query);
        smoothScroll();
    }

    var p1 = document.createElement("h4");
    var p2 = document.createElement("h4");
    var p3 = document.createElement("h4");

    var city1 = document.createTextNode("Dubrovnik");
    var city2 = document.createTextNode("Varazdin");
    var city3 = document.createTextNode("Hvar");

    p1.appendChild(city1);
    destination1.appendChild(p1);
    p2.appendChild(city2);
    destination2.appendChild(p2);
    p3.appendChild(city3);
    destination3.appendChild(p3);
}