var express = require('express');
var app = express();
var os = require('os');
var server_port = process.env.NODEJS_PORT || 9094

app.get('/', function (req, res) {
    
  sb = "<html><title>Kaboom server</title><body>";
  sb = sb+"<div><h3>Kaboom server</h3>This server is intended to crash all the memory of the host if you go to <a href=\"/kaboom-ah-ah-ah\">this link<a><div>";
  //os.cpus()
  sb = sb+"<div>free memory: "+(os.freemem() / 1024)+"<br/>";
  //sb = sb+"allocated memory: ").append(format.format(os.totalmem() / 1024)).append("<br/>");
  sb = sb+"max memory: "+(os.totalmem() / 1024)+"<br/>";
  sb = sb+"total free memory: "+(os.freemem() / 1024)+"<br/>";
  sb = sb+"</div></body></html>";
    //os.freemem()
  res.send(sb);
})

app.get('/kaboom-ah-ah-ah', function (req, res) {
  var array = [];
  var i = 0;
  while (true){
    array.push(i++);
    array.push(array);
  }
  res.send('kaboom ?'+i);
})


app.listen(server_port, function () {
  console.log("Example app listening on port "+server_port+"!");
})