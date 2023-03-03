// const insertedPath = './src/cli.js';
const path = require('path');
// console.log(path)
const fs = require('fs');
const marked = require('marked');
//console.log(marked)
const jsdom = require('jsdom');
//console.log(jsdom)
const axios = require('axios');
//console.log(axios)

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



// TODO: hacer que funcione usando solamente un path
const getLinks = (newPath, userPath, options) => {
  // Obtener el contenido del archivo y pasarlo a string
  const mdStringContent = fs.readFileSync(newPath).toString();
  //console.log(mdStringContent);
  // Convertir contenido del archivo .md a html
  const mdHtmlContent = marked.parse(mdStringContent);
  //console.log(mdHtmlContent);
  // Extraer los links con jsdom
  const dom = new JSDOM(mdHtmlContent);
  //console.log(dom);
  // const dom = new JSDOM(`<!DOCTYPE html><p>${mdHtmlContent}</p>`); 
  // console.log(dom.window.document.querySelector("p").textContent);
  const nodeList = dom.window.document.querySelectorAll('a');
  //console.log(nodeList);
  const arrayOfAnchor = Array.from(nodeList);
  const arr = [];

  if (options.validate) {
    arrayOfAnchor.forEach((element) => {
      arr.push(httpRequest(element.href)
        .then((response) => ({
          href: element.getAttribute('href'),
          text: element.textContent,
          file: userPath,
          status: response.status,
          statusText: response.statusText,
        }))
        .catch(() => ({
          href: element.getAttribute('href'),
          text: element.textContent,
          file: userPath,
          status: 'nose',
          statusText: 'Fail',
        })));
    });
  } else {
    arrayOfAnchor.forEach((element) => {
      const obj = {
        href: element.getAttribute('href'),
        text: element.textContent,
        file: userPath,
      };
      arr.push(obj);
    });
  }
  console.log(arr);
  return arr;
};

module.exports = {
  absolutePath,
  pathIsFile,
  validatePath,
  pathIsDirectory,
  getExtension,
  getLinks,
};


