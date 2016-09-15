#! /usr/bin/env node --max-old-space-size=4096

process.argv.push('--dev');

require('../server.js');
