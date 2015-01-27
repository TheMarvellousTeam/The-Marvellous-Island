var app = require('express')()


app.get('/', function(req, res) {
    res.send( 'hello')
})


app.get('/controller', function(req, res) {

    var roomName = req.params['room']

    if (!roomName)
        // TODO go to another page
        ;

    res.sendFile( 'index.html' , {root: './../js_controller'})
})
app.get('/bundle.js', function(req, res) {
    res.sendFile('./bundle.js', {root: './../js_controller'})
})


app.get('/view', function(req, res) {

    var roomName = req.params['room']

    if (!roomName)
        // TODO go to another page
        ;

    res.sendFile( 'index.html' , {root: './../js_viewer'})
})
app.get('/css/style.css', function(req, res) {
    res.sendFile('css/style.css', {root: './../js_viewer'})
})
app.get('/js/bundle.js', function(req, res) {
    res.sendFile('js/bundle.js', {root: './../js_viewer'})
})
app.get('/asset/:file', function(req, res) {
    res.sendFile('asset/'+req.params.file, {root: './../js_viewer'})
})
app.get('/asset/Mini/:file', function(req, res) {
    res.sendFile('asset/Mini/'+req.params.file, {root: './../js_viewer'})
})
app.listen(80)
