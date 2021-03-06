const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Dishes = require('../models/dishes');
const cookieParser = require('cookie-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')

// .all((req,res,next)=>
//   {
//     res.statusCode=200;
//     res.setHeader('Content-type','text/plain');
//     next();

//   })
.get((req,res,next)=>
{
  // res.end('Will Send all the dishes to you!');
  Dishes.find({}).then((dishes)=>
  {
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(dishes);
  },(err)=>next(err))
  .catch((err)=>next(err));

})
.post((req,res,next)=>
{
  //  res.end('Will add the dish:' + req.body.name + 'with details:' + req.body.description);
  Dishes.create(req.body)
  .then((dish)=>
  {
    console.log('Dish created',dish);
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(dish);
  },(err)=>
  {
    next(err);
  })
  .catch((err)=>next(err));

})
.put((req,res,next)=>
{
  res.statusCode=403;
  res.end('PUT operation not supported');
})

.delete((req,res,next)=>
{
  // res.end("Delete all dishes");
  Dishes.remove({}).then((resp)=>
  {
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);

  },(err)=> next(err))
.catch((err)=>next(err));
});
//there should be an all but we are modifying it anyway.
dishRouter.route('/:dishId')
.get((req,res,next)=>
{
  // res.end('Will Send all the dishes to you!' + req.params.dishId);
  Dishes.findById(req.params.dishId).then((dish)=>
  {
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=>next(err));


})
.post((req,res,next)=>
{
   res.statusCode=403;
   res.end("Not supported " + req.params.dishId);

})
.put((req,res,next)=>
{
  
  // res.write('Updating the dish : ' + req.params.dishId + '\n');
  // res.end("Wil update " + req.body.name  + req.body.description);
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set:req.body
  },{new:true}).then((dish)=>
  {
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(dish)
  },(err)=>next(err))
  .catch((err)=>next(err));
})

.delete((req,res,next)=>
{
  // res.end("Delete  dish" + req.params.dishId);
  Dishes.findByIdAndRemove(req.params.dishId).then((resp)=>
  {
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.json(resp);
  },(err)=>next(err)).catch((err)=>next(err));

});


dishRouter.route('/:dishId/comments')

// .all((req,res,next)=>
//   {
//     res.statusCode=200;
//     res.setHeader('Content-type','text/plain');
//     next();

//   })
.get((req,res,next)=>
{
  // res.end('Will Send all the dishes to you!');
  Dishes.findById(req.params.dishId)
  .then((dish)=>
  {
    if(dish!=null){
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json(dish.comments);
    }
    else{
      err = new Error('Dish' + req.params.dishId + 'not Found');
      err.status=404;
      return next(err);
    }
  
  },(err)=>next(err))
  .catch((err)=>next(err));

})
.post((req,res,next)=>
{
  //  res.end('Will add the dish:' + req.body.name + 'with details:' + req.body.description);
  Dishes.findById(req.params.dishId)
  .then((dish)=>
  {
    if(dish!=null){
     
      dish.comments.push(req.body);
      dish.save()
      .then((dish)=>
      {
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish.comments);
      },(err)=> next(err));
     
    }
    else{
      err = new Error('Dish' + req.params.dishId + 'not Found');
      err.status=404;
      return next(err);
    }
  
    // console.log('Dish created',dish);
    // res.statusCode=200;
    // res.setHeader('Content-type','application/json');
    // res.json(dish);
  },(err)=>
  {
    next(err);
  })
  .catch((err)=>next(err));

})
.put((req,res,next)=>
{
  res.statusCode=403;
  res.end('PUT operation not supported' + req.params.dishId );
})

.delete((req,res,next)=>
{
  // res.end("Delete all dishes");
  Dishes.findById(req.params.dishId).then((dish)=>{
    if(dish!=null){
     
     for(var i = (dish.comments.length -1);i>=0;i--)
     {
       dish.comments.id(dish.comments[i]._id).remove();
     }
     dish.save()
     .then((dish)=>
     {
       res.statusCode=200;
       res.setHeader('Content-type','application/json');
       res.json(dish.comments);
     },(err)=> next(err));
    }
    else{
      err = new Error('Dish' + req.params.dishId + 'not Found');
      err.status=404;
      return next(err);
    }
  }
 ,(err)=> next(err))
.catch((err)=>next(err));
});
//there should be an all but we are modifying it anyway.
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>
{
  // res.end('Will Send all the dishes to you!' + req.params.dishId);
  Dishes.findById(req.params.dishId).then((dish)=>
  {
    if(dish !=null && dish.comments.id(req.params.commentId)!=null)
    {
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json(dish.comments.id(req.params.commentId));
    }
    else if(dish==null)
    {
      err= new Error('Dish ' + req.params.dishId + ' not exist');
      err.status=404;
      return next(err);

    }
    else{
      err= new Error ( 'Comment' + req.params.commentId + 'not exist');
      err.status=404;
      return next(err);

    }
  },(err)=>next(err))
  .catch((err)=>next(err));


})
.post((req,res,next)=>
{
   res.statusCode=403;
   res.end("Not supported " + req.params.dishId + 
  req.params.commentId);

})
.put((req,res,next)=>
{
  
  // res.write('Updating the dish : ' + req.params.dishId + '\n');
  // res.end("Wil update " + req.body.name  + req.body.description);
  Dishes.findById(req.params.dishId).then((dish)=>
  {
    if(dish !=null && dish.comments.id(req.params.commentId)!=null)
    {
      if(req.body.rating)
      {
        dish.comments.id(req.params.commentId).rating=req.body.rating;

      }
      if(req.body.comment)
      {
        dish.comments.id(req.params.commentId).comment=req.body.comment;
      }
      dish.save()
      .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(dish);
      }, (err)=> next(err));
   
    }
    else if(dish==null)
    {
      err= new Error('Dish ' + req.params.dishId + ' not exist');
      err.status=404;
      return next(err);

    }
    else{
      err= new Error ( 'Comment' + req.params.commentId + 'not exist');
      err.status=404;
      return next(err);

    }
  },(err)=>next(err))
  .catch((err)=>next(err));
})

.delete((req,res,next)=>
{
  // res.end("Delete  dish" + req.params.dishId);
  Dishes.findById(req.params.dishId).then((dish)=>{
    if(dish!=null && dish.comments.id(req.params.commentId)!=null){
     dish.comments.id(req.params.commentId).remove();
     
     dish.save()
     .then((dish)=>
     {
       res.statusCode=200;
       res.setHeader('Content-type','application/json');
       res.json(dish.comments);
     },(err)=> next(err));
    }
    else if(dish==null)
    {
      err= new Error('Dish ' + req.params.dishId + ' not exist');
      err.status=404;
      return next(err);

    }
    else{
      err= new Error ( 'Comment' + req.params.commentId + 'not exist');
      err.status=404;
      return next(err);

    }
    
  }
 ,(err)=> next(err))
  .catch((err)=>next(err));

});



module.exports = dishRouter;