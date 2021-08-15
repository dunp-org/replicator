const ipfs = require('ipfs')

class LocalIPFSPinService extends OrbitDbPinService {
    constructor(ipfs, localDir = "./orbitdb") {
        super(ipfs, localDir)
    }

    async _cloneDb(db) {
        await db.loadFromSnapshot()
    }

    async pin(db) {
        const snapshot = await db.saveSnapshot()
        const snapshotCID = new ipfs.CID(snapshot[0].hash)
        const result = await this._ipfs.pin.add(snapshotCID)
        return result
    }

    async unpin(db) {
        let snapshot = await db._cache.get(db.snapshotPath)
        const snapshotCID = new ipfs.CID(snapshot.hash)
        await this._ipfs.pin.rm(snapshotCID)
    }

    async status(db) {
        let snapshot = await db._cache.get(db.snapshotPath)

        for await (const { cid, type } of this._ipfs.pin.ls()) {
            if(cid == snapshot.hash) {
                return true
            }
        }
        return false
    }
}

module.exports = LocalIPFSPinService