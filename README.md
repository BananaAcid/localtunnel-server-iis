# localtunnel-server-iis

1. install iisnode on IIS in the following order:
 - Rewrite Module - https://www.iis.net/downloads/microsoft/url-rewrite
 - NodeJS - https://nodejs.org/en/
 - iisnode - https://github.com/azure/iisnode/wiki/iisnode-releases

2. create a folder with this files 
 - Either `git pull https://github.com/BananaAcid/localtunnel-server-iis.git .` or download this repo as zip and extract it
 - `npm i` will download all dependencies (node libraries)

3. Firewall: "Allow an app or feature through WIndows Firewall" -> "Allow another app..." -> "Browse..." -> "C:\Program Files\nodejs\node.exe" + open -> "Network types..." -> tick the missing 'Private' ! -> OK -> Add
 - THIS PART IS IMPORTANT !
 
4. create a web site in IIS, pointing to the folder
 - bind to port 80, and to subdomain configured in iisnode.main.js (if you do not use a subdomain, iisnode.main.js does not need to be configured with this)
 - if you use a subdomain binding: `subdomain.server.tld` AND `*.subdomain.server.tld` are required 

5. stop and start the web site in IIS (just to be sure) -> now accessing the url defined in binding, you should get redirected to the localtunnel homepage. Using the localtunnel client, you should get a tunnel.

Note: the port is passed from iisnode to the index.js by process.env.PORT (that is, a pipe because of iisnode). So no need to configure.

## Testing the server

At the commandline, use `node iisnode.main.js` to test it.

## Using the client

You need to reference the domain, that is bound at IIS: `lt -h …domain… -p 1234` (port 1234 is the local port to forward to the localtunnel server).


## To install node, you can use `nvm`.
On windows as well, in powershell:

    # install module
    PS  Install-Module -Name power-nvm
    # fix missing ref
    PS  Add-Type -AssemblyName System.IO.Compression.FileSystem

    # install and set default version
    PS  nvm install latest
    PS  nvm default latest

one-liner:
    
    PS  Install-Module -Name power-nvm ; Add-Type -AssemblyName System.IO.Compression.FileSystem ; nvm install latest ; nvm default latest


# reference
This is the normal Localtunnel-Server (https://github.com/localtunnel/server) but with additional files for Heroku and IIS. The original commands are still working.


-----
-----

# Original:

localtunnel exposes your localhost to the world for easy testing and sharing! No need to mess with DNS or deploy just to have others test out your changes.

This repo is the server component. If you are just looking for the CLI localtunnel app, see (https://github.com/localtunnel/localtunnel).

## overview ##

The default localtunnel client connects to the `localtunnel.me` server. You can, however, easily set up and run your own server. In order to run your own localtunnel server you must ensure that your server can meet the following requirements:

* You can set up DNS entries for your `domain.tld` and `*.domain.tld` (or `sub.domain.tld` and `*.sub.domain.tld`).
* The server can accept incoming TCP connections for any non-root TCP port (i.e. ports over 1000).

The above are important as the client will ask the server for a subdomain under a particular domain. The server will listen on any OS-assigned TCP port for client connections.

#### setup

```shell
# pick a place where the files will live
git clone git://github.com/defunctzombie/localtunnel-server.git
cd localtunnel-server
npm install

# server set to run on port 1234
bin/server --port 1234
```

The localtunnel server is now running and waiting for client requests on port 1234. You will most likely want to set up a reverse proxy to listen on port 80 (or start localtunnel on port 80 directly).

**NOTE** By default, localtunnel will use subdomains for clients, if you plan to host your localtunnel server itself on a subdomain you will need to use the _--domain_ option and specify the domain name behind which you are hosting localtunnel. (i.e. my-localtunnel-server.example.com)

#### use your server

You can now use your domain with the `--host` flag for the `lt` client.

```shell
lt --host http://sub.example.tld:1234 --port 9000
```

You will be assigned a URL similar to `heavy-puma-9.sub.example.com:1234`.

If your server is acting as a reverse proxy (i.e. nginx) and is able to listen on port 80, then you do not need the `:1234` part of the hostname for the `lt` client.

## REST API

### POST /api/tunnels

Create a new tunnel. A LocalTunnel client posts to this enpoint to request a new tunnel with a specific name or a randomly assigned name.

### GET /api/status

General server information.
