/* Studio Webux S.E.N.C 2022 */

const { existsSync } = require('fs');
const path = require('path');

function normalizePath(p) {
  if (process.platform === 'win32') {
    return p.split(path.posix.sep).join(path.win32.sep);
  }
  return p.split(path.win32.sep).join(path.posix.sep);
}

const searchRoot = (baseDir, iter = 0) => {
  if (!baseDir) {
    throw new Error('Missing baseDir');
  }

  if (iter >= (process.env.MAX_ITER || 8)) {
    throw new Error(
      `Reached the ${process.env.MAX_ITER || 8} iterations, at ${baseDir}`,
    );
  }
  const exists = existsSync(path.join(baseDir, '.git'));

  if (exists) {
    return {
      path: path.join(baseDir) + path.sep,
      success: true,
      iter,
    };
  }

  return searchRoot(path.join(baseDir, '..'), iter + 1);
};

module.exports = {
  normalizePath,
  searchRoot,
};
