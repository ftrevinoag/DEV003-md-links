const {
  absolutePath,
  pathIsFile,
  /* pathIsDirectory,  */
  validatePath,
  getExtension,
  getLinks,
  httpRequest,
} = require('./index');

const mdLinks = (userPath, options) => {
  if (validatePath(userPath)) {
    const absPath = absolutePath(userPath);

    if (pathIsFile(absPath) && getExtension(absPath) === '.md') {
      const arrLinks = getLinks(absPath, userPath);

      if (options.validate === true) {
        arrLinks.forEach((element) => {
          console.log(element);
          httpRequest(element.href)
            .then((response) => {
              console.log(`${response.status}, ${response.statusText}`);
            })
            .catch((error) => {
              console.log(error.code);
            });
        });
      } else {
        console.log('objeto sin http request');
      }
    } else {
      console.log('es directorio');
    }
  } else {
    console.log('Ruta no válida');
  }
};

mdLinks('./README.md', { validate: false });

module.exports = mdLinks;