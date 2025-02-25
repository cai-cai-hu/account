var express = require('express');
var router = express.Router();
//导入 lowdb

//导入 moment
// const moment = require('moment');
const moment = require('moment')
const AccountModel = require('../../models/AccountModel');
// 声明中间件检测登录
let checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

//记账本的列表
router.get('/account', checkLoginMiddleware,function(req, res, next) {
  
  //获取所有的账单信息
  // let accounts = db.get('accounts').value();
  //读取集合信息
  // AccountModel.find().sort({time: -1}).exec((err, data) => {
  //   if(err){
  //     res.status(500).send('读取失败~~~');
  //     return;
  //   }
  //   //响应成功的提示
  //   res.render('list', {accounts: data, moment: moment});
  // })
  AccountModel.find().sort({time:-1}).exec((err,data) => {
    if(err){
      res.status(500).send('读取失败')
      return;
    }
    res.render('list',{accounts:data,moment:moment})
  })
});

//添加记录
router.get('/account/create',checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

//新增记录
router.post('/account',checkLoginMiddleware, (req, res) => {
  //插入数据库
    AccountModel.create({
      ...req.body,
      time:moment(req.body.time).toDate()
    },(err,data) => {
      if(err){
        res.status(500).send('插入失败~~~~')
        return;
      }
      res.render('success', {msg: '添加成功哦~~~', url: '/account'});
    })
    //成功提醒
    
  
});

//删除记录
router.get('/account/:id',checkLoginMiddleware, (req, res) => {
  //获取 params 的 id 参数
  let id = req.params.id;
  //删除
  // AccountModel.deleteOne({_id: id}, (err, data) => {
  //   if(err) {
  //     res.status(500).send('删除失败~');
  //     return;
  //   }
  //   //提醒
  //   res.render('success', {msg: '删除成功~~~', url: '/account'});
  // })
  AccountModel.deleteOne({_id:id},(err,date) => {
    if(err) {
      res.status(500).send('删除失败')
      return;
    }
    res.render('success',{msg:'删除成功',url:'/account'})
  })
});

router.get('/',(req,res) => {
  res.redirect('/account')
})

module.exports = router;
