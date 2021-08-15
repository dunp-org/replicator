const factory = require('./factory')

class SecondaryOrbitDbPinService extends OrbitDbPinService {
    constructor(ipfs, localDir = "./orbitdbpinservice") {
        super(ipfs, localDir)
    }

    async initialize() {
        this._orbitDb = factory.orbitDb(this._ipfs, this._localDir, { directory: this._localDir })
    }

    async _cloneDb(address) {
        const db = await this._orbitdb.open(address)
        await db.load()
    }

    async pin(address) {
        await this._cloneDb(address)
    }

    async unpin(address) {
        const db = await this._orbitdb.open(address)
        await db.drop()
    }

    async status(address) {
        try {
            await this._orbitdb.open(address, { localOnly: true })
            return true
        }
        catch (e) {
            return false
        }
    }
}

module.exports = SecondaryOrbitDbPinService