import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

export default (requestUrl, outputPath) =>
  axios
    .get(requestUrl)
    .then(({ data }) => {
      const newUrl = new URL(requestUrl);
      const extension = 'html';
      const fileName = `${`${newUrl.host}${newUrl.pathname === '/' ? '' : newUrl.pathname}`.replace(
        /[^a-zA-Z1-9]/g,
        '-'
      )}.${extension}`;

      fs.writeFile(path.join(outputPath, fileName), data, 'utf-8').catch((e) => {
        throw new Error(`Error write file - ${e}`);
      });
    })
    .catch(console.error);
