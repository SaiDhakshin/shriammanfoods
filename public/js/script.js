const login = document.getElementById("loginLink");

login.addEventListener('click',login);

function login(){
    
        fetch("/login",{
            method : 'get',
            headers : {
                "Content-type" : "application/json"
            }
        })
            .then(function(response){
                if(response.status != 200){
                    console.log('Problem status code' + response.status);
                }else{
                    console.log(response.json());
                }
                
            })
            .then(function(data){
                console.log(data)
            })
    
    
}


function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }