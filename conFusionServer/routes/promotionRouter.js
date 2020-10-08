const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')

.all((req,res,next)=>
  {
    res.statusCode=200;
    res.setHeader('Content-type','text/plain');
    next();

  })
.get((req,res,next)=>
{
  res.end('Will Send all the promotions to you!');

})
.post((req,res,next)=>
{
   res.end('Will add the promotion:' + req.body.name + 'with details:' + req.body.description);

})
.put((req,res,next)=>
{
  res.statusCode=403;
  res.end('PUT operation not supported');
})

.delete((req,res,next)=>
{
  res.end("Delete all promotions");

});
promotionRouter.route('/:promotionId')
.get((req,res,next)=>
{
  res.end('Will Send all the promotion to you!' + req.params.promotionId);

})
.post((req,res,next)=>
{
   res.statusCode=403;
   res.end("Not supported " + req.params.promotionId);

})
.put((req,res,next)=>
{
  
  res.write('Updating the promotion: ' + req.params.promotionId + '\n');
  res.end("Wil update " + req.body.name  + req.body.description);
})

.delete((req,res,next)=>
{
  res.end("Delete  promotion" + req.params.promotionId);

});
module.exports= promotionRouter;
