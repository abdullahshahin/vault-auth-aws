const configsClass = require('./libs/configs');
const awsSignedConfigs = require('./libs/awsSignedConfigs');
const request = require('got');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');

class VaultAwsAuth {

    constructor (args) {
        let configs = new configsClass(args);
        let validConfigs = configs.validateConfigs();
        if(!validConfigs.valid) throw validConfigs.details;
        this.configs = configs.getConfigs();
    }

    getOptions (creds) {
        let awsLoginConfigs = new awsSignedConfigs({host:this.configs.host,vaultAppName:this.configs.vaultAppName});
        let options = {
            url: this.configs.uri,
            followAllRedirects: this.configs.followAllRedirects,
            body: JSON.stringify(awsLoginConfigs.getSignedConfigs(creds))
        };
        if(this.configs.sslCertificate) {
            let https = options['https'] || {};
            https.certificate = this.configs.sslCertificate;
            options['https'] = https;
        }
        if(!this.configs.sslRejectUnAuthorized) {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        }
        if (this.configs.vaultNamespace) {
            options.headers = {
                "X-Vault-Namespace": this.configs.vaultNamespace,
            };
        }
        return options;
    }

    async authenticate () {
      const providerChain = defaultProvider();
      const creds = await providerChain();
      const options = this.getOptions(creds);

      try {
          const response = await request.post(options);
          const result = JSON.parse(response.body);
          if(result.errors) throw result;
          else return result;
      }
      catch (error) {
          if (error.response) {
              const ex = new Error(error.message);
              ex.body = JSON.parse(error.response.body);
              throw ex;
          }
          else throw error;
      }
  }
}

module.exports = VaultAwsAuth;
