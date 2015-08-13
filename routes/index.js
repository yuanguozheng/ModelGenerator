var express = require('express');
var router = express.Router();
var request = require('request');

var parsed = new Array();

/* GET home page. */
router.get('/', function (req, res, next) {
    parsed = new Array();
    request(
        {
            uri: 'http://api.xiyoumobile.com/xiyoulibv2/news/getList/announce/1',
            encoding: null
        }, function (err, response, body) {
            var result = JSON.parse(body);
            showData(result);
            console.log(parsed);
            res.render('index', {parsed: parsed});
        });
});

function showData(data) {
    var result = new Array();
    for (var item in data) {
        if (typeof data[item] != "object") {
            result.push({name: item, type: getType(typeof data[item], data[item])});
        } else if (data[item] instanceof Array) {
            showData(data[item][0]);
            result.push({name: item, type: getType("array")});
        } else {
            showData(data[item]);
            result.push({name: item, type: getType("class")});
        }
    }
    parsed.push(result);
};

function getType(rawType, value) {
    switch (rawType) {
        case "string":
            return "String";
        case "boolean":
            return "Boolean";
        case "number":
            return value.toString().indexOf(".") ? "double" : "int";
        case "array":
            return "List";
        default:
            return rawType;
    }
}

module.exports = router;
