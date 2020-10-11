display = document.getElementById("background");

bgIndex = 0

listOfBgColors = ["#af9fce", "#ddbcd6", "#accdfc", "#b3acf9"]

setInterval(function(){ 
    changeBG(bgIndex);
    bgIndex = bgIndex + 1
    if (bgIndex > listOfBgColors.length){
        bgIndex = 0
    }
}, 6000);

function changeBG(index){
    document.body.style.backgroundColor = listOfBgColors[index];
}



function snackBarShow() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){x.className = x.className.replace("show", ""); }, 3000);
  }

elem = document.getElementById("content-program")

elem.addEventListener('scroll', (event) => {
    console.log(elem.scrollTop)
    if (elem.scrollHeight - elem.scrollTop === elem.clientHeight) {
        snackBarShow()
    }
});

//document.getElementById("content-program").scrollTop;
//document.getElementById("content-program").scrollHeight;

toggle_elem = document.getElementById("toggle");
toggle_Text = document.getElementById("toggleText");
search_btn = document.getElementById("search");

toggle_button = false;

toggle_elem.addEventListener("input", (event) => {
    console.log("toggle clicked");
    if (toggle_button) {
        search_btn.style.backgroundColor = "#8f77c9"
        toggle_button = false;

        toggle_Text.innerHTML = 
        `<span class="tooltiptext">Click here to search for a custom category instead of a big business alternative</span>`
        
        document.getElementById("search-choose-input").placeholder = "Large Business Name...";

    } else {
        search_btn.style.backgroundColor = "#f9cb64"
        toggle_button = true;

        toggle_Text.innerHTML = 
        `<span class="tooltiptext">Click here to search for a big business alternative instead of a custom category</span>`

        document.getElementById("search-choose-input").placeholder = "Category...";
    }
});


function resetPage(){
    location.reload();
}