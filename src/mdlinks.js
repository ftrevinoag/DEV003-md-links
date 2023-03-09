const utilFunctions = require('./utils');

const mdLinks = (userPath, options) => new Promise((resolve, reject) => {
  if (utilFunctions.validatePath(userPath)) {
    const absPath = utilFunctions.absolutePath(userPath);

    let arrOfLinks = [];
    if (utilFunctions.pathIsFile(absPath) && !utilFunctions.getExtension(absPath)) {
      reject(new Error('No se encontró archivos markdown'));
    } else if (options.validate) {
      arrOfLinks = utilFunctions.getStatus(absPath);
      resolve(arrOfLinks);
    } else {
      arrOfLinks.push(...utilFunctions.getLinks(absPath));
      resolve(arrOfLinks);
    }
  } else {
    reject(new Error('Ruta no válida'));
  }
});

// mdLinks('./folder/anotherFolder/README.md', { validate: true }).then((res) => {
// mdLinks('./folder', { validate: true }).then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err.message);
// });
module.exports = mdLinks;