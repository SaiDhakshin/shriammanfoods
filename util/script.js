var location = {
    location : function(position) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
        })
    }
}

module.exports = location;