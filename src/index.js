// const insertedPath = './src/cli.js';
const path = require('path');
// console.log(path)
const fs = require('fs');
const marked = require('marked');
//console.log(marked)
const jsdom = require('jsdom');
//console.log(jsdom)
const axios = require('axios');
const { type } = require('os');
//console.log(axios)

// const convertToAbsolute = (newPath) => {
//   let route = newPath;
//   if (!path.isAbsolute(newPath)) route = path.resolve(newPath);
//   return route;
// };

const { JSDOM } = jsdom;

const absolutePath = (newPath) => (path.isAbsolute(newPath) ? newPath : path.resolve(newPath));
// Si "newPath" es una ruta absoluta, la función simplemente devuelve "newPath". 
// Si "newPath" es una ruta relativa, la función utiliza la función "resolve()" 
// del módulo "path" para resolver la ruta relativa en una ruta absoluta.

// const validatePath = () => {
//   console.log('Validar ruta');
// };

const validatePath = (newPath) => fs.existsSync(newPath);
// if (fs.existsSync(newPath)) return true;
// return false;
// };

const pathIsFile = (newPath) => fs.statSync(newPath).isFile();


const pathIsDirectory = (newPath) => fs.statSync(newPath).isDirectory();
// const isDirectory = () => {
//   console.log('Determinar si es un directorio');
// };

const getExtension = (newPath) => path.extname(newPath);

const httpRequest = (link) => axios.get(link);

const getLinks = (newPath, userPath) => {
  // Obtener el contenido del archivo y pasarlo a string
  const mdStringContent = fs.readFileSync(newPath).toString();
  //console.log(mdStringContent);
  // Convertir contenido del archivo .md a html
  const mdHtmlContent = marked.parse(mdStringContent);
  console.log(typeof mdHtmlContent);
  // Extraer los links con jsdom
  const dom = new JSDOM(mdHtmlContent);
  //console.log(dom);
  const nodeList = dom.window.document.querySelectorAll('a');
  console.log(nodeList);
  const arrayOfAnchor = Array.from(nodeList);
  const arr = [];

  arrayOfAnchor.forEach((element) => {
    //console.log(element.textContent, element.getAttribute('href'));
    const obj = {
      href: element.getAttribute('href'),
      text: element.textContent,
      file: userPath,
    };
    arr.push(obj);
  });
  return arr;
};

module.exports = {
  absolutePath,
  pathIsFile,
  validatePath,
  pathIsDirectory,
  getExtension,
  getLinks,
  httpRequest,
};