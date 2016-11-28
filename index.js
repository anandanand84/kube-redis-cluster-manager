var K8s = require('k8s');
var fs  = require('fs');
var Redis = require('ioredis');
const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
var token = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token').toString();
var env = process.env;
var kubeapi = K8s.api({
    endpoint: 'https://'+env.KUBERNETES_SERVICE_HOST,
    version: '/api/v1',
    auth : {
        token : token
    },
    strictSSL : false
});


kubeapi.watch('watch/namespaces/default/endpoints/redis').subscribe(data=> {
    try {
        for (let node of data.object.subsets) {
            let ipAddressInfo = node.addresses;
            for (let addressInfo of ipAddressInfo) {
                let ip = addressInfo.ip;
                let result = execSync('/usr/bin/redis-cli  -h ' + ip + ' cluster meet ' + ipAddressInfo[0].ip + ' 6379')
                console.log(result.toString());
            };

        }
    }
    catch (err) {
        console.error(err);
    }
}, err=>{
    console.error(err); 
});
