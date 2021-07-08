import path from 'path';
import axios from 'axios';
import { promises as fs } from 'fs';
import Listr from 'listr';
import map from 'lodash/map.js';

import log from './logger.js';
import { createLinkPath } from './utils.js';

const loadAllResources = (links, resourcesDirectory) => {
  const loadResource = (link) => {
    const responseType = 'arraybuffer';
    return axios
      .get(link, { responseType })
      .then(({ data }) => {
        const fileName = createLinkPath(link);
        log(`The file ${fileName} was successfully loaded to ${resourcesDirectory}`);
        return fs.writeFile(path.join(resourcesDirectory, fileName), data);
      })
      .catch((error) => {
        log(`Fetch resource ${link} failed with message: ${error.message}`);
        throw error;
      });
  };

  return fs.mkdir(resourcesDirectory).then(() => {
    const listrOptions = { exitOnError: false, concurrent: true };
    const listrData = map(links, (link) => ({
      title: `Loading ${link}`,
      task: () => loadResource(link),
    }));
    const tasks = new Listr(listrData, listrOptions);
    return tasks.run();
  });
};

export default loadAllResources;
