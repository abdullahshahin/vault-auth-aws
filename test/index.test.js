const index = require('./../index');

let creds = {accessKeyId: '', secretAccessKey: ''};

describe('Testing index file functions', () => {
    it('1) options must be json', () => {
        let vaultAuth = new index(configs(0));
        let options = vaultAuth.getOptions(creds);
        let objectConstructor = {}.constructor;
        expect(options.constructor).toEqual(objectConstructor);
    });

    it('2) options must include at least url, followAllRedirects and body', () => {
        let vaultAuth = new index(configs(0));
        let options = vaultAuth.getOptions(creds);
        expect(typeof options['url']).toEqual('string');
        expect(typeof options['followAllRedirects']).toEqual('boolean');
        expect(typeof options['body']).toEqual('string');
    });

    it('3) if certFilePath was there then options must include cert', () => {
        let vaultAuth = new index(configs(1));
        let options = vaultAuth.getOptions(creds);
        expect(typeof options['url']).toEqual('string');
        expect(typeof options['followAllRedirects']).toEqual('boolean');
        expect(typeof options['body']).toEqual('string');
        expect(typeof options['cert']).toEqual('string');
    });

    it('4) if sslRejectUnAuthorized was false then NODE_TLS_REJECT_UNAUTHORIZED must be 0', () => {
        let vaultAuth = new index(configs(2));
        let options = vaultAuth.getOptions(creds);
        expect(process.env['NODE_TLS_REJECT_UNAUTHORIZED']).toEqual('0');
    });
});

function configs (index) {
    let configs = [{
        ssl: true,
        host: 'vault.example.com',
        vaultAppName: 'mySuperSecrets'
    },
    {
        ssl: true,
        host: 'vault.example.com',
        vaultAppName: 'mySuperSecrets',
        certFilePath: './test/mocks/cert.pem'
    },
    {
        ssl: true,
        host: 'vault.example.com',
        vaultAppName: 'mySuperSecrets',
        certFilePath: './test/mocks/cert.pem',
        sslRejectUnAuthorized: false
    }];

    return configs[index];
}
