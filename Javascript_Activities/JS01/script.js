const countButton = document.getElementById("btnCount");
const counter = document.getElementById("txtCounter");

let count = 0;
// javscript lambda function
countButton.addEventListener("click", ()=>{
    
    console.log(counter.innerHTML)
    count++;
    counter.innerHTML = count;
    // console.log("clicked");
    // alert("clicked");
});