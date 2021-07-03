import { Command } from 'commander';

import loadPage from '.';
import { version } from '../package.json';

const program = new Command();

export default () => {
  return program
    .version(version)
    .description('Download the webpage by url')
    .arguments('<url>')
    .option('-o --output [path]', 'output directory', process.cwd())
    .action((url, argv) => {
      console.log(argv);
      loadPage(url, argv.output)
        .then((fileName) => console.log(`The page was downloaded to ${url} as ${fileName}`))
        .catch((err) => {
          console.error(err.message);
          process.exit(1);
        });
    })
    .parse(process.argv);
};
