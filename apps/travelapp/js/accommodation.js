var pengine;
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

var aRoomsCount = 0;
var aInternetCount = 0;
var aPolicyCount = 0;
var aBusinessCount = 0;
var aChildrenCount = 0;
var aActivitiesCount = 0;
var aPoolCount = 0;
var aParkingCount = 0;
var aAccessibilityCount = 0;
var aFoodCount = 0;
var aWellnessCount = 0;
var aPetsCount = 0;
var aServiceCount = 0;
var addBtn = null;
var currentActivity = null;

var addListPopup = document.getElementsByClassName("popup")[0];
var addTripPopup = document.getElementsByClassName("popup")[1];

var username = sessionStorage.getItem("username");

var listCount = 0;
var adding = false;

window.onload = function() {
    getLists();
    $("#signOut").on("click", signOut);
    showNavItems();
    document.getElementById("activityName").innerHTML = activityName;
    document.getElementById("location-type").innerHTML = city + " - " + activityType;
    document.getElementById("activityImg").src = image;
    query = "get_hotel_info('" + activityName + "', Description, Review, Price, Address, Phone, Website)";
    ask(query);    
    
    query2 = "get_hotel_amenities('" + activityName + "', Amenity, AmenityType)";
    ask(query2); 

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
            if(!adding && query.startsWith("get_hotel_info")){
                showResults2(this.data);
            }
            if(!adding && query.startsWith("get_hotel_amenities")){
                showAmenityResults2(this.data);
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

function onFailure(){
    document.getElementById("info").style.display = "none";
    document.getElementById("amenities").style.display = "none";
}

function showResults2(y){
        description = y[0].Description.args[0].args[1];
        review = y[0].Review.args[0].args[1];
        price = y[0].Price.args[0].args[1];
        address = y[0].Address.args[0].args[1];
        phone = y[0].Phone.args[0].args[1];
        website = y[0].Website.args[0].args[1];

        var reviewDiv = document.getElementById("review");
        var priceDiv = document.getElementById("price");

        document.getElementById("description").innerHTML = description;

        reviewDiv.innerHTML = "<h4>Review:</h4>";
        showStarReview(reviewDiv, review);
        reviewDiv.innerHTML += "<p class='review'>" + review + "</p>";

        priceDiv.innerHTML = "<h4>Price:</h4>";
        showPrice(priceDiv, price, activityType);
        priceDiv.innerHTML += "<p>From <span>" + price + "</span> kn/night</p>";

        document.getElementById("address").innerHTML = address;
        document.getElementById("phone").innerHTML = phone;
        document.getElementById("website").innerHTML = "<a href='"+ website+ "'>Visit Website</a>";
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

function writeln(string) {
    $('#results').append(string + "<br />");
}

function countAmenities2(y){
        y = y[0];
        if(y.AmenityType == "Rooms"){
            aRoomsCount++;
        } else if (y.AmenityType == "Internet"){
            aInternetCount++;
        } else if (y.AmenityType == "Policiy and Payment"){
            aPolicyCount++;
        } else if (y.AmenityType == "Service"){
            aServiceCount++;
        } else if (y.AmenityType == "Pool"){
            aPoolCount++;
        } else if (y.AmenityType == "Activities"){
            aActivitiesCount++;
        } else if (y.AmenityType == "Accessibility"){
            aAccessibilityCount++;
        } else if (y.AmenityType == "Business and Events"){
            aBusinessCount++;
        } else if (y.AmenityType == "Food and Drink"){
            aFoodCount++;
        } else if (y.AmenityType == "Children"){
            aChildrenCount++;
        } else if (y.AmenityType == "Parking ands Transport"){
            aParkingCount++;
        } else if (y.AmenityType == "Wellness"){
            aWellnessCount++;
        } else if (y.AmenityType == "Pets"){
            aPetsCount++;
        }
}

function showAmenityResults3(y){
    console.log(y);
}

function showAmenityResults2(y){
    countAmenities2(y);
        y = y[0];
        if(y.AmenityType == "Rooms"){
            var div = document.getElementById("amenityRooms");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Internet"){
            var div = document.getElementById("amenityInternet");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Policy and Payment"){
            var div = document.getElementById("amenityPolicy");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Service"){
            var div = document.getElementById("amenityServices");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Pool"){
            var div = document.getElementById("amenityPool");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Activities"){
            var div = document.getElementById("amenityActivities");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Accessibility"){
            var div = document.getElementById("amenityAccessibility");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName); 
            div.appendChild(p); 
        } else if (y.AmenityType == "Business and Events"){
            var div = document.getElementById("amenityBusiness");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Food and Drink"){
            var div = document.getElementById("amenityFood");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Children"){
            var div = document.getElementById("amenityChildren");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Parking and Transport"){
            var div = document.getElementById("amenityParking");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Wellness"){
            var div = document.getElementById("amenityWellness");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        } else if (y.AmenityType == "Pets"){
            var div = document.getElementById("amenityPets");
            var p = document.createElement("p");
            var amenityName = document.createTextNode(y.Amenity);
            var img = document.createElement("img");
            if(y.Amenity.startsWith("No ")){
                img.src = "./assets/images/no.svg";
            } else {
                img.src = "./assets/images/check1.svg";
            }
            img.height = 15;
            img.width = 15;
            p.appendChild(img);
            p.appendChild(amenityName);
            div.appendChild(p); 
        }
    hideEmptyCategory();
}


function hideEmptyCategory(){
    if(aRoomsCount == 0)
        document.getElementById("amenityRooms").style.display = "none";
    else
        document.getElementById("amenityRooms").style.display = "block";
    if (aServiceCount == 0)
        document.getElementById("amenityServices").style.display = "none";
    else
        document.getElementById("amenityServices").style.display = "block";
    if (aWellnessCount == 0)
        document.getElementById("amenityWellness").style.display = "none";
    else
        document.getElementById("amenityWellness").style.display = "block";
    if (aInternetCount == 0)
        document.getElementById("amenityInternet").style.display = "none";
    else
        document.getElementById("amenityInternet").style.display = "block";
    if (aParkingCount == 0)
        document.getElementById("amenityParking").style.display = "none";
    else
        document.getElementById("amenityParking").style.display = "block";
    if (aPetsCount == 0)
        document.getElementById("amenityPets").style.display = "none";
    else
        document.getElementById("amenityPets").style.display = "block";
    if (aPolicyCount == 0)
        document.getElementById("amenityPolicy").style.display = "none";
    else
        document.getElementById("amenityPolicy").style.display = "block";
    if (aPoolCount == 0)
        document.getElementById("amenityPool").style.display = "none";
    else
        document.getElementById("amenityPool").style.display = "block";
    if (aActivitiesCount == 0)
        document.getElementById("amenityActivities").style.display = "none";
    else
        document.getElementById("amenityActivities").style.display = "block";
    if (aFoodCount == 0)
        document.getElementById("amenityFood").style.display = "none";
    else
        document.getElementById("amenityFood").style.display = "block";
    if (aAccessibilityCount == 0)
        document.getElementById("amenityAccessibility").style.display = "none";
    else
        document.getElementById("amenityAccessibility").style.display = "block";
    if (aBusinessCount == 0)
        document.getElementById("amenityBusiness").style.display = "none";
    else
        document.getElementById("amenityBusiness").style.display = "block";
    if (aChildrenCount == 0)
        document.getElementById("amenityChildren").style.display = "none";
    else
        document.getElementById("amenityChildren").style.display = "block";
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