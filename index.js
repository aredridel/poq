module.exports = createFile;

const promisify = require('util').promisify;
const writeFile = promisify(require('fs').writeFile);
const readFile = promisify(require('fs').readFile);
const stat = expectENOENT(promisify(require('fs').stat));

async function createFile(args) {
  const stats = await stat(args.name);
  if (!stats || stats.size != Buffer.byteLength(args.content) || await readFile(args.name) != args.content) {
    await writeFile(args.name, args.content);
    return true;
  } else {
    return false;
  }
}

function expectENOENT(fn) {
  return async function() {
    try {
      return await fn.apply(null, arguments);
    } catch (e) {
      if (e.code != 'ENOENT') throw e;
    }
  }
}
