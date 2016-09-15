#! /usr/bin/env node --max-old-space-size=4096

process.argv.push('--local');

require('../server.js');
