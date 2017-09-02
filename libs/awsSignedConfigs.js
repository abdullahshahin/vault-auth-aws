const aws4 = require('aws4');

class awsSignedConfigs {
    constructor(args) {
        this.vaultHost = args.host;
        this.vaultAppName = args.vaultAppName;
        this.awsRequestUrl = 'https://sts.amazonaws.com/';
        this.awsRequestBody = 'Action=GetCallerIdentity&Version=2011-06-15';
    }
    getSignedRequest () {
        if(this.vaultHost) {
            var signedRequest = aws4.sign({
                service: 'sts',
                headers: {'X-Vault-AWS-IAM-Server-ID': this.vaultHost},
                body: this.awsRequestBody
            });
        }
        else {
           var signedRequest = aws4.sign({service: 'sts', body: this.awsRequestBody});
        }

        return signedRequest;
    }

    getSignedHeaders () {
        let headers = this.getSignedRequest();
        for (var header in headers) {
            if (typeof headers[header] === 'number') {
                headers[header] = headers[header].toString();
            }
            headers[header] = [headers[header]];
        }
        return headers;
    }

    getSignedConfigs() {
        let headers = this.getSignedHeaders();
        return {
            role: this.vaultAppName,
            iam_http_request_method: 'POST',
            iam_request_url: new Buffer(this.awsRequestUrl).toString('base64'),
            iam_request_body: new Buffer(this.awsRequestBody).toString('base64'),
            iam_request_headers: new Buffer(JSON.stringify(headers)).toString('base64')
        };
    }
}
module.exports = awsSignedConfigs;