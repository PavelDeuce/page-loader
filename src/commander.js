import commander from 'commander';

import loadPage from '.';
import { version } from '../package.json';

export default () => {
  commander
    .version(version)
    .description('Download the webpage by url')
    .arguments('<url>')
    .option('-o', '--output [path]', process.cwd())
    .action((url) => {
      loadPage(url, commander.output)
        .then((fileName) => console.log(`The page was downloaded to ${url} as ${fileName}`))
        .catch((err) => {
          console.error(err.message);
          process.exit(1);
        });
    })
    .parse(process.argv);
};
