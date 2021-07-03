install: install-deps

run:
	npx babel-node dist/bin/page-loader.js

build:
	rm -rf dist
	npm run build

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish --dry-run

.PHONY: test
