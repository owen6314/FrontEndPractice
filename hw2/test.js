const process = require('process');
const util = require('util');
const vm = require('vm');
const readFile = util.promisify(require('fs').readFile);
const assert = require('assert');

async function test() {
  if (process.argv.length < 3) {
    console.error('Usage: node test.js index.js');
  }

  filename = process.argv[2];
  const context = new vm.createContext({assert, console});
  const content = await readFile(filename, 'utf-8');
  const script = new vm.Script(content);
  script.runInContext(context);

  const files = ['ip', 'iterator', 'equal', 'count', 'mapreduce'];
  const timeouts = [500, 1000, 1000, 500, 1000];

  for (let i = 0; i < files.length; ++i) {
    console.log('\n\n------------');
    console.log(files[i]);
    console.log('------------');
    const testScript = new vm.Script(await readFile(`./test/${files[i]}.js`));
    try {
      testScript.runInContext(context, {}, {
        timeout: timeouts[i],
      });
    } catch (e) {
      console.error(e);
    }
  }
}

test();
