import React, { Component } from 'react'
import {LeftOutlined} from '@ant-design/icons'
import './inde.css'
import axios from "axios"

export default class Setting extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:{},
      flag:false,
      tx:"/assets/user/yhtx.png"
    }
  }
  quit=()=>{
    sessionStorage.clear();
    this.props.history.push("/home");
  }
  componentDidMount(){
    let name = sessionStorage.getItem("token");
    if(name){
      this.setState({
        flag:true
      })
    }else{
      this.setState({
        flag:false
      })
    }
    let params = new URLSearchParams();
    params.append("data",name)
    axios({
      url:'/api/setting',
      method:"post",
      data:params
    }).then((ok)=>{
      this.setState({
        data:ok.data.data.data[0]
      })
      console.log(this.state.data)
    })
  }
  render() {
    let {data,flag,tx} = {...this.state}
    return (
      <div className="set">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/my")}}/>
          <p>设置</p>
        </header>

        <ul className="list">
          <li>
            <span>头像</span>
            <img src={flag?data.img:tx} className="tx"/>
            {/* <p>{flag?data.username:"未登录"}</p> */}
          </li>
          <li>
            <span>用户名</span>
            <p>{flag?data.username:"未登录"}</p>
          </li>
          <li>
            <span>电话号码</span>
            <p>{flag?data.phone:"未登录"}</p>
          </li>
        </ul>

        <button disabled style={flag?{display:"none"}:{display:"block"}} className="button">退出登录</button>
        <button onClick={this.quit} className="btn button" style={flag?{display:"block"}:{display:"none"}}>退出登录</button>
      </div>
    )
  }
}