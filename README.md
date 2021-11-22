# wallet_transactions_api
A wallet based approach for handling agent loan disbursement and repayment. The API to meet the following requirements; Agents should have a reserved wallet number Agents can top up their wallets Agents can receive their loans in their wallets Agents can withdraw from their wallets Agents can repay their existing loans from their wallet Agents can retrieve a detailed list of all their wallet transactions


1. ### Create new agent 
    - endpoint: 
    ```
    'api/agent/create'
    ```
    - method ``` POST ```
    - body: 
    ```
    {
        'name':required {Full name},
        'email':required {Email},
        'password':required {password, min: 4}
    }
    ```
    - payload:
    ```
        'status': 200|304,
        'data':{},
        'msg': 'Agent Wallet Created'|'Email already exists'
    ```

2. ### Debit wallet with amount 
    - endpoint: 
    ```
    'api/wallet/{wallet_number}/debit/{amount}'
    ```
    - method ``` GET ```
    - body: 
    ```
    {}
    ```
    - payload:
    ```
    {
        'status': 200|304,
        'data':{
            'wallet_number': {Wallet Number},
            'wallet_amount': {Amount},
            'loan_owed': {Loan Owed},
            'created_at': {Date Created At},
            'last_modified': {Date Last Modified}
        } | {},
        'msg': 'Transaction Saved!!'|'Error performing transaction!!'
    }
    ```

3. ### Credit wallet with amount 
    - endpoint: 
    ```
    'api/wallet/{wallet_number}/credit/{amount}'
    ```
    - method ``` GET ```
    - body: 
    ```
    {}
    ```
    - payload:
    ```
    {
        'status': 200|304,
        'data':{
            'wallet_number': {Wallet Number},
            'wallet_amount': {Amount},
            'loan_owed': {Loan Owed},
            'created_at': {Date Created At},
            'last_modified': {Date Last Modified}
        } | {},
        'msg': 'Transaction Saved!!'|'Error performing transaction!!'
    }
    ```

4. ### Debit wallet with loaned amount 
    - endpoint: 
    ```
    'api/wallet/{wallet_number}/getLoan/{amount}'
    ```
    - method ``` GET ```
    - body: 
    ```
    {}
    ```
    - payload:
    ```
    {
        'status': 200|304,
        'data':{
            'wallet_number': {Wallet Number},
            'wallet_amount': {Amount},
            'loan_owed': {Loan Owed},
            'created_at': {Date Created At},
            'last_modified': {Date Last Modified}
        } | {},
        'msg': 'Transaction Saved!!'|'Error performing transaction!!'
    }
    ```

5. ### Repay loan from wallet
    - endpoint: 
    ```
    'api/wallet/{wallet_number}/payLoan/{amount}'
    ```
    - method ``` GET ```
    - body: 
    ```
    {}
    ```
    - payload:
    ```
    {
        'status': 200|304,
        'data':{
            'wallet_number': {Wallet Number},
            'wallet_amount': {Amount},
            'loan_owed': {Loan Owed},
            'created_at': {Date Created At},
            'last_modified': {Date Last Modified}
        } | {},
        'msg': 'Transaction Saved!!'|'Error performing transaction!!'
    }
    ```

6. ### Get wallet details by wallet 
    - endpoint: 
    ```
    'api/wallet'
    ```
    - method ``` POST ```
    - body: 
    ```
    {
        'email': {required},
        'password': {required}
    }
    ```
    - payload:
    ```
    {
        'status': 200|304,
        'data':{
            'name': {Agent Name},
            'email': {Agent Email},
            'wallet_number': {Wallet Number},
            'amount': {Wallet Amount},
            'loanOwed': {Wallet Loan Amount}
        } | {},
        'msg': 'Details retrieved'|'Error retrieving agent details.!!'
    }
    ```
7. ### Get transactions filtered by Start date, End date, Transaction Type 
    - endpoint: 
    ```
    'api/transaction/{walletID}'
    ```
    - method ``` GET ```
    - body: 
    ```
    {
        'startDate':required {Date},
        'stopDate':required {Date},
        'tType':required {Debit|Credit|Loan Debit|Loan Repayment}
    }
    ```
    - payload:
    ```
    [
        {
            'id': {Transaction ID},
            'wallet_number': {Wallet Number},
            'amount': {Amount},
            't_type': {Transaction Type}
        }
    ]
    ```

