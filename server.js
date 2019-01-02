var express = require('express')
var bodyParser = require ('body-parser')
var app = express()
var http= require('http').Server(app)
var io = require('socket.io')(http)
const port = 3200



app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var messages = [
    {name:'tim', message:'hi'},
    {name:'jane',message:'hello'}
]

app.get('/messages',(req,res)=>
{
    res.send(messages)
})

app.post('/messages',(req,res)=>
{
    
    messages.push(req.body)
    io.emit('message',req.body)
    res.sendStatus(200)
})

io.on('connection',(socket)=>{
    console.log('a new user connected')

})

http.listen(port, () =>
console.log(`server is listening on ${port}`))

