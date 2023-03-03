const utilFunctions = require('./index');

const mdLinks = (userPath, options) => new Promise((resolve, reject) => {
  if (utilFunctions.validatePath(userPath)) {
    const absPath = utilFunctions.absolutePath(userPath);

    if (utilFunctions.pathIsFile(absPath) && utilFunctions.getExtension(absPath) === '.md') {
      const arrOfLinks = utilFunctions.getLinks(absPath, userPath, options);
      if (arrOfLinks.length > 0) {
        resolve(Promise.all(arrOfLinks));
      } else {
        //console.log('objeto sin http request');
        reject(new Error('No se encontró archivos markdown con links'));
      }
    } else {
      console.log('es directorio');
    }
  } else {
    console.log('Ruta no válida');
    reject(new Error('Ruta no válida'));
  }
});

mdLinks('./README.md', { validate: true }).then((res) => {
  console.log(res);
});

module.exports = mdLinks;
