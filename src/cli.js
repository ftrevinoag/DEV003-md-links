#!/usr/bin/env node
/* eslint-disable no-console */

const mdlinks = require('./mdlinks');

const terminalInput = process.argv;
const validateOp = terminalInput.includes('--validate') || terminalInput.includes('--v');
const statOp = terminalInput.includes('--stat') || terminalInput.includes('--s');


if (terminalInput.length < 3) {
  console.log('Ingrese una ruta');
} else {
  const route = process.argv[2];
  if (terminalInput.length === 3) {
    mdlinks(route, { validate: false }).then((res) => {
      res.forEach((element) => {
        console.log(`${element.href} ${element.text}`);
      });
    }).catch((err) => {
      console.log(`${err.message}`);
    });
  } else if (terminalInput.length > 3) {
    if (validateOp && statOp) {
      mdlinks(route, { validate: true }).then((res) => {
        const arr = res.map(((element) => element.href));
        const unique = new Set(arr).size;
        const result = res.reduce((sum, element) => {
          // eslint-disable-next-line no-param-reassign
          if (element.status > 399 || typeof element.status === 'string') sum += 1;
          return sum;
        }, 0);
        console.log(`Total: ${arr.length}\nUnique: ${unique}\nBroken: ${result}`);
      }).catch((err) => {
        console.log(err.message);
      });
    } else if (statOp) {
      mdlinks(route, { validate: true }).then((res) => {
        const arr = res.map(((element) => element.href));
        const unique = new Set(arr).size;
        console.log(`Total: ${arr.length}\nUnique: ${unique}`);
      }).catch((err) => {
        console.log(err.message);
      });
    } else if (validateOp) {
      mdlinks(route, { validate: true }).then((res) => {
        res.forEach((element) => {
          console.log(`${element.href} ${element.statusText} ${element.status} ${element.text}`);
        });
      }).catch((err) => {
        console.log(err.message);
      });
    }
  }
}