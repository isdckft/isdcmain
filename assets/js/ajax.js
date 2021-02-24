// var url = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes'
var url = 'http://django.isdckft.com/rest/webpages/'
var xhrbtn = document.querySelector("#xhr");
var fetchbtn = document.querySelector("#fetch");
var axiosbtn = document.querySelector("#axios");
var display = document.querySelector("#quote");

xhrbtn.addEventListener("click", function(){
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function(){
    if(XHR.readyState == 4 && XHR.status == 200){
      var quote = JSON.parse(XHR.responseText)[0];
      display.innerText = JSON.stringify(quote,null,2);
    }
  }
  XHR.open("GET", url);
  XHR.send();
});


fetchbtn.addEventListener("click", function(){
  fetch(url)
  .then(function(req){
    req.json().then(function(data){
      display.innerText = JSON.stringify(data[0],null,2);
    })
  })
  .catch(function(){
    alert("ERROR!")
  })
});

axiosbtn.addEventListener("click",function(){
  axios.get(url)
  .then(function(res){
    display.innerText = JSON.stringify(res.data[0],null,2);
  })
  .catch(function(){
    alert("ERROR!");
  })
});

$('#jquery').click(function(){
    $.getJSON(url)
    .done(function(data){
      $('#quote').text(JSON.stringify(data[0],null,2));
    });
  });