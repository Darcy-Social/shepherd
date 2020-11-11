const $rdf = require('rdflib');

const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
const NS = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#")

const SolidAclUtils = require('solid-acl-utils')

const { AclApi, AclParser, Permissions, Agents } = SolidAclUtils;
const { READ, WRITE, CONTROL, APPEND } = Permissions;

const auth = require("solid-auth-client");

var log = (...data) => {
    
}

class Ibex {
    fetchCount = 0;
    me = null;
    myHost = null;
    myRootPath = 'is.darcy';
    feedLocation = "feed";
    defaultFeed = 'main';
    manifestFileBasename = 'manifest.json'
    profileFileBasename = 'profile.json'
    settingsFileBasename = 'config.json'

    constructor(me) {
        this.me = me;
        this.myHost = this.urlDomain(me);


    }
    root() { return this.myHost + '/' + this.myRootPath + '/'; }
    feedRoot() { return this.root() + this.feedLocation + '/'; }
    manifestFile() { return this.feedRoot() + this.manifestFileBasename; }
    profileFile() { return this.root() + this.profileFileBasename; }
    configFile() { return this.root() + this.settingsFileBasename; }

    loadSettings() {
        return this.willFetch(this.configFile()).then(
            (res) => res.json()
        ).catch(() => { return {} })
    }

    saveSettings(settings) {
        return this.willFetch(
            this.configFile(), {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings, null, 2)
        })
    }

    getPostText(url) { return this.getText(url); }
    getText(url) {
        return this.willFetch(url).then(
            (res) => res.text()
        )
    }

    deletePost(url) {
        return this.delete(url)
    }
    delete(url) {
        return this.willFetch(url, { method: 'DELETE' })
    }
    loadAcl(url) {
        return new AclApi(auth.fetch.bind(auth), { autoSave: true }).loadFromFileUrl(url);
    }

    makePath(container, newFolder) {

        if (newFolder) {
            container += '/' + newFolder;
        }

        [newFolder, container] = basePath(container);

        //log('mkdir', container, newFolder);

        let path = container + newFolder;
        return this.willFetch(path).
            catch(() => {
                //log(`let's see if ${container} exists first...`);
                return this.makePath(container).then(
                    () => {

                        //log(`we did not find path '${path}', let's try to create '${newFolder}' in '${container}'`);

                        return this.willFetch(
                            container,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'text/turtle', 'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"', "Slug": newFolder }
                            }
                        ).then(res => {
                            if (res.url == this.root()) {
                                return this.ensureACL(res.url).then(() => this.willFetch(path))
                            }
                            return this.willFetch(path)
                        });
                    });
            });
    }
    createFeed(feedName) {
        //log("creating feed", feedName)
        return this.makePath(this.feedRoot(), feedName)
            .then((res) => {
                return this.makePath(res.url + "contrib/").then(
                    () => this.setFeedPermissions(res.url, [], undefined, undefined)
                        .then(() => this.manifest())
                        .then(manifest => {
                            manifest[res.url] = manifest[res.url] || { listedDate: new Date() };
                            return this.saveManifest(manifest)
                        })
                        .then(() => this.willFetch(res.url))
                )
            })

    }
    /**
     * 
     * @param {string} feedUrl 
     * @param {*} writers - array of webids, if undefined only owner can write
     * @param {*} readers - array of webids, if undefined public readable
     *
     * @param {*} commenters - array of webids, if undefined only authenticated users can comment
     */
    async setFeedPermissions(feedUrl, writers = undefined, readers = undefined, commenters = undefined) {

        let groupFile = await this.setupFeedGroupFile(
            feedUrl,
            Array.isArray(writers) ? writers : [],
            Array.isArray(readers) ? readers : [],
            Array.isArray(commenters) ? commenters : [],
        );


        let feedPermissions = [
            [[READ, WRITE, CONTROL], groupFile + "#writers"],
            [READ, groupFile + "#readers"],
            [READ, groupFile + "#commenters"]
        ];
        let feedRemovePermissions = [];
        if (!readers) {
            feedPermissions.push([READ, Agents.PUBLIC])
        } else {
            feedRemovePermissions.push([READ, Agents.PUBLIC])
        }
        this.ensureACL(feedUrl, feedPermissions, feedRemovePermissions);

        let contribPermissions = [
            [[READ, WRITE, CONTROL], groupFile + "#writers"],
            [READ, groupFile + "#readers"],
            [[READ, APPEND], groupFile + "#commenters"]
        ];
        let contribRemovePermissions = [];
        if (!commenters) {
            contribPermissions.push([APPEND, Agents.AUTHENTICATED])
        } else {
            contribRemovePermissions.push([APPEND, Agents.AUTHENTICATED])
        }
        if (!readers) {
            contribPermissions.push([READ, Agents.PUBLIC])
        } else {
            contribRemovePermissions.push([READ, Agents.PUBLIC])
        }
        this.ensureACL(feedUrl + "contrib/", contribPermissions, contribRemovePermissions);

        return;

    }

    async setupFeedGroupFile(feedUrl, writers = [], readers = [], commenters = []) {
        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store);
        const updater = new $rdf.UpdateManager(store)

        let docURI = feedUrl + 'groups.ttl';

        // doc is actually the whole document, not just the why
        let doc = store.sym(docURI);

        let writersGroup = store.sym(docURI + '#writers');
        store.add(writersGroup, RDF('type'), NS("Group"), doc)
        store.add(writersGroup, NS("hasMember"), store.sym(this.me), doc);
        writers.forEach(w => store.add(writersGroup, NS("hasMember"), store.sym(w), doc))
        //store.add(writersGroup, NS("hasMember"), store.sym("https://tsojcanth.darcypod.com:8443/profile/card#me"), doc)

        let readersGroup = store.sym(docURI + "#readers")
        store.add(readersGroup, RDF('type'), NS("Group"), doc)
        store.add(readersGroup, NS("hasMember"), store.sym(this.me), doc);
        readers.forEach(r => store.add(readersGroup, NS("hasMember"), store.sym(r), doc))

        let commentersGroup = store.sym(docURI + "#commenters")
        store.add(commentersGroup, RDF('type'), NS("Group"), doc)
        store.add(commentersGroup, NS("hasMember"), store.sym(this.me), doc);
        commenters.forEach(c => store.add(commentersGroup, NS("hasMember"), store.sym(c), doc))

        let k = await updater.put(
            doc,
            store.statementsMatching(undefined, undefined, undefined, doc),
            'text/turtle',
            function (uri, ok, message) {
                if (!ok) {
                    log("fail to update group " + uri, ok, message)
                } else {
                    //console.log("group doc ", docURI, " set up", ok, message)
                }
            }
        )

        return docURI;
    }
    ensureACL(url, newAcls = [], removeAcls = []) {
        return this.loadAcl(url)
            .then(async (acl) => {

                let ensureRule = (privilege, agent) => {
                    if (url.endsWith('/')) {

                        if (!acl.hasDefaultRule(privilege, agent)) {
                            acl.addDefaultRule(privilege, agent)
                        }
                    } else {
                        if (!acl.hasRule(privilege, agent)) {
                            acl.addRule(privilege, agent)
                        }
                    }
                }

                ensureRule([WRITE, READ, CONTROL], this.me);
                newAcls.forEach((anAclRule) => ensureRule(...anAclRule));

                removeAcls.forEach((anAclRule) => { log(acl.deleteRule(...anAclRule)) })

                // const parser = new AclParser({ url, url })
                // const newTurtle = await parser.aclDocToTurtle(acl);
                // console.log(newTurtle)
                return acl.saveToPod()
            })
    }
    manifest() {
        return this.willFetch(this.manifestFile())
            .then((res) => res.json())
            .catch(() => { return {} });
    }
    saveManifest(manifest) {
        return this.willFetch(
            this.manifestFile(), {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(manifest, null, 2)
        })
            .then(() => this.ensureACL(this.manifestFile(), [[READ, Agents.PUBLIC]]))
    }
    profile() {
        return this.willFetch(this.profileFile())
            .then((res) => res.json())
            .catch(() => { return {} });
    }
    saveProfile(profile) {
        return this.willFetch(
            this.profileFile(), {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile, null, 2)
        })
            .then(() => this.ensureACL(this.profileFile(), [[READ, Agents.PUBLIC]]))
    }

    deleteRecursive(folder, onlyFiles = false) {
        //console.log("deleting " + folder)
        if (!folder.startsWith(this.root())) {
            return Promise.reject("Invalid path: can't delete " + folder.uri)
        }
        return this._deleteRecursive($rdf.sym(folder), onlyFiles)
            .then(() => this.manifest()
                .then(manifest => {
                    if (manifest[folder]) {
                        //log("deleting", folder, "from manifest")
                        delete manifest[folder];
                        return this.saveManifest(manifest);
                    }
                }))
    }

    _deleteRecursive(folder, onlyFiles = false) {

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store);

        return new Promise((resolve, reject) => {
            fetcher.load(folder).then(() => {
                //log(store.each(folder, LDP('contains'), null));

                let promises = store.each(folder, LDP('contains'), null).map(file => {
                    if (store.holds(file, RDF('type'), LDP('BasicContainer'))) {
                        return this._deleteRecursive(file, onlyFiles)
                    } else {
                        return fetcher.webOperation('DELETE', file.uri)
                    }
                });

                return Promise.all(promises)
                    .then(() => {
                        if (!onlyFiles) {
                            //console.log("deleting directory " + folder.uri);
                            return fetcher.webOperation('DELETE', folder.uri)
                        }
                    })
                    .then(res => { resolve() })
            })
        })
    }

    createPost(content, feed, slug, nocomment, dateOfPosting) {
        if (!content) { return Promise.reject("Missing content, won't publish") }
        feed = feed || this.defaultFeed;
        nocomment = nocomment || false;

        dateOfPosting = dateOfPosting || new Date();

        slug = urlflatten(slug || ts(dateOfPosting));

        let feedPath = this.feedRoot() + feed + '/';

        let postPath = feedPath + cdnPathFromDate(dateOfPosting) + '/';

        let postUri = postPath + slug + ".md";

        return this.willFetch(feedPath)
            .then(() => this.makePath(postPath))
            .then(
                () => this.willFetch(
                    postUri, {
                    method: 'PUT', headers: { 'Content-Type': 'text/plain' },
                    body: content
                })
            )
    }

    listFriends(webid) {
        /**
         * grabs the webids this person has as so-called friends
         * might be worth to cache the result
         *
         * @param {String} webid
         *
         * example: listFriends("https://gaia.solid.community/profile/card#me").then(console.log);
         */
        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store);

        return fetcher.load(webid).then(
            () => {
                return store.each($rdf.sym(webid), FOAF('knows'))
            }
        );
    }

    /**
     * returns a nice url-compatible date string
     * @param {Date} date
     */
    ts(date) {
        date = date || new Date;
        return date.toISOString().replace(/:/g, '.');
    }




    urlDomain(url) {
        //log("getting domain of ", url);
        var a = document.createElement('a');

        a.href = url;

        return a.protocol + '//' + a.hostname + (!a.port ? '' : (":" + a.port));
    }

    willFetch(url, pars) {
        this.fetchCount++;
        pars = pars || {};
        pars.method = pars.method || 'GET';

        return new Promise(
            (resolve, reject) => {
                auth.fetch(
                    url,
                    pars
                ).then(response => {
                    ///log("fetch:", pars.method, url, " response:", response.status, response.statusText);
                    if (!response || (response.status !== 201 && response.status !== 200)) {
                        //log(url, "result:", response.status, response.statusText);
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
            }
        );
    }

}

function basePath(path) {
    const separator = "/";
    if (path.slice(-1) == separator) {
        path = path.slice(0, -1);
    }
    const lastSeparatorPosition = path.lastIndexOf(separator);

    return [
        path.substr(lastSeparatorPosition + 1),
        path.substr(0, lastSeparatorPosition + 1),
    ];
}

function urlflatten(s) {
    return encodeURIComponent(s);
    //return s.replace(/[^a-zA-Z0-9_]/, '-');
}

function ts(date) {
    date = date || new Date;
    return date.toISOString().replace(/:/g, '.');
}
function cdnPathFromDate(aDate = new Date()) {
    return [
        ("" + aDate.getFullYear()).padStart(4, '0'),
        ("" + (1 + aDate.getMonth())).padStart(2, '0'),
        ("" + aDate.getDate()).padStart(2, '0')
    ].join('/');
}



class FeedLoader {
    myUrl = null;
    urlOrigin = null;
    myPosts = [];
    loading = null;
    constructor(feedUrl, dateOrigin = new Date()) {
        this.myUrl = feedUrl;
        this.urlOrigin = feedUrl + cdnPathFromDate(dateOrigin) + '/zzzzzzzzzzzzzzzz';
    }
    url() { return this.myUrl; }
    posts() { return this.myPosts }
    first() { return this.myPosts[0] || this.urlOrigin; }
    last() { return this.myPosts[this.myPosts.length - 1] || this.urlOrigin; }

    async loadOlder(postsToList = 10) {
        return await this.load(postsToList, true);
    }
    async loadNewer(postsToList = 10) {
        return await this.load(postsToList, false);
    }
    isLoading() { return this.loading; }

    async load(postsToList = 10, loadOlderPosts = true) {
        if (this.loading) { throw "Loader is busy loading " + this.url(); }
        this.loading = true;
        let that = this;

        try {
            let folderLister = async function (path) {

                let loaderCursor = new LoaderCursor(loadOlderPosts);
                await loaderCursor.load(path);

                let aFile = null;

                while (
                    (aFile = loaderCursor.next())
                    &&
                    (postsToList)
                ) {
                    if (!basePath(aFile.uri)[0].match(/^[0-9]/)) {
                        //console.log("skipping ", aFile.uri);
                        continue;
                    }
                    if (loadOlderPosts && aFile.uri >= that.first()) {
                        //log("skipping newer when looking for older:", aFile.uri, '>', that.first())
                        continue;
                    }
                    if (!loadOlderPosts && aFile.uri <= that.last()) {
                        if (!(loaderCursor.isDirectory(aFile) && !that.last().startsWith(aFile))) {
                            //log("skipping older when looking for newer: ", aFile.uri, '<', that.last())
                            continue;
                        }
                        //log("almost skipped", aFile.uri)
                    }

                    if (loaderCursor.isDirectory(aFile)) {
                        // delve deeper
                        try {
                            await folderLister(aFile);
                        } catch { }
                    } else {
                        postsToList--;

                        if (aFile.uri < that.first()) {
                            that.myPosts.unshift(aFile.uri);
                        } else {
                            that.myPosts.push(aFile.uri);
                        }
                        //log("added", aFile.uri)
                    }
                }
            }
            await folderLister($rdf.sym(this.url()));
        }
        finally {
            this.loading = false;
        }
        return this.myPosts;
    }
}

class LoaderCursor {
    constructor(loadOlderPosts = true) {
        this.loadOlderPosts = loadOlderPosts;
        this.store = $rdf.graph();
        this.fetcher = new $rdf.Fetcher(this.store);
    }
    async load(path) {
        await this.fetcher.load(path);
        this.folderItems = this.store.each(path, LDP("contains"), null);
    }
    next() { return this.loadOlderPosts ? this.folderItems.pop() : this.folderItems.shift() }
    isDirectory(path) { return this.store.holds(path, RDF('type'), LDP('BasicContainer')) }

}

class FeedStreamer {
    constructor(url, dateStarting = new Date()) {
        this.loader = new FeedLoader(url, dateStarting);

        this.olderId = -1;
        this.newerId = 0;
    }
    url() { return this.loader.url() }
    isLoading() { return this.loader.isLoading() }

    async _load(postsToList = 10, loadOlderPosts = true) {

        //log("loading", postsToList, (loadOlderPosts ? "older" : "newer"), "posts")
        if (loadOlderPosts && this.reachedFirstPost) {
            // log("reached end of the feed", this.url());
            return []
        }
        let loadCountBeforeLoad = this.loadedCount();
        let loadedPosts = []
        //log("Before _load: count", this.loadedCount(), " olderId", this.olderId, "newerId", this.newerId);
        try {
            loadedPosts = await this.loader.load(postsToList, loadOlderPosts);
        } catch {
            log("problems loading feed ", this.url());
            return []
        }

        if (loadOlderPosts) {
            let delta = this.loadedCount() - loadCountBeforeLoad;
            //repoint
            if (delta) {
                this.olderId += delta;
                this.newerId += delta;
            } else {
                //loaded successfully 0 older posts? we reached the end of the feed.
                this.reachedFirstPost = true;
            }
        }
        //log("After  _load: count", this.loadedCount(), " olderId", this.olderId, "newerId", this.newerId);
        return loadedPosts;
    }
    loadedCount() {
        return this.loader.posts().length
    }
    async getOlderPostUrl(consume = true) {
        // log("olderID", this.olderId);
        // log("post count:", this.loadedCount())

        if (this.olderId < 3) { // not yet loaded, or finishing
            //log("not enough old loaded posts, loading older posts")
            // console.time("load older");
            await this._load(5, true);
            // console.timeEnd("load older");
        }
        if (!this.loadedCount()) { return null; }

        // if (this.olderId < 3) {
        //     this._load(10, true); // yeah do not wait, this is very probably broken, so it's disabled.
        // }

        let result = this.loader.posts()[this.olderId];
        if (consume) { this.olderId-- }
        return result;
    }

    async getNewerPostUrl(consume = true) {
        // log("post count:", this.loadedCount(), "newerId", this.newerId)
        let candidate = this.loader.posts()[this.newerId];
        if (!candidate) { // need to load
            //log("not enough new loaded posts, loading newer posts")
            // console.time("load newer")
            let posts = await this._load(5, false);
            // console.timeEnd("load newer")
        }

        // if (this.newerId + 4 > loadedCount) {
        //     this._load(10, false); // yeah do not wait
        // }

        candidate = this.loader.posts()[this.newerId];
        if (candidate) {
            if (consume) { this.newerId++; }
            return candidate;
        }
        return null

    }
    async peekNewerPostUrl() { return this.getNewerPostUrl(false) }
    async peekOlderPostUrl() { return this.getOlderPostUrl(false) }
}


class FeedAggregator {
    posts = [];
    dateStarting = null;
    streamers = [];
    /**
     * as the aggregator controls the feed loaders,
     * it knows their lenghts before and after the loads,
     * so it can automatically adjust the offset of the last accessed element
     * 
     * 
     * maybe it should be implemented as a composite cursor
     * each element a cursor on its specific feed
     */
    constructor(urls = [], dateStarting = new Date()) {
        // log(urls)
        this.streamers = urls.map((url) => new FeedStreamer(url, dateStarting));
        // log(this);
    }
    getNextOlderPostUrl() {
        return Promise
            .allSettled(this.streamers.map(s => {
                return s.peekOlderPostUrl()
                    .then((oldestUrl) => {
                        return oldestUrl ? { url: oldestUrl, streamer: s } : null;
                    });

            }))
            .then(results => results.filter(r => r.status == "fulfilled").map(r => r.value))
            .then((allUrls) => {
                return allUrls
                    .filter(u => { return !!u })
                    .sort((a, b) => {
                        // log(a.url.slice(a.streamer.url().length), "<", b.url.slice(b.streamer.url().length))
                        return (a.url.slice(a.streamer.url().length)
                            >
                            b.url.slice(b.streamer.url().length)
                            ? -1 : 1
                        );
                    });

            })
            .then(sortedUrls => {
                if (sortedUrls.length == 0) { return null }
                // log("sorted", sortedUrls.map(u => u.url));
                let winner = sortedUrls[0]
                return winner.streamer.getOlderPostUrl()
                    .then((url) => {
                        // log("winning url", url)

                        this.posts.push(url);
                        return url;
                    })


            })
    }
    posts() {
        return this.posts;
    }

}


export default Ibex;
export {Ibex, FeedLoader, FeedStreamer, FeedAggregator };