const aws4 = require('aws4');

class awsSignedConfigs {
    constructor(args) {
        this.vaultHost = args.host;
        this.vaultAppName = args.vaultAppName;
        this.awsRequestUrl = 'https://sts.amazonaws.com/';
        this.awsRequestBody = 'Action=GetCallerIdentity&Version=2011-06-15';
    }
    getSignedRequest (creds) {
        let awsCreds = {
            accessKeyId: creds.accessKeyId,
            secretAccessKey: creds.secretAccessKey
        };
        if (creds.sessionToken) {
            awsCreds.sessionToken = creds.sessionToken;
        }

        if(this.vaultHost) {
            return aws4.sign({
                service: 'sts',
                headers: {'X-Vault-AWS-IAM-Server-ID': this.vaultHost},
                body: this.awsRequestBody
            }, awsCreds);
        }

       return aws4.sign({service: 'sts', body: this.awsRequestBody}, awsCreds);
    }

    getSignedHeaders (creds) {
        let signedRequest = this.getSignedRequest(creds);
        let headers = signedRequest.headers;
        for (let header in headers) {
            if (typeof headers[header] === 'number') {
                headers[header] = headers[header].toString();
            }
            headers[header] = [headers[header]];
        }
        return headers;
    }

    getSignedConfigs(creds) {
        let headers = this.getSignedHeaders(creds);

        return {
            role: this.vaultAppName,
            iam_http_request_method: 'POST',
            iam_request_url: Buffer.from(this.awsRequestUrl).toString('base64'),
            iam_request_body: Buffer.from(this.awsRequestBody).toString('base64'),
            iam_request_headers: Buffer.from(JSON.stringify(headers)).toString('base64')
        };
    }
}
module.exports = awsSignedConfigs;
