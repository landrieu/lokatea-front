Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

export default {
    ComputeDistance:{
        getDistanceBetweenTwoPointsInKm: function(point1, point2) {
            var R = 6371; // Radius of the earth in km
            var dLat = (point2.lat - point1.lat).toRad();  
            var dLon = (point2.lon - point1.lon).toRad(); 
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(point1.lat.toRad()) * Math.cos(point2.lat.toRad()) * Math.sin(dLon/2) * Math.sin(dLon/2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return d;
        }
        
    }
    
};