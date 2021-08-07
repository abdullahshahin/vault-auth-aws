const expect = require('chai').expect,
      lab = exports.lab = require('@hapi/lab').script(),
      describe = lab.describe,
      it = lab.it;

const configsObject = require('./../libs/configs');

describe('Testing  Configuration files', () => {
    it('1) configs should be json format', () => {
        let myConfigs = new configsObject(validTestConfigs());
        let configs = myConfigs.getConfigs();
        let objectConstructor = {}.constructor;
        expect(configs.constructor).to.eq(objectConstructor);
    });

    it('2) configs must include ssl, host, port, apiVersion, vaultLoginUrl, vaultAppName, uri, followAllRedirects', () => {
        let myConfigs = new configsObject(validTestConfigs());
        let configs = myConfigs.getConfigs();
        expect(typeof configs.ssl).to.eq('boolean');
        expect(typeof configs.host).to.eq('string');
        expect(typeof configs.port).to.eq('number');
        expect(typeof configs.apiVersion).to.eq('string');
        expect(typeof configs.vaultLoginUrl).to.eq('string');
        expect(typeof configs.vaultAppName).to.eq('string');
        expect(typeof configs.uri).to.eq('string');
        expect(typeof configs.followAllRedirects).to.eq('boolean');
    });

    it('3) sslCertificate must be included in configs if certFilePath was included', () => {
        let myConfigs = new configsObject(validTestConfigsWithCert());
        let configs = myConfigs.getConfigs();
        expect(typeof configs.ssl).to.eq('boolean');
        expect(typeof configs.host).to.eq('string');
        expect(typeof configs.port).to.eq('number');
        expect(typeof configs.apiVersion).to.eq('string');
        expect(typeof configs.vaultLoginUrl).to.eq('string');
        expect(typeof configs.vaultAppName).to.eq('string');
        expect(typeof configs.uri).to.eq('string');
        expect(typeof configs.followAllRedirects).to.eq('boolean');
        expect(typeof configs.sslCertificate).to.eq('string');
    });

    it('4.1) configs validate must check the type of values of configs entered by the user, ssl part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(0));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('ssl must be boolean true or false');
    });

    it('4.2) configs validate must check the type of values of configs entered by the user, host part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(1));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('host must be an IP address or fully qualified domain name');
    });

    it('4.3) configs validate must check the type of values of configs entered by the user, port part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(2));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('port is a number and must be within 1 to 65536');
    });

    it('4.4) configs validate must check the type of values of configs entered by the user, apiVersion part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(3));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('API version is either v1 or v2');
    });

    it('4.5) configs validate must check the type of values of configs entered by the user, vaultAppName part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(4));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('vaultAppName must be string');
    });

    it('4.6) configs validate must check the type of values of configs entered by the user, followAllRedirects part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(5));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('followAllRedirects must be boolean');
    });

    it('4.7) configs validate must check the type of values of configs entered by the user, vaultLoginUrl part', () => {
        let myConfigs = new configsObject(inValidTestConfigs(6));
        let validated = myConfigs.validateConfigs();
        expect(validated.valid).to.be.false;
        expect(validated.details).to.eq('vaultLoginUrl must be string');
    });
});

function validTestConfigs() {
    return {
        ssl: true,
        host: 'example.vault.com',
        vaultAppName: 'mySuperSecrets'
    };
}

function validTestConfigsWithCert() {
    return {
        ssl: true,
        host: 'vault.example.com',
        vaultAppName: 'mySuperSecrets',
        certFilePath: './test/mocks/cert.pem'
    };
}

function inValidTestConfigs (index) {
    let invalidConfigs = [
        {
            ssl: "yes",
            host: 'vault.example.com',
            vaultAppName: 'mySuperSecrets',
            certFilePath: './test/mocks/cert.pem'
        },
        {
            ssl: true,
            host: 'http://vault.example.com',
            vaultAppName: 'mySuperSecrets',
            certFilePath: './test/mocks/cert.pem'
        },
        {
            ssl: true,
            host: 'vault.example.com',
            vaultAppName: 'mySuperSecrets',
            port: 123124412321
        }
        ,
        {
            ssl: true,
            host: 'vault.example.com',
            vaultAppName: 'mySuperSecrets',
            apiVersion: 1
        },
        {
            ssl: true,
            host: 'vault.example.com',
            vaultAppName: true
        },
        {
            ssl: true,
            host: 'vault.example.com',
            vaultAppName: 'mySuperSecrets',
            followAllRedirects: 'true'
        },
        {
            ssl: true,
            host: 'vault.example.com',
            vaultAppName: 'mySuperSecrets',
            vaultLoginUrl: true
        }
    ];
    return invalidConfigs[index];
}
