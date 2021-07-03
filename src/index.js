import path from 'path';
import axios from 'axios';
import { promises as fs } from 'fs';

import changeLinksToRelative from './parser';
import loadAllResources from './resources-service';
import { createLinkPath, linkTypesMapping } from './utils';
import log from './logger';

export default (requestUrl, outputPath) =>
  axios.get(requestUrl).then((res) => {
    log(`Loading the page ${requestUrl} to ${outputPath}`);
    const { links, updatedHtml } = changeLinksToRelative(res.data, requestUrl);
    const htmlPath = path.join(outputPath, createLinkPath(requestUrl, linkTypesMapping.html));
    return fs
      .writeFile(htmlPath, updatedHtml)
      .then(() => {
        const resDir = path.join(
          outputPath,
          createLinkPath(requestUrl, linkTypesMapping.directory)
        );
        return loadAllResources(links, resDir);
      })
      .catch((error) => {
        log(error.message);
        throw error;
      });
  });
