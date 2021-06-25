import program from 'commmander';

export default () => {
  program
    .version('1.0.0')
    .description('Load page by url')
    .option('-o', '--output [path]', process.cwd())
    .arguments('<url>')
    .action((url) => {
      console.log(url);
    })
    .parse(process.argv);
};
