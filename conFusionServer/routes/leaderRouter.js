const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.all((req,res,next)=>
  {
    res.statusCode=200;
    res.setHeader('Content-type','text/plain');
    next();

  })
.get((req,res,next)=>
{
  res.end('Will Send all the leaders to you!');

})
.post((req,res,next)=>
{
   res.end('Will add the leader:' + req.body.name + 'with details:' + req.body.description);

})
.put((req,res,next)=>
{
  res.statusCode=403;
  res.end('PUT operation not supported');
})

.delete((req,res,next)=>
{
  res.end("Delete all leaders");

});
leaderRouter.route('/:leaderId')
.get((req,res,next)=>
{
  res.end('Will Send all the leader to you!' + req.params.leaderId);

})
.post((req,res,next)=>
{
   res.statusCode=403;
   res.end("Not supported " + req.params.leaderId);

})
.put((req,res,next)=>
{
  
  res.write('Updating the leader: ' + req.params.leaderId + '\n');
  res.end("Wil update " + req.body.name  + req.body.description);
})

.delete((req,res,next)=>
{
  res.end("Delete  leader" + req.params.leaderId);

});

module.exports= leaderRouter;