const ADDRESS_TREE = require("./../helper/address_tree.json");

const helper = require("./../helper/helper");

class CommonController {
  getDataAddressByCity(req, res) {
    let providerAttribute = helper.checkGetProviderAttributes(req, res, [
      "city_code"
    ]);

    if (!providerAttribute) return;

    let { city_code } = providerAttribute;

    let _findCity = ADDRESS_TREE[city_code];

    res.send(helper.getStatus('success', 'Successful', _findCity));
  }
}

module.exports = new CommonController();
