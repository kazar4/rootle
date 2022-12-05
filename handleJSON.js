//receives a JSON file of all the data small businesses similiar to the one given
function getBizSearch(address, biz){
    URL = 'https://127.0.0.1:5000/getFromBusiness/?loc=' + address + "&bbs=" + biz;
    JSON.parse(httpGet(URL));
}

//receives a JSON file of all the small business with the query
function getCustomSearch(address, query){
    URL = 'https://127.0.0.1:5000/getFull/?loc=' + address + "&inp=" + query;
    JSON.parse(httpGet(URL));
}

//gets more details from a specific location
function getSpecficLocation(Location_ID){
    URL = 'https://127.0.0.1:5000/getBusiness/' + Location_ID;
    JSON.parse(httpGet(URL));
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
        URL = 'https://127.0.0.1:5000/getFromBusiness/?loc=' + address + "&bbs=" + business_category;
        business_data = getBizSearch(address, business_category);
        displayPlaces(business_data);
        console.log("trying to display1");

    //General Search
    } else {
        URL = 'https://127.0.0.1:5000/getFromBusiness/?loc=' + address + "&inp=" + business_category;
        business_data = getCustomSearch(address, business_category);
        displayPlaces(business_data);
        console.log("trying to display2");
    }
}
