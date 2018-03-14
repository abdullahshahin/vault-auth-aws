const fs = require('fs');
const validator = require('validator');

class configs {
    constructor(args) {
        this.ssl = args.ssl || false;
        this.host = args.host;
        this.port = parseInt(args.port) || 8200;
        this.apiVersion = args.apiVersion || 'v1';
        this.vaultLoginUrl = args.vaultLoginUrl || 'auth/aws/login';
        this.vaultAppName = args.vaultAppName || process.env.AWS_LAMBDA_FUNCTION_NAME;
        this.followAllRedirects = args.followAllRedirects || true;
        this.certFilePath = args.certFilePath;
        this.sslRejectUnAuthorized = args.sslRejectUnAuthorized===undefined||args.sslRejectUnAuthorized===true?true:false;
    }
    validateConfigs () {
        if(typeof this.ssl !== 'boolean')
            return {
                valid: false,
                details: 'ssl must be boolean true or false'
            };
        if(!validator.isFQDN(this.host) && !validator.isIP(this.host)) {
            return {
                valid: false,
                details: 'host must be an IP address or fully qualified domain name'
            };
        }
        if(typeof this.port !== 'number' || this.port < 1 || this.port > 65536) {
            return {
                valid: false,
                details: 'port is a number and must be within 1 to 65536'
            };
        }
        if(this.apiVersion !== 'v1' && this.apiVersion !== 'v2') {
            return {
                valid: false,
                details: 'API version is either v1 or v2'
            };
        }
        if(typeof this.vaultLoginUrl !== 'string') {
            return {
                valid: false,
                details: 'vaultLoginUrl must be string'
            };
        }
        if(typeof this.vaultAppName !== 'string') {
            return {
                valid: false,
                details: 'vaultAppName must be string'
            };
        }
        if(typeof this.followAllRedirects !== 'boolean') {
            return {
                valid: false,
                details: 'followAllRedirects must be boolean'
            };
        }
        return { valid: true };
    }
    getConfigs () {
        this.vaultLoginUrl = encodeURI(this.vaultLoginUrl);
        let urlPrefix = this.ssl?'https://':'http://';
        this.uri = urlPrefix+this.host+':'+this.port+'/'+this.apiVersion+'/'+this.vaultLoginUrl;
        if(this.certFilePath) {
            this.sslCertificate = fs.readFileSync(this.certFilePath,'utf8');
        }
        let finalConfigs = {
            ssl: this.ssl,
            host: this.host,
            port: this.port,
            apiVersion: this.apiVersion,
            vaultLoginUrl: this.vaultLoginUrl,
            vaultAppName: this.vaultAppName,
            uri: this.uri,
            followAllRedirects: this.followAllRedirects,
            sslRejectUnAuthorized: this.sslRejectUnAuthorized
        };
        if(this.certFilePath)
            finalConfigs['sslCertificate'] = this.sslCertificate;
        return finalConfigs;
    }
}
module.exports = configs;
