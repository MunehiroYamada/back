import * as http from 'http';
import express  from 'express';

const PORT=4000;
const app=express();

app.use(express.urlencoded());

app.post('/result',function(req,res){
  const params=req.body;
})