#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import getMarkdownLint from './default_requires';
// tslint:disable-next-line: no-var-requires
const deglob = require('deglob');
// tslint:disable-next-line: no-var-requires
const gutil = require('gulp-util');

const moduleName = 'open-md-checker';

interface Config {
  requires?: string;
  patterns: string[];
  options: {
    useGitIgnore?: boolean;
    usePackageJson?: boolean;
    configKey?: string;
    gitIgnoreFile?: string;
    ignore?: string[];
    cwd?: string;
  };
}

function loadConfig(): Config {
  const defaultConfig: Config = {
    patterns: [ '**/*.md' ],
    options: {
      useGitIgnore: true,
      ignore: [ 'node_modules/**/*' ],
    },
  };

  const configFile = process.env.MD_LINT_CONFIG_PATH;
  if (!configFile) {
    gutil.log(moduleName, gutil.colors.yellow('Not set env MD_LINT_CONFIG_PATH, use default config'));
    return defaultConfig;
  }
  if (!existsSync(configFile)) {
    gutil.log(moduleName, gutil.colors.yellow(`Can not found config file ${configFile}, use default config`));
    return defaultConfig;
  }

  const configs = readFileSync(configFile).toString();
  if (configs) {
    const json = JSON.parse(configs);
    if (json[moduleName]) return json[moduleName];
  }

  gutil.log(moduleName, gutil.colors.yellow(`Load config from ${configFile} error, use default config`));
  return defaultConfig;
}

function getRemarkInstance() {
  const remark = require('remark');
  let md_lint_requires = getMarkdownLint();

  // load MarkdownLint
  if (config.requires) {
    if (!config.requires.startsWith('/')) {
      config.requires = join(process.cwd(), config.requires);
    }
    if (!existsSync(config.requires)) {
      gutil.log(moduleName, gutil.colors.yellow(`Can not found md-lint-requires file ${config.requires}, use default config`));
    } else {
      gutil.log(moduleName, gutil.colors.yellow(`Load md-lint-requires from ${config.requires}`));
      md_lint_requires = require(config.requires);
    }
  }
  return remark().use(md_lint_requires);
}

function doCheck(files: string[]) {
  const report = require('vfile-reporter');
  const remarkInstance = getRemarkInstance();

  files.forEach(filePath => {
    const mdContent = readFileSync(filePath, 'utf8');
    if (mdContent) {
      remarkInstance.process(mdContent, (err: any, file: any) => {
        const res = report(err || file);
        console.log(filePath);
        console.log(res);
        console.log();
        if (res !== 'no issues found') process.exitCode = -1;
      });
    }
  });
}

const config = loadConfig();
deglob(config.patterns, config.options, (err: any, files: string[]) => {
  if (err) {
    gutil.log(moduleName, gutil.colors.red(err));
    process.exit(-1);
  }
  doCheck(files);
});
