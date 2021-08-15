const web3storage = require('web3.storage')
const ipfsDbLog = require('ipfs-log')


class Web3StoragePinService extends OrbitDbPinService {
    constructor(ipfs, apiKey, localDir = "./orbitdb") {
        super(ipfs, localDir)
        this._apiKey = apiKey
    }

    async initialize() {
        await super.initialize()
        this._web3storage = new web3storage.Web3Storage({ token: this._apiKey })
    }

    async _getLatestByName(address) {
        let latest = undefined

        for await (const item of this._web3storage.list()) {
            if(item.name == address) {
                if(latest === undefined) {
                    latest = item
                } else if(latest.created < item.created) {
                    latest = item
                }
            }
        }
        return latest
    }

    async _cloneDb(db) {
        const entry = await this._getLatestByName(db.id)
        const snapshot = await this._web3storage.get(entry.cid)
        const files = await snapshot.files()

        let contentJson = ""
        for await (const content of this._ipfs.cat(files[0].cid)) {
            contentJson += content.toString('utf8')
        }
        contentJson = JSON.parse(contentJson)
        const log = await ipfsDbLog.fromJSON(this._ipfs, db.identity, contentJson,  { access: db.access })

        await db._oplog.join(log)
        await db._updateIndex()

        // TODO: I'm unable to persist the snapshot data. This is a workaround, but
        // this changes the log.
        await db.remove(await db.add(""))

        return db
    }

    async pin(db) {
        const snapshot = await db._oplog.toSnapshot()
        const file = new web3storage.File([JSON.stringify(snapshot)], db.dbname, { type: 'text/plain' })

        const manifestCID = await this._web3storage.put([file], {
            name: db.id
        })
        return manifestCID
    }

    async unpin(db) {
        await this._web3storage.delete(db.id)
    }

    async status(db) {
        return await this._web3storage.status(db.id)
    }
}

module.exports = Web3StoragePinService