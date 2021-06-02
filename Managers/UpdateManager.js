const fetch = require('node-fetch')

class UpdateManager {
    constructor(repo, currentversion){
        this.repo = repo
        this.currentversion = currentversion
    }

    async CheckForUpdates(){
        const releases = await fetch(`https://api.github.com/repos/${this.repo}/releases`).then(response => response.json())
    
        // if there are no releases for whatever reason, use dummy values to prevent a crash or the update message from appearing
        if(!releases.length) return [
            true,
            false,
            "CANNOT_FIND_RELEASE",
            "CANNOT_FIND_RELEASE"
        ]
    
        return [
            releases[0].tag_name === `v${this.currentversion}`,
            releases[0].prerelease,
            releases[0].tag_name,
            releases[0].html_url
        ]
    }
}

module.exports = UpdateManager