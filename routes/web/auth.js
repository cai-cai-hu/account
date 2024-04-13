var express = require('express');
var router = express.Router();
// 导入 用户的模型
const UserModel = require('../../models/UserModel')
const md5 = require('md5')
// 注册
router.get('/reg',(req,res) => {
  res.render('reg')
})

router.post('/reg',(req,res) => {
  UserModel.create({...req.body,password:md5(req.body.password)},(err,data) => {
    if(err){
      res.status(500).send('注册失败，请稍后再试')
      return
    }
    res.render('success',{msg:'注册成功',url:'/login'})

  })
})
// 登录页面
router.get('/login',(req,res) => {
  res.render('login')
})
// 登录操作
router.post('/login',(req,res) => {
  // 获取用户名和密码
  let {username,password} = req.body

  UserModel.findOne({username:username,password:md5(password)},(err,data) => {
    if(err){
      res.status(500).send('登录失败，请稍后重试')
      return
    }
    if(!data){
      return res.send('账号或密码错误')
    }
    req.session.username = data.username
    req.session._id = data._id
    res.render('success',{msg:'登录成功',url:'/account'})

  })
})
// 退出登录
router.post('/logout',(req,res) => {
  req.session.destroy(() => {
    res.render('success',{msg:'退出成功',url:'/login'})
  })
})
module.exports = router;
