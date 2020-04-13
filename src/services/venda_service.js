const db = require('../../config/database');

exports.getVendas = () => {
    let sql = `select * from venda where id_venda < 7000`;
    return new Promise((resolve, reject) => {
        var conn = db.connect();
        conn.query(sql, function(err, rows, fields) {
            db.disconnect(conn);
            if (err) {
                console.log(err)
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    })
}