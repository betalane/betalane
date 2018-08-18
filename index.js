#!/usr/bin/env node

/**
 * Module dependencies.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


const fs = require('fs');
const logger = require('./helper/logger');
const laneDriver = require('./laneDriver');

if (!fs.existsSync('./betalane.json')) {
  logger.error('Missing betalane.json file.');
  process.exit();
}

let betalanes = '';

try {
  betalanes = JSON.parse(fs.readFileSync('./betalane.json'));
} catch (error) {
  logger.error('betalane.json - JSON parsing error');
  process.exit();
}

// logger.info(betalane);

betalanes.forEach((lane, idx) => {
  laneDriver.validateLane(lane, idx);
  laneDriver.driveLane(lane, idx);
});

// var program = require('commander');

// program
//   .version('0.1.0', '-v, --version')
//   .option('-p, --peppers', 'schema')
//   .option('-P, --pineapple', 'Add pineapple')
//   .option('-b, --bbq-sauce', 'Add bbq sauce')
//   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
//   .parse(process.argv);

// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);