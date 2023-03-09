const path = require('path');
const fs = require('fs');
const marked = require('marked');
const jsdom = require('jsdom');
const axios = require('axios');

const { JSDOM } = jsdom;

const absolutePath = (newPath) => (path.isAbsolute(newPath) ? newPath : path.resolve(newPath));
const validatePath = (newPath) => fs.existsSync(newPath);
const pathIsFile = (newPath) => fs.statSync(newPath).isFile();
const getExtension = (newPath) => (path.extname(newPath) === '.md');

const httpRequest = (link) => axios.get(link);

const getMdFiles = (route) => {
  const arrOfFiles = [];
  const newPath = absolutePath(route);
  if (pathIsFile(newPath)) {
    if (getExtension(newPath)) {
      arrOfFiles.push(newPath);
    }
  } else {
    fs.readdirSync(newPath).forEach((element) => {
      const arr = getMdFiles(path.join(newPath, element));
      arrOfFiles.push(...arr);
    });
  }
  return arrOfFiles;
};

const getLinks = (newPath) => {
  const arr = [];

  getMdFiles(newPath).forEach((eachPath) => {
    // Obtener el contenido del archivo y pasarlo a string
    const mdStringContent = fs.readFileSync(eachPath).toString();
    // Convertir contenido del archivo .md a html
    const mdHtmlContent = marked.parse(mdStringContent);
    // Extraer los links con jsdom
    const dom = new JSDOM(mdHtmlContent);
    const nodeList = dom.window.document.querySelectorAll('a');
    const arrayOfAnchor = Array.from(nodeList);

    arrayOfAnchor.forEach((element) => {
      const link = element.getAttribute('href');
      if (link.indexOf('http') !== -1) {
        const obj = {
          href: link,
          text: element.textContent,
          file: eachPath,
        };
        arr.push(obj);
      }
    });
  });

  return arr;
};

const getStatus = (route) => {
  const arr = [];
  
  getLinks(route).forEach((element) => {
    const obj = httpRequest(element.href).then((res) => ({
      ...element,
      status: res.status,
      statusText: res.statusText,
    })).catch((err) => {
      if (err.response) {
        return {
          ...element,
          status: err.response.status,
          statusText: err.response.statusText,
        };
      }
      return {
        ...element,
        status: err.code,
        statusText: 'FAIL',
      };
    });
    arr.push(obj);
  });
  // return Promise.all(arr);
  //return arr;
  return Promise.all(arr);
  // return arr;
};

getStatus('./README.md').then((res) => {
  console.log(res);
});
Promise.all(getLinks('./test/folder/anotherFolder/README.md', { validate: true })).then((res) => {
  console.log(res);
});


module.exports = {
  absolutePath,
  pathIsFile,
  validatePath,
  getExtension,
  getLinks,
  httpRequest,
  getMdFiles,
  getStatus,
};