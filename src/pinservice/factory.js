const IPFS = require('ipfs');
const orbitdb = require('orbit-db')

const orbitDbInstances = {}
const ipfsInstances = {}

async function ipfs(name = 'default', config = undefined) {
    if(ipfsInstances[name] == undefined) {
        ipfsInstances[name] = await IPFS.create({
            repo: './ipfs',
            // relay: { enabled: true, hop: { enabled: true, active: true } },
            config: {
                Addresses: {
                Swarm: [
                    // TCP
                    "/ip4/0.0.0.0/tcp/4002",
                    "/ip4/127.0.0.1/tcp/4003/ws",
                    // Use IPFS/LibP2P dev signal servers
                    '/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star',
                    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
                ],
                }
            }
        });
    }
    return ipfsInstances[name]
}

async function orbitDb(ipfs, name = './orbitdb', config = undefined) {
    if(orbitDbInstances[name] == undefined) {
        orbitDbInstances[name] = await orbitdb.createInstance(ipfs, config)
    }
    return orbitDbInstances[name]
}


module.exports = {
    ipfs,
    orbitDb
}