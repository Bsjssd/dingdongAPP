import React, { Component } from 'react'
import {LeftOutlined} from '@ant-design/icons';
import './index.css';
import { message } from 'antd';
import axios from 'axios'
//登录成功提示框
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

export default class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:"sanxiong",
      password:"123456"
    }
  }
  componentDidMount(){
    
  }
  reg=()=>{
    let phone = this.phoInput.value;
    let username = this.userInput.value;
    let password = this.pwdInput.value;
    if(phone && username && password){
      let parmas = new URLSearchParams();
      parmas.append("data",[phone,username,password]);
      axios({
        url:"/api/register",
        method:"post",
        data:parmas
      }).then((ok)=>{
        console.log(ok.data.data)
        let data = ok.data.data;
        const hide = message.loading('正在注册...', 0);
        setTimeout(hide, 1400);
        setTimeout(()=>{
          if(data.id === 0){
            message.success('注册成功',1)
            this.props.history.push('/home');
          }else{
            message.warning('注册失败，用户名或手机号已存在', 1);
          }
        },1500)
      })
    }else{
      message.warning('手机号码、用户名或密码不能为空',1)
    }

  }
  back=()=>{
    this.props.history.push('/login');
  }
  render() {
    return (
      <div className="res">
        <header>
          <div onClick={this.back}><LeftOutlined />&nbsp;返回</div>
          <p>注册</p>
        </header>
        <div className="part_2">
          <img src={require("../../img/tx.jpg")}/>
          <span>请注册</span>
        </div>
        <section className="sec_one">
          <input type="text" className="username" placeholder="请输入手机号码" ref={(phoInput)=>{this.phoInput = phoInput}}/>
          <input type="text" className="username" placeholder="请设置用户名" ref={(userInput)=>{this.userInput = userInput}}/>
          <input type="password" id="password" className="pwd" placeholder="请设置密码" ref={(pwdInput)=>{this.pwdInput = pwdInput}}/>
          <button className="btn button" onClick={this.reg}>立即注册</button>
          <p>注册表示您已同意<a href="#">《注册协议》</a></p>
        </section>
      </div>
    )
  }
}
