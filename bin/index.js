#! /usr/bin/env node

const program = require('commander')
const Table = require('cli-table2') // 表格输出
const superagent = require('superagent') // http请求
// 初始化commander
program
  .allowUnknownOption()
  .version('0.0.1')
  .usage('yd <cmd> [input]');

// 有道api
const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=toaijf&key=868480929&type=data&doctype=json&version=1.1'

let argv = process.argv;


program
  .command('t <word...>')
  .description('翻译命令')
  .action(function (word) {
    let content = word.join(' ');
    superagent.get(API)
      .query({q: content})
      .end(function (err, res) {
        if (err) {
          console.log('err', err);
          return false;
        }
        let data = JSON.parse(res.text)
        let result = {}
        // 返回的数据处理
        if (data.basic) {
          result[word] = data['basic']['explains']
        } else if (data.translation) {
          result[word] = data['translation']
        } else {
          console.error('error')
        }

        // 输出表格
        let table = new Table()
        table.push(result)
        console.log(table.toString())
      })
  });

program.parse(argv);