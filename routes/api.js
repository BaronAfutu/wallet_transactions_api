var express = require('express');
var router = express.Router();
const {body,query,param,validationResult} = require('express-validator');
const wallet = require('../models/Wallet');

router.use(
    '/agent/create',
    body('name').trim().isLength({min:1}).escape(),
    body('email').isEmail().trim().isLength({min:1}).escape(),
    body('password').trim().isLength({min:4}),
    (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      res.status(400).json(errors);
    }
    else{
      next();
    }
});//Input validation
router.post('/agent/create', (req,res)=>{
    let details = req.body;
    wallet.createAgentWallet(details)
    .then((data)=>{
      //console.log(data);
       return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err.sqlMessage);
      return res.status(304).json(err);
    });
});


router.use(
  '/wallet/:walletID',
  param('walletID').isNumeric().trim().isLength({min:9}).escape(),
  (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    res.status(400).json(errors);
  }
  else{
    next();
  }
});//Input validation

router.get('/wallet/:walletID/debit/:amount',(req,res)=>{
  let {walletID,amount} = req.params;
  wallet.debitWallet(walletID,amount)
    .then((data)=>{
      //console.log(data);
      return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err);
      return res.status(304).json(err);
    });
});
router.get('/wallet/:walletID/credit/:amount',(req,res)=>{
  let {walletID,amount} = req.params;
  wallet.creditWallet(walletID,amount)
    .then((data)=>{
      //console.log(data);
      return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err);
      return res.status(304).json(err);
    });
});
router.get('/wallet/:walletID/getLoan/:amount',(req,res)=>{
  let {walletID,amount} = req.params;
  wallet.getLoan(walletID,amount)
    .then((data)=>{
      //console.log(data);
      return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err);
      return res.status(304).json(err);
    });
});
router.get('/wallet/:walletID/payLoan/:amount',(req,res)=>{
  let {walletID,amount} = req.params;
  wallet.payLoan(walletID,amount)
    .then((data)=>{
      //console.log(data);
      return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err);
      return res.status(304).json(err);
    });
});


router.use(
  '/transaction/:walletID',
  param('walletID').isNumeric().trim().isLength({min:9}).escape(),
  query('startDate').isDate().trim().escape(),
  query('stopDate').isDate().trim().escape(),
  query('tType').trim().escape(),
  (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    res.status(400).json(errors);
  }
  else{
    next();
  }
});//Input validation
router.get('/transaction/:walletID',(req,res)=>{
  let {walletID} = req.params;
  let details = req.query;
  wallet.getTransactions(walletID,details)
    .then((data)=>{
      //console.log(data);
      return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err);
      return res.status(304).json(err);
    });
});




router.use(
  '/wallet',
  body('email').isEmail().trim().isLength({min:1}).escape(),
  body('password').trim().isLength({min:4}),
  (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    res.status(400).json(errors);
  }
  else{
    next();
  }
});//Input validation

router.post('/wallet',(req,res)=>{
  let details = req.body;
    wallet.getWallet(details)
    .then((data)=>{
      console.log(data);
      return res.status(data['status']).json(data);
    }).catch(err=>{
      console.log(err);
      return res.status(304).json(err);
    });
});

module.exports = router;