
const $rdf = require('rdflib');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

const LDP = $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")

const SolidAclUtils = require('solid-acl-utils')

const { AclApi, AclParser, Permissions, Agents } = SolidAclUtils;
const { READ, WRITE, CONTROL } = Permissions;

const auth = require("solid-auth-client");

var log = (...data) => {
    // data = data || false;
    // if (!$) {
    //     console.log(data);
    //     return data[0]
    // }

    // $('#logresults').append($('<pre>').text(
    //     data.map(
    //         (e) => {
    //             return ('string' !== typeof e) ? JSON.stringify(e, null, 2) : e
    //         }

    //     ).join(" ")));
    // return data[0]
}

class Ibex {
    me = null;
    myHost = null;
    myRootPath = 'is.darcy';
    feedLocation = "feed";
    defaultFeed = 'main';
    settingsFileBasename = 'config.json'

    constructor(me) {
        this.me = me;
        this.myHost = this.urlDomain(me);
    }
    root() { return this.myHost + '/' + this.myRootPath; }
    feedRoot() { return this.root() + '/' + this.feedLocation; }
    configFile() { return this.root() + '/' + this.settingsFileBasename; }

    loadSettings() {
        return this.willFetch(this.configFile()).then(
            (res) => res.json()
        )
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
        [newFolder, container] = this.basePath(container);
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
                        ).then(res => this.willFetch(path));
                    });
            });
    }
    createFeed(feedName) {
        return this.makePath(this.feedRoot(), feedName)
            .then((res) => this
                .loadAcl(res.url)
                .then((acl) => {

                    let ensureDefaultRule = (privilege, agent) => {
                        if (!acl.hasDefaultRule(privilege, agent)) { acl.addDefaultRule(privilege, agent) }
                    }

                    ensureDefaultRule([WRITE, READ, CONTROL], this.me);
                    ensureDefaultRule(READ, Agents.PUBLIC);

                    return acl.saveToPod()
                        .then((acl) => this.willFetch(res.url))
                }))
    }

    deleteRecursive(folder) {
        return this._deleteRecursive($rdf.sym(folder))
    }

    _deleteRecursive(folder) {
        if (!folder.uri.startsWith(this.root())) {
            return Promise.reject("Invalid path: can't delete " + folder.uri)
        }

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store);

        return new Promise((resolve, reject) => {
            fetcher.load(folder).then(() => {
                //log(store.each(folder, LDP('contains'), null));

                let promises = store.each(folder, LDP('contains'), null).map(file => {
                    if (store.holds(file, RDF('type'), LDP('BasicContainer'))) {
                        return this._deleteRecursive(file)
                    } else {
                        return fetcher.webOperation('DELETE', file.uri)
                    }
                });

                return Promise.all(promises)
                    .then(() => fetcher.webOperation('DELETE', folder.uri))
                    .then(res => { resolve() })
            })
        })
    }

    createPost(content, feed, slug, nocomment) {
        if (!content) { return Promise.reject("Missing content, won't publish") }
        feed = feed || this.defaultFeed;
        nocomment = nocomment || false;

        let now = new Date();

        slug = urlflatten(slug || ts(now));

        let path = [
            this.feedRoot(),
            feed,
            ("" + now.getFullYear()).padStart(4, '0'),
            ("" + (1 + now.getMonth())).padStart(2, '0'),
            ("" + now.getDate()).padStart(2, '0')
        ].join('/');

        let uri = path + "/" + slug + ".md";

        return this.createFeed(feed)
            .then(() => this.makePath(path))
            .then(
                () => this.willFetch(
                    uri, {
                    method: 'PUT', headers: { 'Content-Type': 'text/plain' },
                    body: content
                })
            )
    }

    /**
     * returns a nice url-compatible date string
     * @param {Date} date
     */
    ts(date) {
        date = date || new Date;
        return date.toISOString().replace(/:/g, '.');
    }


    basePath(path) {
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

    urlDomain(url) {
        //log("getting domain of ", url);
        var a = document.createElement('a');

        a.href = url;

        return a.protocol + '//' + a.hostname + (!a.port ? '' : (":" + a.port));
    }

    willFetch(url, pars) {
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

function urlflatten(s) {
    return encodeURIComponent(s);
    //return s.replace(/[^a-zA-Z0-9_]/, '-');
}

function ts(date) {
    date = date || new Date;
    return date.toISOString().replace(/:/g, '.');
}


class FeedLoader {
    constructor(feeds) {
        this.feeds = feeds;
    }
}

export default Ibex;
export { log, Ibex };