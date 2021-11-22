$(document).ready(()=>{
    $('#btn').click(()=>{
        let qry = $("#input").val();
        if(qry.length<2)return;
        let url = "/api/course";
        let body = {'input':qry};
        $.get(url,body,(data,status)=>{
            let results = $("#result");
            console.log(status);
            results.html(JSON.stringify(data) + ' ' + status);
            
            });
            //console.log(data);
        })
    });

let verify = (theForm)=>{
    let msg = $('#msg');
    let details = {
        'name':theForm['name'].value,
        'email':theForm['email'].value,
        'password':theForm['password'].value,
        'confirmPassword':theForm['confirmPassword'].value
    }
    for(x in details){
        if(details[x]==''){
            msg.attr('class', 'error');
            msg.html("Form is incomplete!");
            msg.show();
            return false;
        }
    }
    if(details['password']!=details['confirmPassword']){
        msg.attr('class', 'error');
        msg.html("Passwords Do Not Match!!");
        msg.show();
        return false;
    }
    
    let url= '/api/agent/create';
    $.post(url,details,(data,status)=>{
        if(status=='success'){
            msg.html(data.msg);
            msg.attr('class', 'success');
        }
        else{
            msg.html("Error creating agent wallet!!");
            msg.attr('class', 'error');
        }
        },'json'
      );

    
    msg.show();
    return false;
}

let getWallet = (theForm)=>{
    let msg = $('#msg2');
    let details = {
        'email':theForm['email'].value,
        'password':theForm['password'].value
    }
    for(x in details){
        if(details[x]==''){
            msg.attr('class', 'error');
            msg.html("Form is incomplete!");
            msg.show();
            return false;
        }
    }

    let url= '/api/wallet/';
    $.post(url,details,(data,status)=>{
        if(status=='success'){
            msg.html(data.msg);
            $('#showName').html(data.data.name);
            $('#showEmail').html(data.data.email);
            $('#showWalletNumber').html(data.data.wallet_number);
            $('#showAmount').html(data.data.amount);
            $('#showLoan').html(data.data.loanOwed);
            msg.attr('class', 'success');
            $('.walletDetails').show();
        }
        else{
            msg.html("Error getting agent wallet!!");
            msg.attr('class', 'error');
            $('.walletDetails').hide();
        }
        },'json'
      );

    
    msg.show();
    return false;

}

let performTransaction = (theForm)=>{
    let msg = $('#msg3');
    let details = {
        'amount':theForm['amount'].value,
        'walletNumber':parseInt($('#showWalletNumber').html())
    }
    let tType = theForm['tType'].value;
    for(x in details){
        //console.log(details[x]);
        if(details[x]=='' || isNaN(details[x])){
            msg.attr('class', 'error');
            msg.html("Form is incomplete!");
            msg.show();
            return false;
        }
    }
    //console.log(tType);
    let url=`api/wallet/${details.walletNumber}/`;
    switch (tType) {
        case 'deposit':
            url+='debit/';
            break;
        case 'withdraw':
            url+='credit/';
            break;
        case 'getLoan':
            url+='getLoan/';
            break;
        case 'payLoan':
            url+='payLoan/';
            break;
        default:
            return false;
    }
    url+=details.amount;
    
    $.get(url,(data,status)=>{
        if(status=='success'){
            //console.log(data);
            msg.html(data.msg);
            msg.attr('class', 'success');
        }
        else{
            //console.log(status);
            msg.html("Error Performing transaction!!");
            msg.attr('class', 'error');
        }
        },'json'
      );

    msg.show();
    return false;
}

let getTransactions = (theForm)=>{
    let msg = $('#msg4');
    let details = {
        'startDate':theForm['startDate'].value,
        'stopDate':theForm['stopDate'].value,
        'tType':theForm['type'].value
    }
    let walletID = parseInt($('#showWalletNumber').html());
    if(isNaN(walletID)){
        msg.attr('class', 'error');
        msg.html("Wallet ID is undefined!");
        msg.show();
        return false;
    }
    for(x in details){
        if(details[x]==''){
            msg.attr('class', 'error');
            msg.html("Form is incomplete!");
            msg.show();
            return false;
        }
    }
    //console.log(tType);
    let url=`api/transaction/${walletID}/`;
    
    $.get(url,details,(data,status)=>{
        if(status=='success'){
            console.log(data);
            msg.html(data.msg);
            msg.attr('class', 'success');
            $('#results').html(JSON.stringify(data.data));
        }
        else{
            //console.log(status);
            msg.html("Error Performing transaction!!");
            msg.attr('class', 'error');
        }
        },'json'
      );

    msg.show();
    return false;
}