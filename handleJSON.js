
let hostVal = 'https://kazar4.com:3000';
//if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
//    hostVal = 'http://127.0.0.1:5000';
//}

//receives a JSON file of all the data small businesses similiar to the one given
function getBizSearch(address, biz){
    URL = hostVal + '/getFromBusiness/?loc=' + address + "&bbs=" + biz;
    return JSON.parse(httpGet(URL));
}

//receives a JSON file of all the small business with the query
function getCustomSearch(address, query){
    URL = hostVal + '/getFull/?loc=' + address + "&inp=" + query;
    return JSON.parse(httpGet(URL));
}

//gets more details from a specific location
function getSpecficLocation(Location_ID){
    URL = hostVal + '/getBusiness/' + Location_ID;
    return JSON.parse(httpGet(URL));
}

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var business_data = [];

function getData(){
    address = document.getElementById('autocomplete').value
    business_category = document.getElementById('search-choose-input').value

    console.log(address + " : " + business_category);
    console.log("Getting Data");
    console.log(toggle_button);
    //Search with big business
    if (!toggle_button) {
        //URL = hostVal + '/getFromBusiness/?loc=' + address + "&bbs=" + business_category;
        business_data = getBizSearch(address, business_category);
        console.log(business_data)
        displayPlaces(business_data);
        console.log("trying to display1");

    //General Search
    } else {
        //URL = hostVal + '/getFromBusiness/?loc=' + address + "&inp=" + business_category;
        business_data = getCustomSearch(address, business_category);
        displayPlaces(business_data);
        console.log("trying to display2");
    }
}
