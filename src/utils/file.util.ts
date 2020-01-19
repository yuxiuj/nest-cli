const os = require('os');
const fs = require('fs');
const platform = os.platform();

export const createFile = (filepath, size, callback) => {
    const cb = (err) => {
      // tslint:disable-next-line: no-unused-expression
      callback && callback();
    };
    if (fs.existsSync(filepath)) {
      cb('file existed.');
    } else {
      let cmd = '';
      switch (platform) {
        case 'win32':
          cmd = 'fsutil file createnew ' + filepath + ' ' + size;
          break;
        case 'darwin':
        case 'linux':
          cmd = 'dd if=/dev/zero of=' + filepath + ' count=1 bs=' + size;
          break;
      }
      const exec = require('child_process').exec;
      exec(cmd, (err, stdout, stderr) => {
        cb(err);
      });
    }
};
