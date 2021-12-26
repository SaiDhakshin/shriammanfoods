



let location = document.getElementById('location');

location.addEventListener('click',location());

function location(){
     console.log("location ran")
    
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                console.log("From script file : " + position);
            })
        }else{
            console.log("No geolocation");
        }
    
    }