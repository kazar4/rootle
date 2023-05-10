display = document.getElementById("display-giant");
scroll = document.getElementById("scroll-child");
flexContainer = document.getElementById("flex-container");

logoText = document.getElementById("logoText");
locationField = document.getElementById("locationField");
searchChoose = document.getElementById("search-choose");
search = document.getElementById("search");

toggleSwitch = document.getElementById("toggle_wrapper");
goback = document.getElementById("goback");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animateAway(){
  logoText.style.transform = "translateY(-700%)";
  locationField.style.transform = "translateY(-800%)";
  searchChoose.style.transform = "translateY(-1000%)";
  search.style.transform = "translateY(-1500%)";

  toggleSwitch.style.opacity = "0";

  sleep(3000).then(() => {

  logoText.style.display = "none";
  locationField.style.display = "none";
  search.style.display = "none";
  searchChoose.style.display = "none";

  toggleSwitch.style.display = "none";

  getComputedStyle(flexContainer).opacity
  flexContainer.style.display = "flex";
  flexContainer.style.opacity = "0";
  sleep(300).then(() => {
  flexContainer.style.opacity = "1.0";

  goback.style.display = "block";

    });
  });
}


String.prototype.format = function() {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};


function displayData(location_ID, index) {

    console.log(index);
    getSpecficLocation(location_ID).then((object) => {

    old_object = business_data[parseInt(index)];
    console.log(business_data);
    console.log(old_object);

    timesDiv = findOpenDays(object.hours[0].open);
    console.log(timesDiv)
    openVAL = `<div class="closed"> CLOSED </div><br> Days Open:` + timesDiv
    if (old_object.is_closed){
      openVAL = `<div class="closed"> CLOSED </div><br>  Days Open:` + timesDiv
    } else {
      openVAL = `<div class="open"> OPEN </div><br>  Days Open:` + timesDiv
    }

    obj_distance = parseInt((old_object.distance * 0.000621371) * 10)/10;

    display.innerHTML =
        `<div class="box a">{}</div>
        <div class="box b">{}</div>
        <div class="box c">
        <div class="about"></div> <br>
          {}
        </div>

        <div id="group-images"> 
          <div class="box d"><img src="{}"></img></div>
          <div class="box e"><img src="{}"></img></div>
          <div class="box f"><img src="{}"></img></div>
        </div>
    
        <div id="extraInfo">
          <div class="box g"><img src="stars/{}stars.png"></img></div>
          <div class="box h">{} Miles Away</div>
          <div class="box i">
          <img src="yelp.png"></img>
          <a href="{}" style="color: rgb(212, 74, 102);">  Yelp Me</a></div>
        </div>`.format(old_object.name, openVAL, "", object.photos[0], object.photos[1],
          object.photos[2], object.rating, obj_distance, object.url);
    
    display.style.backgroundColor = "rgba(68, 68, 68, 0.6)";     

})
}

function displayPlaces(obj){

    //value = JSON.stringify(obj)


    previousHTML = scroll.innerHTML
    
    baseHTML = "";
    if (obj.length == 0) {
      baseHTML = baseHTML + `<div class="place-data">0 Results found
    </div></div>`;
    scroll.innerHTML = baseHTML + "<br><br>";
      return;
    }

    for (i = 0; i < obj.length; i++){
        object = obj[i]

        tagText = ""

        if (object.categories.length > 1){
          tagText = tagText + object.categories[0].title
        } else if (object.categories.length > 1){
          tagText = tagText + object.categories[1].title
        }
        
        baseHTML = baseHTML + 
        `
        <div class="place-data" onclick="displayData('{}', '{}')">
          <div class="place-name">
            {}
          </div>
          <div class="place-picture">
            <img src="{}"></img>
          </div>
          <div class="place-info" style="color: rgb(212, 74, 102);">
            {} Miles away
          </div>
          <div class="place-tags">
            {}
          </div> 
        </div>`.format(object.id, i, object.name, object.image_url, 
          parseInt((object.distance * 0.000621371) * 10)/10, tagText)
    }

    scroll.innerHTML = previousHTML + baseHTML + "<br><br>";
}

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

//namemore.hours[0].open
function findOpenDays(arr){

  vals = [0, 1, 2, 3, 4 ,5, 6]
  var count = 0
  for (i = 0; i < arr.length; i++){
    vals.remove(i.day)
  }

  divString = ""

  one = ["<span class='open'>Mon</span>", "<span class='closed'>Mon</span>", 0]
  two = ["<span class='open'>Tues</span>", "<span class='closed'>Mon</span>", 1]
  three = ["<span class='open'>Wed</span>", "<span class='closed'>Mon</span>", 2]
  four = ["<span class='open'>Thurs</span>", "<span class='closed'>Mon</span>", 3]
  five = ["<span class='open'>Fri</span>", "<span class='closed'>Mon</span>", 4]
  six = ["<span class='open'>Sat</span>", "<span class='closed'>Mon</span>", 5]
  seven = ["<span class='open'>Sun</span>", "<span class='closed'>Mon</span>", 6]
  
  numberList = [one, two, three, four, five, six, seven]

  for (i = 0; i <= 6;i++){
    if (vals.includes(numberList[i][2])){
      divString = divString + " " + numberList[i][0]
    } else {
      divString = divString + " " + numberList[i][1]
      }
    }

  return divString
}

/*
   <div class="place-data" onclick="displayData(1)">
          <div class="place-name">
            Pog Champ Central
          </div>

          <div class="place-picture">
            IMG
          </div>
          <div class="place-distance">
            420 Miles away
          </div>
          <div class="place-description">
            place to get great pog, and have pog time
          </div>
          <div class="place-more-info">
            https://www.youtube.com/watch?v=oHg5SJYRHA0
          </div>
        </div>
*/



/*
   <table id="address">
        <tr>
          <td class="label">Street address</td>
          <td class="slimField">
            <input class="field" id="street_number" disabled="true" />
          </td>
          <td class="wideField" colspan="2">
            <input class="field" id="route" disabled="true" />
          </td>
        </tr>
        <tr>
          <td class="label">City</td>
          <td class="wideField" colspan="3">
            <input class="field" id="locality" disabled="true" />
          </td>
        </tr>
        <tr>
          <td class="label">State</td>
          <td class="slimField">
            <input
              class="field"
              id="administrative_area_level_1"
              disabled="true"
            />
          </td>
          <td class="label">Zip code</td>
          <td class="wideField">
            <input class="field" id="postal_code" disabled="true" />
          </td>
        </tr>
        <tr>
          <td class="label">Country</td>
          <td class="wideField" colspan="3">
            <input class="field" id="country" disabled="true" />
          </td>
        </tr>
      </table>
*/


/*

display.innerHTML =
        `<div class="place-name">
            {}
          </div>
          <div class="place-picture">
            {}
          </div>
          <div class="place-distance">
            {}
          </div>
          <div class="place-description">
            {}
          </div>
          <div class="place-more-info">
            {}
          </div>`.format(object.name, object.picture, object.distance, object.description, object.moreInfo);
    
*/

/*

<div class="box a">A-NAME</div>
    <div class="box b">B-OPEN/ClOSING</div>
    <div class="box c">C-DESCRIPTION</div>
    <div class="box d">D-PICTURE 1</div>
    <div class="box e">E-PICTURE 2</div>
    <div class="box f">F-PICTURE 3</div>

    <div id="extraInfo">
      <div class="box g">G-STAR RATING</div>
      <div class="box h">H-DISTANCE</div>
      <div class="box i">I-CONTACT</div>
    </div>

    */



    /*

<div class="place-data" onclick="displayData('{}', '{}')">
            <div class="place-name">
              "Test Location"
            </div>
            <div class="place-picture">
              <img src="https://s3-media1.fl.yelpcdn.com/bphoto/Z46ajDNExdCd8EwFbZpmgw/o.jpg"></img>
            </div>
            <div class="place-info">
              30 Miles away
              <br>
              <div class="open">OPEN</div>
            </div>
            <div class="place-tags">
              Games, Cool, More Stuff
            </div> 
          </div>

    */
