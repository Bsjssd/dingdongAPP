import React, { Component } from 'react';
import './index.css'
import {LeftOutlined} from '@ant-design/icons';
import { message } from 'antd';
import axios from 'axios'
//登录成功提示框
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

export default class Login extends Component {
  // constructor(props){
  //   super(props)
  // }
  login=()=>{
    let username = this.userInput.value;
    let password = this.pwdInput.value;
    if(username && password){
      let params = new URLSearchParams();
      params.append("data",[username,password])
      axios({
        url:'/api/login',
        method:"post",
        data:params
      }).then((ok)=>{
        console.log(ok.data.data)
        let data = ok.data.data;
        const hide = message.loading('登录中...', 0);
        setTimeout(hide, 1400);
        if(data.id === 0){
          setTimeout(()=>{
            message.success('登录成功', 1);   //登录成功后弹出的提示框
            sessionStorage.setItem('token',data.data[0].username)
            this.props.history.push('/home');
          },1500)
        }else{
          setTimeout(()=>{
            message.warning('用户名或密码错误', 1);   //登录失败
          },1500)
        }
      })
    }else{
      message.warning('用户名或密码不能为空',1)
    }
  }
  render() {
    return (
      <div className="login">
        <header>
          <img src={require("../../img/tx.jpg")}/>
          <p>请登录</p>
          <div onClick={()=>{this.props.history.push("/home")}}><LeftOutlined />&nbsp;返回首页</div>
        </header>
        <section className="sec_one">
          <input type="text" id="username" placeholder="请输入用户名" ref={(userInput)=>{this.userInput = userInput}}/>
          <input type="password" id="password" placeholder="请输入密码" ref={(pwdInput)=>{this.pwdInput = pwdInput}}/>
          <button id="login" className="btn button" onClick={this.login}>立即登录</button>
          <div className="link">
            <a href="#">忘记密码</a>
            <a href="#" onClick={()=>{this.props.history.push('/register');}}>没有账户?立即注册>></a>
          </div>
          <p className="fgx">第三方登录</p>
          <div className="threeParty">
            <a href="#"><img src={require("../../img/wx.png")} /></a>
            <a href="#"><img src={require("../../img/QQ.png")} /></a>
          </div>
        </section>
      </div>
    )
  }
}
