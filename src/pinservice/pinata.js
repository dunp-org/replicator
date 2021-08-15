class PinataPinService extends OrbitDbPinService {
    constructor(ipfs, localDir = "./orbitdb", apiKey) {
        super(ipfs, localDir)
    }
}

module.exports = PinataPinService