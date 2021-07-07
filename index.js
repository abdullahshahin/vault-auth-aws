const AWS = require('aws-sdk');
const configsClass = require('./libs/configs');
const awsSignedCongifs = require('./libs/awsSignedConfigs');
const request = require('got');

class vaultAwsAuth {

    constructor (args) {
        let configs = new configsClass(args);
        let validConfigs = configs.validateConfigs();
        if(!validConfigs.valid) {
            throw validConfigs.details;
        }
        this.configs = configs.getConfigs();
    }

    getOptions (creds) {
        let awsLoginConfigs = new awsSignedCongifs({host:this.configs.host,vaultAppName:this.configs.vaultAppName});
        let options = {
            url: this.configs.uri,
            followAllRedirects: this.configs.followAllRedirects,
            body: JSON.stringify(awsLoginConfigs.getSignedConfigs(creds))
        };
        if(this.configs.sslCertificate) {
            // options['cert'] = this.configs.sslCertificate;
            let https = options['https'] || {};
            https.certificate = this.configs.sslCertificate;
            options['https'] = https;
        }
        if(!this.configs.sslRejectUnAuthorized) {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        }
        return options;
    }

    async authenticate () {
      const providerChain = new AWS.CredentialProviderChain();
      let creds = await providerChain.resolvePromise();
      let options = this.getOptions(creds);

      try {
          const response = await request.post(options);
          let result = JSON.parse(response.body);
          if(result.errors) {
              throw result;
          }
          else {
              return result;
          }
      }
      catch (error) {
          if (error.response) {
              let ex = new Error(error.message);
              ex.body = JSON.parse(error.response.body);
              throw ex;
          }
          else {
              throw error;
          }
      }
  }
}

module.exports = vaultAwsAuth;
