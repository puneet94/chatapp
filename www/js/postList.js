'use strict';

var url = '';
var token = '';
var params = {};
function runAxios(data){
  if(data.url){
    url = data.url;
  }
  if(data.params){
    params = data.params;
  }
  if(data.token){
    
    token = data.token;
    
  }
  ajax(url,params,token,function(res){
    

    
    postMessage(res);
  });
}

onmessage = function (event) {
            
            var data = JSON.parse(event.data);
            
            runAxios(data);
        };



var ajax = function(url, data, token,callback) {
  var idx,value,data_string;
  
    //default to a GET request
   var  type = 'GET';
   var data_array = [];
  for (idx in data) {
    value = data[idx];
    data_array.push("" + idx + "=" + value);
  }
  data_string = data_array.join("&");
  
  var req = new XMLHttpRequest();
  req.open(type, url+'?'+data_string, false);
  req.setRequestHeader("Authorization", "Bearer "+token);
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200) {
      return callback(req.responseText);
    }
  };
  req.send();
  return req;
};