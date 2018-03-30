var fs = require('fs-extra');
var path = require('path');

function saveMeta(meta) {
    var meta_path = path.resolve('migrations/meta/meta.json');
    fs.writeFileSync(
        meta_path,
        JSON.stringify(meta, null, 2)
    );
}

module.exports = {
    saveMeta: saveMeta
};