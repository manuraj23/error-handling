const express = require('express');
let app = express();

//Route=Http method + URL

app.get('/',(req,res)=>{
    // res.status(200).send('<h2>Hello From Express Server</h2>'); //.send is used to sent text/HTML
    res.status(200).json({message:'Hello From Express Server',status:200}); //.json is used to sent JSON/Application
});

app.post('/',(req,res)=>{
    res.status(200).send('<h2>Hello From Express Server</h2>');
})

const port = 3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})