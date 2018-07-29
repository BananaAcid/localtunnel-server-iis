#!/usr/bin/env node -r esm

import 'localenv';
import log from 'book';
import Debug from 'debug';
import CreateServer from './server';
const debug = Debug('localtunnel');




const argv = {
    // Specify the base domain name. This is optional if hosting localtunnel from a regular example.com domain. This is required if hosting a localtunnel server from a subdomain (i.e. lt.example.dom where clients will be client-app.lt.example.come)
    //domain: 'subdomain.yourserver.com',

    // maximum number of tcp sockets each client is allowed to establish at one time (the tunnels)
    'max_tcp_sockets': 10,
    
    // the url to redirect to for browser requests
    landing: 'https://localtunnel.github.io/www/',



    // --- iisnode config should stay like this. -------------------------------------------------------------------------------------
    // use this flag to indicate proxy over https -- for iisnode, this should be off - set you SSL options ins IIS !
    secure: false,
    // listen on this port for outside requests -- PORT will be set by iisnode !
    port: process.env.PORT || 3000,
    // IP address to bind to, 0.0.0.0 = all available -- for iisnode this is fine, since a PIPE over PORT is used anyways
    address: '0.0.0.0'
}





const server = CreateServer(argv);
server.listen(argv.port, argv.address, () => debug('server listening on port: %d', server.address().port) );
process.on('SIGINT', () => process.exit() );
process.on('SIGTERM', () => process.exit() );
process.on('uncaughtException', err => log.error(err) );
process.on('unhandledRejection', (reason, promise) => log.error(reason) );