import path from 'path';
import axios from 'axios';
import debug from 'debug';
import { promises as fs } from 'fs';
import map from 'lodash/map';
import Listr from 'listr';

import changeLinksToRelative from './parser.js';
import { createLinkPath, linkTypesMapping } from './utils.js';

const log = debug('page-loader');

export default (requestUrl, outputPath = process.cwd()) => {
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

    return fs
      .mkdir(resourcesDirectory)
      .then(() => {
        const listrOptions = { exitOnError: false, concurrent: true };
        const listrData = map(links, (link) => ({
          title: `Loading ${link}`,
          task: () => loadResource(link),
        }));
        const tasks = new Listr(listrData, listrOptions);
        return tasks.run();
      })
      .catch((error) => {
        log(`Folder creating ${resourcesDirectory} failed with message: ${error.message}`);
        throw error;
      });
  };

  return axios.get(requestUrl).then((res) => {
    log(`Loading the page ${requestUrl} to ${outputPath}`);
    const htmlPath = path.join(outputPath, createLinkPath(requestUrl, linkTypesMapping.html));
    const { links, updatedHtml } = changeLinksToRelative(res.data, requestUrl);
    return fs
      .writeFile(htmlPath, updatedHtml)
      .then(() => {
        const resDir = path.join(
          outputPath,
          createLinkPath(requestUrl, linkTypesMapping.directory),
        );
        return loadAllResources(links, resDir);
      })
      .then(() => outputPath)
      .catch((error) => {
        log(error.message);
        throw error;
      });
  });
};
