# vault-auth-aws
a module for authenticate against Vault server by HashiCorp when running as AWS service such as Lambda using aws STS, Vault needs to be already configured to accept login attempts using this method.

### install 
npm install vault-auth-aws

### Login

const vaultAuthClient = require('vault-auth-aws');
let vaultClient = new vaultAwsAuth({host: 'vault.example.com'});
vaultClient.authenticate()
        .then((sucess) => {
            // code here
        })
        .catch((fail) => {
            // error here
        });