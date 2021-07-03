import path from 'path';
import cheerio from 'cheerio';
import entires from 'lodash/entries';
import { linkTypesMapping, createLinkPath } from './utils';

const tagsMapping = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const changeLinksToRelative = (html, requestPath) => {
  const $ = cheerio.load(html);
  const { origin } = new URL(requestPath);
  const fileDirectoryPath = createLinkPath(requestPath, linkTypesMapping.directory);
  const links = [];

  entires(tagsMapping).forEach(([tag, attribute]) => {
    $(tag).each((i, el) => {
      const attr = $(el).attr(attribute);
      if (!attr) return;

      const link = new URL(attr, origin);
      if (!origin.includes(link.host)) return;
      if (link) links.push(link.toString());

      const newPath = path.join(fileDirectoryPath, createLinkPath(link.toString()));
      $(el).attr(attribute, newPath);
    });
  });

  return { links, updatedHtml: $.html() };
};

export default changeLinksToRelative;
