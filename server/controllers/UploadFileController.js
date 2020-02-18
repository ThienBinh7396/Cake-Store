const helper = require("../helper/helper");
const path = require("path");
const fs = require("fs");
const _pathDir = path.join(__dirname + "./../../public/uploads");

class UploadFileController {
  async uploadSingleFile(file) {
    return new Promise(async res => {
      let now = new Date().getTime();
      let newDir = helper.formatDate(now, 7).format;

      let match = file.name.match(/(?<name>.+)\.(?<extens>.+)/im);
      
      let {name, extens} = match.groups;
      name = helper.hassPassword(now + name)

      let newPath = `/${newDir}/${name}.${extens}`;

      let check = fs.existsSync(`${_pathDir}/${newDir}`);

      if (!check) {
        fs.mkdirSync(`${_pathDir}/${newDir}`);
      }

      file.mv(`${_pathDir}${newPath}`, err => {
        let _res = {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
          path: `/uploads${newPath}`
        };
        if (err) {
          res({
            ..._res,
            status: "error"
          });
        } else {
          res({
            ..._res,
            status: "successful"
          });
        }
      });
    });
  }

  async uploadFile(req, res) {
    let response = [];

    let files = req.files;
    for (var file in files) {
      let obj = {};
      let _file = files[file];

      if (Array.isArray(_file)) {
        let _obj = [];
        let that = this;
        _file.forEach(async it => {
          _obj.push(await that.uploadSingleFile(it));
        });

        obj[file] = _obj;
      } else {
        obj[file] = await this.uploadSingleFile(_file);
      }

      response.push(obj);
    }

    res.send(helper.getStatus("success", "Successful", response));
  }
}

module.exports = new UploadFileController();
