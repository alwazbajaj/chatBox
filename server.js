var express = require('express')
var bodyParser = require ('body-parser')
var app = express()
var http= require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
const port = 3200

mongoose.promise = Promise
//mongoose connection
mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost/ChatBoxdb', {
  
})

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


 
app.get('/messages',(req,res)=>
{
    Message.find({},(err,messages)=>
    {
        res.send(messages)
    })
    
})

app.post('/messages',(req,res)=>
{
    var message = new Message(req.body)

    message.save()
    .then(() => {
        
        console.log('message saved')
        return Message.findOne({message:'badword'})
        
    })
    .then(censored => {
        if(censored)
        {
            console.log('censored word found', censored)
            return Message.deleteOne({_id:censored.id})
        }
            io.emit('message',req.body)
            res.sendStatus(200)

    })
    
    .catch((err)=>
    {
        res.sendStatus(500)
        console.log('error found')
    })

   
    
    
    
    
    
})

io.on('connection',(socket)=>{
    console.log('a new user connected')

})

http.listen(port, () =>
console.log(`server is listening on ${port}`))

