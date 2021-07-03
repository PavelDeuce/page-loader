import { promises as fs } from 'fs';

import changeLinksToRelative from '../src/parser.js';
import { getFixturePath } from '../src/utils.js';

describe('parser', () => {
  test('should parse links', async () => {
    const html = await fs.readFile(getFixturePath('test.html'), 'utf-8');
    const expectedLinks = [
      'https://hexlet.io/images/img.png',
      'https://hexlet.io/css/index.css',
      'https://hexlet.io/js/index.js',
    ];
    const { links } = changeLinksToRelative(html, 'https://hexlet.io/courses');
    expect(links.sort()).toEqual(expectedLinks.sort());
  });
});
