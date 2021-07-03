import path from 'path';

export const getFixturePath = (filepath) => path.join('__fixtures__', filepath);

export const transformToKebabNotation = (link) => {
  if (link.length === 0) return '';
  const { host = '', pathname } = new URL(link);
  const name = `${host}${pathname}`.replace(/[^a-z1-9]/g, '-');
  return name
    .split('-')
    .filter((el) => el)
    .join('-');
};

export const linkTypesMapping = {
  html: 'html',
  file: 'file',
  directory: 'directory',
};

export const createLinkPath = (link, type = linkTypesMapping.file) => {
  const kebabLink = transformToKebabNotation(link);
  const htmlExtenstion = '.html';
  switch (type) {
    case linkTypesMapping.html:
      return `${kebabLink}${htmlExtenstion}`;
    case linkTypesMapping.directory:
      return `${kebabLink}_files`;
    case linkTypesMapping.file: {
      const linkWithoutExtension = kebabLink.slice(0, kebabLink.lastIndexOf('-'));
      const extension = path.extname(link) || htmlExtenstion;
      return `${linkWithoutExtension}${extension}`;
    }
    default:
      throw new Error(`Unknown type - ${type}`);
  }
};
