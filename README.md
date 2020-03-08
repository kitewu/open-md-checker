# open-md-checker

`open-md-checker` is an open source module for markdown file format checking.

## Getting start

### Install

`npm i -g open-md-checker`

### Run

```shell
# open-md-checker
```

## Docs

### The definition of Config

```typescript
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
```

- requires(optional): Path to the js file containing the user deinfined rules, the default configuration is declare in the src/default_requires.js
- For the rest configuration, please refer to [deglob](https://www.npmjs.com/package/deglob)

#### Default config

```javascript
{
  patterns: [ '**/*.md' ],
  options: {
    useGitIgnore: true,
    ignore: [ 'node_modules/**/*' ],
  },
}
```

#### Customer configuration

Note: In order to facilitate the user to integrate the configuration into the package.json file, after loading the configuration file, the configuration will be read from the `open-md-checker` field, so the specific configuration should be included in the `open-md-checker` field, for example:

```json
{
  "open-md-checker": {
    "requires": "./requires.js",
    "patterns": [ "**/*.md" ],
    "options": {
      "useGitIgnore": true,
      "ignore": [ "node_modules/**/*" ]
    }
  }
}
```

The configuration file can be placed in any path of the project and specified by `MD_LINT_CONFIG_PATH` environment variable, for example:

```bash
# export MD_LINT_CONFIG_PATH=./open-md-checker.json
# open-md-checker
```

#### Customer open-md-checker rules

You can specify which checks are enabled. This option requires a js file, for example:

```javascript
module.exports = [
  require('remark-lint-final-newline'),
  require('remark-lint-list-item-bullet-indent')
]
```

The js file can be placed in any path of the project and specified by the `requires` field in the configuration.

### docker

#### build

```bash
# docker build -t open-md-checker .
```

#### run

```bash
# docker run -it -v src/path:/github/workspace open-md-checker
```
