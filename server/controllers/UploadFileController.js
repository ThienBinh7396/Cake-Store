const helper = require("../helper/helper");
const path = require("path");
const fs = require("fs");
const _pathDir = path.join(__dirname + "./../../build/uploads");

//firebase
const admin = require("firebase-admin");
const serviceAccount = {
  type: "service_account",
  project_id: "thienbinh-7396",
  private_key_id: "1c69ba5fbfe1540629b8bd1a1fce655d1fb0dce0",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxbrrgUL553BHL\npv07DAUOJ/BbaaKv4I7NNQ67s2xLqLoUHQFjbrqq9B4w3QycNLAZkNJr0INDrD8S\n+usoy1WM8TrqXKpX6yrsVAsx+xoj0jK3H03h5YMU8tfEQ+83TNlyiGD75/52PNQs\nQ6dV7II9LCP73Dpz1l2247FJVW1FXNAAbr6aWoUeJMfLZgols7500LBaimchD6iq\ny/ZXl9QWdV9wbBGAR3ivyplXhvHknG8dYEQdU915SCTczX4yaHMPo3lq7lgObxH5\nQ+sPnPs1+qJyxbd+Ip9+8zr10tU1MgIjjUQSf0uKyeuRYGLWA/Lts3gLoCltcjS7\nqF1pCXdhAgMBAAECggEAUlgwVFBExeszOw9psJCYfARfER2KShNuUqAQEV5ooQhS\nK2l2rn3CFfqrVEQSSSBOpd7HORARC0QSFa3rmwga0QlXLVMKHzldt0Yd1/lQHVW9\nAa1+iJrqZbt6FXTtvP1mYTgXwnDdcGQ0l8JiE4dqvhcRMB755a6T2X/8VCtYRfrQ\nBGaNDQaYTHD9gA3ueleCPJLWSd5Dmee1dXEbJM6sZT2bagzYIq2D12D3EnJdFPxN\n2OUskKpQa6ktY1FKXqSSA09DRB5VIAvpMZIfPy/BHud0JxFQYGVTLnXiIiesR/w0\nt5tb0mLkcfu6jq/85JfGpN3/z589EXHuVk96+9+xfQKBgQD2kFBiaMHvX//RPta/\nRI8SSE7O9HB8NKeF5DwG9SdazGwKOv6CeTi544O/Er9xNTzyyEx91O8oMmIeobvt\n5wzZgeHX9rGNERutxldVyPljEFEKGxlvytt/fOJqJyPL8drIVL4u7/5ZZ2RAn+jf\nuoUMH2tVYKwjG6kNncAc9+LbDwKBgQC4ORv/5ceS4XWSfRPSDXVV0v41KGrkiJrg\n1hym/dNFB4auItmFTTlL+brKpt/mGOrr42PXM71FHzmC2wjUXMXbj2DmGV0T/prU\n/4ck6GDP4v7s1djGx/XuRkAdFuKyCH58F66KCgvtV3iVmlbD+LhJOBxHFR17A5e/\nV8Q7u+VGjwKBgCqwk+pl/uYGNhGxkpbtNORSdqqoce1fZH3vJWGDArxa1n3y9uv6\nNxMgTEhB47mjIRlcCrpiqsHH72skT5iCP5xNO6Aby2QESUmOJMLqmBtJ0O4yAPZ1\nJgntwnnkqvL9vgaffYo87Unnd9kklrpd3flaW0geA8/UUzHTVVbuqG2LAoGBALV8\n7ayofnihTObH+iLRx2qJto5ABy6ltY8S4J9TKDO1OmWLR6gfb/b9S5wh0iopGibR\nmaaE/k1+eXYEuyobS4EGO3v0ONJd3cNBCa6+j8G9607/TdRnYk0fQEJoLWUfIRy3\nZ+fuBdoIdm9L4XanLUZU1ObiUmzCGVkT6eq/LRzZAoGAI7pQSr7jajqY2KgDn1Ko\nmS+lIa+P+7MNg5jYZkSuI6B007Bj1WVSGPN3bF8LlAJcSPAi1mxSv5Z3cW6dnjoc\n2cI8r/bygEjVN3GKdF1AyBBCPnYv7pyZyMX7aATrTX3UPGfls9Px/zvRhMd14Sm/\nL4ZMgTYJRhyxEjZeSI8+AWE=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-4vibs@thienbinh-7396.iam.gserviceaccount.com",
  client_id: "100866691252446234846",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4vibs%40thienbinh-7396.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "thienbinh-7396.appspot.com"
});

const bucket = admin.storage().bucket();

class UploadFileController {
  // async uploadSingleFile(file) {
  //   return new Promise(async res => {
  //     let now = new Date().getTime();
  //     let newDir = helper.formatDate(now, 7).format;

  //     let match = file.name.match(/(?<name>.+)\.(?<extens>.+)/im);

  //     let {name, extens} = match.groups;
  //     name = helper.hassPassword(now + name)

  //     let newPath = `/${newDir}/${name}.${extens}`;

  //     let check = fs.existsSync(`${_pathDir}/${newDir}`);

  //     if (!check) {
  //       fs.mkdirSync(`${_pathDir}/${newDir}`);
  //     }

  //     file.mv(`${_pathDir}${newPath}`, err => {
  //       let _res = {
  //         name: file.name,
  //         mimetype: file.mimetype,
  //         size: file.size,
  //         path: `https://cakes-store.herokuapp.com/uploads${newPath}`
  //       };
  //       if (err) {
  //         res({
  //           ..._res,
  //           status: "error"
  //         });
  //       } else {
  //         res({
  //           ..._res,
  //           status: "successful"
  //         });
  //       }
  //     });
  //   });
  // }

  async uploadSingleFile(file) {
    return new Promise(res => {
      let bucketFile = bucket.file(file.name);

      let _res = {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size
      };

      fs.createReadStream(file.tempFilePath)
        .pipe(
          bucketFile.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          })
        )
        .on("error", function(err) {
          res({
            ..._res,
            status: "error"
          });
        })
        .on("finish", function(rs) {
          const config = {
            action: "read",
            expires: "03-07-2065"
          };

          bucketFile.getSignedUrl(config, (err, url) => {
            if (err) {
              res({
                ..._res,
                status: "error"
              });
            } else {
              res({
                ..._res,
                path: url,
                status: "successful"
              });
            }
          });
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
