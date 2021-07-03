import path from 'path';
import axios from 'axios';
import { createWriteStream, promises as fs } from 'fs';
import Listr from 'listr';
import map from 'lodash/map.js';

import log from './logger.js';
import { createLinkPath } from './utils.js';

const loadResource = (link, resourcesDirectory) =>
  axios
    .get(link, { responseType: 'stream' })
    .then(({ data }) => {
      const fileName = createLinkPath(link);
      data.pipe(createWriteStream(path.join(resourcesDirectory, fileName)));
      return log(`The file ${fileName} was successfully loaded to ${resourcesDirectory}`);
    })
    .catch((error) => {
      log(`Fetch resource ${link} failed with message: ${error.message}`);
      throw error;
    });

const loadAllResources = (links, resourcesDirectory) =>
  fs
    .mkdir(resourcesDirectory)
    .then(() => {
      const listrOptions = { exitOnError: false, concurrent: true };
      const listrData = map(links, (link) => ({
        title: `Loading ${link}`,
        task: () => loadResource(link, resourcesDirectory),
      }));
      const tasks = new Listr(listrData, listrOptions);
      return tasks.run();
    })
    .catch((error) => {
      log(`Folder creation ${resourcesDirectory} failed with message: ${error.message}`);
      throw error;
    });

export default loadAllResources;
