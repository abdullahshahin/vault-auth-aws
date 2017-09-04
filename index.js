const configsClass = require('./libs/configs');
const awsSignedCongifs = require('./libs/awsSignedConfigs');
const request = require('request');

class vaultAwsAuth {

    constructor (args) {
        let configs = new configsClass(args);
        let validConfigs = configs.validateConfigs();
        if(!validConfigs.valid) {
            throw validConfigs.details;
        }
        this.configs = configs.getConfigs();
    }

    getOptions () {
        let awsLoginConfigs = new awsSignedCongifs({host:this.configs.host,vaultAppName:this.configs.vaultAppName});
        let options = {
            url: this.configs.uri,
            followAllRedirects: this.configs.followAllRedirects,
            body: JSON.stringify(awsLoginConfigs.getSignedConfigs())
        };
        if(this.configs.sslCertificate) {
            options['cert'] = this.configs.sslCertificate;
        }
        if(!this.configs.sslRejectUnAuthorized) {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        }
        return options;
    }

    authenticate () {
        return new Promise((resolve, reject) => {
            let options = this.getOptions();
            request.post(options, function (err, res, body) {
                if(err)
                    reject(err);
                else {
                    let result = JSON.parse(body);
                    if(result.errors)
                        reject(result);
                    else
                        resolve(result);
                }
            });
        });
    }
}

module.exports = vaultAwsAuth;
