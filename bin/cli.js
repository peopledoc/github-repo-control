const ora = require('ora')();
const path = require('path');
const yargs = require('yargs');

const argv = yargs
  .option('settings', {
    alias: 's',
    description: 'The settings to use',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

if (!argv.settings) {
  ora.fail('You must specify a settings file (YAML).')
  process.exit(1)
}

let confPath = path.resolve([process.cwd(), argv.settings].join('/'));
;(async ()=> {
  await require('./../index.js')(confPath)
})()
