const expect = require('chai').expect,
      lab = exports.lab = require('@hapi/lab').script(),
      describe = lab.describe,
      it = lab.it;

const awsSignedConfigs = require('./../libs/awsSignedConfigs');
const validator = require('validator');

let creds = {accessKeyId: '', secretAccessKey: ''};

describe('Testing AWS Signed Configs', () => {
    it('1) aws signed configs must be json object',() => {
        let configs = new awsSignedConfigs(testValidConfig());
        let objectConstructor = {}.constructor;
        expect(configs.getSignedConfigs(creds).constructor).to.eq(objectConstructor);
    });

    it('2) aws signed configs must include role as string, iam_http_request_method must be POST, iam_request_url must be base64, iam_request_body must be base64 and iam_request_headers must be base64',() => {
        let configs = new awsSignedConfigs(testValidConfig());
        configs = configs.getSignedConfigs(creds);
        expect(typeof configs['role']).to.eq('string');
        expect(configs['iam_http_request_method']).to.eq('POST');
        expect(validator.isBase64(configs['iam_request_url'])).to.be.true;
        expect(validator.isBase64(configs['iam_request_body'])).to.be.true;
        expect(validator.isBase64(configs['iam_request_headers'])).to.be.true;
    });
});

function testValidConfig() {
    return {
        host: 'vault.example.com',
        vaultAppName: 'superSecrets'
    };
}
