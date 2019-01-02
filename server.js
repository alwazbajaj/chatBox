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

app.post('/messages',async (req,res)=>
{
    try{
        
    var message = new Message(req.body)

    var savedmessage = await message.save()

    console.log('message saved')
    var censored =await  Message.findOne({message:'badword'})
        
    
    if(censored)
        await Message.deleteOne({_id:censored.id})
    else    
        io.emit('message',req.body)
    
    res.sendStatus(200)
    } catch(error)
    {
        res.sendStatus(500)
        return console.error(error)
    }
    finally{
        //console.log('message saved')
    }
    

})

io.on('connection',(socket)=>{
    console.log('a new user connected')

})

http.listen(port, () =>
console.log(`server is listening on ${port}`))

