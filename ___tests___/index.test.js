import nock from 'nock';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import loadPage from '../src/index';

let tempDirectory = '';
const requestUrl = ' https://ru.hexlet.io/courses';

nock.disableNetConnect();

describe('should load page', () => {
  beforeEach(async () => {
    tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    nock.cleanAll();
  });

  afterAll(async () => {
    await fs.rmdir(tempDirectory, { recursive: true });
    nock.enableNetConnect();
  });

  test('should save page as html', async () => {
    const expectedHTML = await fs.readFile(path.join('__fixtures__', 'test.html'), 'utf-8');
    nock(requestUrl).get('').reply(200, expectedHTML);
    await loadPage(requestUrl, tempDirectory);
    const files = await fs.readdir(tempDirectory);
    console.log(files);
    const loadedHTML = await fs.readFile(
      path.join(tempDirectory, 'ru-hexlet-io-courses.html'),
      'utf-8'
    );
    expect(loadedHTML.trim()).toEqual(expectedHTML.trim());
  });
});
