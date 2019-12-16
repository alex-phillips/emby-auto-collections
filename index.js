const ini = require('ini');
const fs = require('fs');
const YAML = require('js-yaml');
const Emby = require('./src/Emby');

const config = ini.parse(fs.readFileSync(`${__dirname}/config.ini`, 'utf8'));
const api = new Emby(config.server.host, config.server.apiKey);

let collections = {};
process.argv.slice(2).forEach((file) => {
  collections = {
    ...collections,
    ...YAML.safeLoad(fs.readFileSync(file)),
  };
});

(async () => {
  const userId = config.server.userId || (await api.getUsers())[0].Id;
  const movies = await api.getAllMovies(userId);

  const collectionMap = (await api.getAllCollections(userId)).Items.reduce((acc, curr) => {
    acc[curr.Name] = curr.Id;
    return acc;
  }, {});

  await Object.keys(collections).forEach(async (collectionName) => {
    const idsToAdd = [];

    async function processMovie(collectionMovie) {
      const yearRegex = collectionMovie.match(/\{\{((?:\d+\|?)+)\}\}/) || null;
      await movies.Items.forEach(async (movie) => {
        if (yearRegex) {
          collectionMovie = collectionMovie.replace(/\s+\{\{((\d+\|?)+)\}\}/, '');
        }

        const movieRegex = new RegExp(collectionMovie, 'i');
        if (movie.Name.match(movieRegex)) {
          if (yearRegex) {
            const item = await api.getItem(movie.Id, userId);
            if (item.ProductionYear.toString().match(new RegExp(yearRegex[1]))) {
              idsToAdd.push(movie.Id);
            }
          } else {
            idsToAdd.push(movie.Id);
          }
        }
      });
    }

    await collections[collectionName].forEach(async (collectionMovie) => {
      if (!Array.isArray(collectionMovie)) {
        collectionMovie = [collectionMovie];
      }

      await collectionMovie.map(async (m) => processMovie(m));
    });

    if (idsToAdd.length > 0) {
      if (!collectionMap[collectionName]) {
        const newCollection = await api.createCollection(collectionName);
        collectionMap[collectionName] = newCollection.Id;
      }

      await api.addToCollection(collectionMap[collectionName], idsToAdd);
    }
  });
})();
