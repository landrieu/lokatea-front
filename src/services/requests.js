import axios from 'axios';

const requestURL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";


export default {
    ResearchPlaces:{

        getAllPlaces: function(coord, categoriesArray, params, callback){
            var promisesArray = [];
            params.attributes   = params.attributes      || "Loc_name,Place_addr,PlaceName,Phone,Rank,LongLabel,URL,Type";
            params.maxLocations = params.maxLocations    || 5;
    
            for(var cat of categoriesArray){
                var params = {
                    category:     cat,
                    attributes:   params.attributes,
                    maxLocations: params.maxLocations
                };
                var promise = this.constructPromise(coord, params);
                promisesArray.push(promise);
            }
    
            Promise.all(promisesArray).then((results) => {
                //Format data
                const arrayObjToObj = (array, categories) => {
                    var obj = {};
                    array.forEach((item, i) => {
                        obj[categories[i]] = item;
                    });
    
                    return obj;
                };
    
                callback(arrayObjToObj(results, categoriesArray));
            });
        },

        constructPromise: function(coord, requestParams){
            return new Promise((resolve, reject) => {
    
                var url = requestURL;
                var location = {"spatialReference": {"wkid":4326}, "x": coord[1], "y": coord[0]};
                var params = this.convertRequestParams({
                    f:              'json',
                    outFields:      requestParams.attributes, //"Loc_name,Place_addr,PlaceName,Phone,Rank,LongLabel,URL,Type",
                    category:       requestParams.category, //cat,
                    location:       location,
                    maxLocations:   requestParams.maxLocations, //5
                });
    
                axios.get(url + '?' + params)
                    .then((res) => {
                        if(res){
                            resolve(res.data.candidates);
                        }else{
                            reject("No result");
                        }
                });
            });
        },

        convertRequestParams: function(params){
            var formattedParams;
    
            for(var k in params){
                formattedParams = formattedParams ? formattedParams + "&" : "";
                if(typeof params[k] === 'object'){
                    formattedParams += (k + '=' + JSON.stringify(params[k]));
                }else{
                    formattedParams += (k + '=' + params[k]);
                }
            }
    
            return formattedParams;
        },
    }
};