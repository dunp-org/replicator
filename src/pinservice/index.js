class OrbitDbPinService {
    constructor(ipfs, localDir = undefined) {
        this._localDir = localDir
        this._ipfs = ipfs
        this._orbitdb = undefined
    }

    async initialize() {
    }

    async _cloneDb(db) {  throw new Error('Not implemented') }
    async pin(db) { throw new Error('Not implemented') }
    async unpin(db) { throw new Error('Not implemented') }
    async status(db) { throw new Error('Not implemented') }
}

class PinServiceManager {
    constructor() {
        this._services = {}
    }

    async addService(name, service) {
        this._services[name] = service
    }

    async removeService(name) {
        delete this._services[name]
    }

    async pin(address) {
        // pin on all available services
    }

    async unpin(address) {
        // unpin on all available services
    }

    async status(address) {
        // get the status for all available services
    }
}


module.exports = {
    OrbitDbPinService,
    PinServiceManager,
    LocalIPFSPinService: require('./localipfs'),
    SecondaryOrbitDbPinService: require('./secondaryorbitdb'),
    Web3StoragePinService: require('./web3storage')
}