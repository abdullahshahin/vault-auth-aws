# vault-auth-aws
[![Build Status](https://travis-ci.org/abdullahshahin/vault-auth-aws.png?branch=master)](https://travis-ci.org/abdullahshahin/vault-auth-aws)

A module for authenticating against Vault server by HashiCorp when running as AWS service such as Lambda using aws STS, Vault needs to be already configured to accept login attempts using this [method](https://www.vaultproject.io/docs/secrets/aws/index.html).

### install 
`npm install vault-auth-aws`

### Login
You can use below code to login to vault server from Lambda, by default vault application name is lambda name
```javascript
const vaultAuthClient = require('vault-auth-aws');
let vaultClient = new vaultAwsAuth({host: 'vault.example.com'});
vaultClient.authenticate()
        .then((success) => {
                const vault = require('node-vault')({
                apiVersion: config.apiVersion,
                endpoint: config.endpoint,
                token: success.auth.client_token,
            });
            // get your super secrets.
        })
        .catch((fail) => {
                // error here.
        });
```
if you want to specify the vault application name you can do
```javascript
let vaultClient = new vaultAwsAuth({host: 'vault.example.com', vaultAppName: 'mySuperSecerts'});
```
### options

- ssl: accepts boolean, specifying if the vault server operating under ssl, default false.
- host: vault host name or IP address.
- port: vault server port, default is 8200.
- apiVersion: vault server API endpoint version, default is v1.
- vaultLoginUrl: Vault login URL, default is auth/aws/login.
- vaultAppName: Vault application name, default is lambda name if any.
- followAllRedirects: accepts boolean, by default is true.
- certFilePath: path for a certificate that might be needed by the server.
- sslRejectUnAuthorized: accepts boolean, specified once the certificate is self-signed and cannot be verified, default is true.

### License (ISC)
Copyright 2017 Abdullah Shahin <eng.abd.shahin@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
