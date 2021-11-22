const db = require('./db');
const crypto = require('crypto');

let createAgentWallet = (agentDetails)=>{
    return new Promise((resolve,reject)=>{
        let qry = `select * from agent where email='${agentDetails['email']}'`;
        db.query(qry,(err,results)=>{   //Check if email used already exists
            if(err)return reject(err);
            if(results.length==0){  //Agent with same email does not exist
                let {name,email,password,cp} = agentDetails;
                let hashPassword = crypto.createHash('sha256').update(password).digest('hex');
                let walletn = Date.now()%1000000000; //9 digit wallet ID
                qry = `insert into agent (email,name,wallet_number,password) values ('${email}','${name}',${walletn},'${hashPassword}')`;
                db.query(qry,(err_,results_)=>{ //Store agent in database
                    if(err_) return reject(err_);
                    qry = `insert into wallet (wallet_number,wallet_amount,loan_owed) values (${walletn},0,0)`;
                    db.query(qry,(err_1,results_1)=>{//Store wallet in database
                        if(err_1) return reject(err_1);
                        resolve({'status': 200,'data':{},'msg': 'Agent Wallet Created'});
                        });
                    });
            }
            else{
                resolve({'status': 200,'data':{},'msg': 'Email already exists'});
            }
        })
    });
};

let getWallet =(agentDetails)=>{
    return new Promise((resolve,reject)=>{
        let qry = `select * from agent where email='${agentDetails['email']}'`;
        db.query(qry,(err,results)=>{ //authenticating agent to retrieve wallet info
            if(err)return reject(err);
            if(results.length==1){ //agent with email exists
                let hashPassword = crypto.createHash('sha256').update(agentDetails.password).digest('hex');
                if(hashPassword!=results[0]['password'])return reject({'data':{},'msg':'Incorrect details'})
                let agentWallet = {
                    'name': results[0]['name'],
                    'email': results[0]['email'],
                    'wallet_number': results[0]['wallet_number']
                }
                qry = `select * from wallet where wallet_number=${agentWallet['wallet_number']}`;
                db.query(qry,(err_,results_)=>{//retrieve wallet info based on wallet number
                    if(err_)return reject(err);
                    if(results_.length==1){
                        agentWallet['amount'] = results_[0]['wallet_amount'];
                        agentWallet['loanOwed'] = results_[0]['loan_owed'];
                        resolve({'data':agentWallet,'msg':'Details retrieved','status':200});
                    }
                    else{
                        resolve({'status': 304,'data':{},'msg': 'Error retrieving agent details.!!'});
                    }
                })
            }
            else{
                resolve({'status': 304,'data':{},'msg': 'Error retrieving agent details!!'});
            }
        });
    });
}

let debitWallet = (walletID,amount)=>{
    return new Promise((resolve,reject)=>{
        let qry = `select * from wallet where wallet_number=${walletID}`;
        db.query(qry,(err,results)=>{//get wallet based on wallet number
            if(err) return reject(err);
            if(results.length==1){//wallet with wallet number exists
                let wallet = results.pop();
                wallet.wallet_amount+=parseFloat(amount);
                qry = `update wallet set wallet_amount=${wallet.wallet_amount} where wallet_number=${walletID}`;
                db.query(qry,(err_)=>{ //update wallet amount after debit
                    if(err_)throw err_;
                    qry = `insert into transaction(wallet_number,amount,t_type) values (${walletID},${amount},'Debit')`;
                    db.query(qry,(err_1)=>{ //log transaction
                        if(err_1)throw err_1;
                        resolve({'data':wallet,'status':200,'msg':'Transaction Saved!!'});
                    });
                });       
            }
            else{
                resolve({'status': 304,'data':{},'msg': 'Error performing transaction!!'});
            }
        });
    });
};

let creditWallet = (walletID,amount)=>{
    return new Promise((resolve,reject)=>{
        let qry = `select * from wallet where wallet_number=${walletID}`;
        db.query(qry,(err,results)=>{//get wallet based on wallet number
            if(err) return reject(err);
            if(results.length==1){//wallet with wallet number exists
                let wallet = results.pop();
                wallet.wallet_amount-=parseFloat(amount);
                if(wallet.wallet_amount<0){
                    wallet.wallet_amount+=parseFloat(amount);
                    resolve({'data':wallet,'status':304,'msg':'Cannot Credit wallet. Insufficient balance!!'});
                    return;
                }
                qry = `update wallet set wallet_amount=${wallet.wallet_amount} where wallet_number=${walletID}`;
                db.query(qry,(err_)=>{//update wallet amount after debit
                    if(err_)throw err_;
                    qry = `insert into transaction(wallet_number,amount,t_type) values (${walletID},${amount},'Credit')`;
                    db.query(qry,(err_1)=>{//log transaction
                        if(err_1)throw err_1;
                        resolve({'data':wallet,'status':200,'msg':'Transaction Saved!!'});
                    });
                });       
            }
            else{
                resolve({'status': 304,'data':{},'msg': 'Error performing transaction!!'});
            }
        });
    });
};

let getLoan = (walletID,amount)=>{
    return new Promise((resolve,reject)=>{
        let qry = `select * from wallet where wallet_number=${walletID}`;
        db.query(qry,(err,results)=>{//get wallet based on wallet number
            if(err) return reject(err);
            if(results.length==1){//wallet with wallet number exists
                let wallet = results.pop();
                wallet.wallet_amount+=parseFloat(amount);
                wallet.loan_owed-=parseFloat(amount);
                qry = `update wallet set wallet_amount=${wallet.wallet_amount}, loan_owed=${wallet.loan_owed} where wallet_number=${walletID}`;
                db.query(qry,(err_)=>{ //update wallet amount after loan debit
                    if(err_)throw err_;
                    qry = `insert into transaction(wallet_number,amount,t_type) values (${walletID},${amount},'Loan Debit')`;
                    db.query(qry,(err_1)=>{ //log transaction
                        if(err_1)throw err_1;
                        resolve({'data':wallet,'status':200,'msg':'Transaction Saved!!'});
                    });
                });       
            }
            else{
                resolve({'status': 304,'data':{}, 'msg': 'Error performing transaction!!'});
            }
        });
    });
};

let payLoan = (walletID,amount)=>{
    return new Promise((resolve,reject)=>{
        let qry = `select * from wallet where wallet_number=${walletID}`;
        db.query(qry,(err,results)=>{//get wallet based on wallet number
            if(err) return reject(err);
            if(results.length==1){//wallet with wallet number exists
                let wallet = results.pop();
                wallet.wallet_amount-=parseFloat(amount);
                if(wallet.wallet_amount<0){
                    wallet.wallet_amount+=parseFloat(amount);
                    resolve({'data':wallet,'status':304,'msg':'Cannot Credit wallet. Insufficient balance!!'});
                    return;
                }
                wallet.loan_owed+=parseFloat(amount);
                if(wallet.wallet_amount>0){
                    wallet.loan_owed-=parseFloat(amount);
                    resolve({'data':wallet,'status':304,'msg':'Excess payment amount!!'});
                    return;
                }
                qry = `update wallet set wallet_amount=${wallet.wallet_amount}, loan_owed=${wallet.loan_owed} where wallet_number=${walletID}`;
                db.query(qry,(err_)=>{//update wallet amount after pay loan
                    if(err_)throw err_;
                    qry = `insert into transaction(wallet_number,amount,t_type) values (${walletID},${amount},'Loan Repayment')`;
                    db.query(qry,(err_1)=>{//log transaction
                        if(err_1)throw err_1;
                        resolve({'data':wallet,'status':200,'msg':'Transaction Saved!!'});
                    });
                });       
            }
            else{
                resolve({'status': 304,'data':{},'msg': 'Error performing transaction!!'});
            }
        });
    });
};


let getTransactions = (walletID,details)=>{
    return new Promise((resolve,reject)=>{
        //the dates have a time component (default at 00:00 in the morning) which causes exclusiveness
        //Add one day to the end date or specify midnight of end date
        let qry= `select * from transaction where wallet_number=${walletID} and date>='${details.startDate}' and date <= '${details.stopDate}T23:59:59'`;
        if(details.tType!='all'){
            qry+=` and t_type='${details.tType}'`
        }
        db.query(qry,(err,results)=>{
            if(err) return reject(err);
            resolve({'data':results,'status':200,'msg':'Transactions Retrieved!!'});
        });
    });
};

let WALLET = {
    'createAgentWallet':createAgentWallet,
    'getWallet':getWallet,
    'debitWallet':debitWallet,
    'creditWallet':creditWallet,
    'getLoan':getLoan,
    'payLoan':payLoan,
    'getTransactions':getTransactions
}

module.exports = WALLET;