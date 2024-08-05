const express = require('express')
const client = require('./redis_client')

const app = express()

app.use(express.json())



app.get('/',(req,res)=>{
    res.send("Server sunning")
})

app.post('/battery',async(req,res)=>{
    const {id} = req.body
     const respose = JSON.parse(await client.get(`${id}_battery`))
     res.json(respose)
})

app.post('/velocity',async(req,res)=>{
    const {id} = req.body
     const respose = JSON.parse(await client.get(`${id}_velocity`))
     res.json(respose)
})

app.post('/position',async(req,res)=>{
    const {id} = req.body
     const respose = JSON.parse(await client.get(`${id}_position`))
     res.json(respose)
})


app.listen(6000,async()=>{
    await client.connect()
    console.log('server started at 6000')
})