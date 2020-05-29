import React, { Component } from 'react'
import Footer from '#/pages/footer'
import './index.css'
import {RightOutlined} from '@ant-design/icons'
import { Carousel,message } from 'antd';
import axios from "axios"
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

export default class My extends Component {
  constructor(props){
    super(props);
    this.state = {
      grid:[
        {title:"收藏",img:"/assets/my-sc.png"},
        {title:"红包/卡券",img:"/assets/my-kq.png"},
        {title:"评论",img:"/assets/my-pl.png"},
        {title:"消息",img:"/assets/my-xx.png"}
      ],
      path:["/collection","","/finish",""],
      username:'',
      flag:false,
      money:0.0,
      address:""
    }
  }
  componentDidMount(){
    let username = sessionStorage.getItem("token")
    if(username){
      axios({
        url:"/api/my",
        method:"get",
        params:{data:username}
      }).then((ok)=>{
        let data = ok.data.data.data[0];
        this.setState({
          username,
          flag:true,
          money:data.money,
          address:data.address.split("-")[1]
        })
      })
    }
  }
  go(path){
    let token = sessionStorage.getItem("token")
    if(token){
      this.props.history.push(path)
    }else{
      message.warning('请先登录', 1);
      this.props.history.push("/login")
    }
  }
  render() {
    let {grid,money,flag,username,path,address} = {...this.state};
    return (
      <div className="my">
        <header>
          <a href="#" onClick={()=>{this.props.history.push("/setting")}}><img src={require("../../img/sz.png")} alt="" /></a>
        </header>

        <section>
          <div className="content">
            <div className="user">
              <div className="userLeft">
                <a href="#" className="userImg"><img src={require("#/img/tx.jpg")} alt="" /></a>
                <div className="userTxt">
                  <p className="userName" style={flag?{display:"none"}:{display:"block"}} onClick={()=>{this.props.history.push("/login")}}>请登录</p>
                  <p className="userName" style={flag?{display:"block"}:{display:"none"}}>{username}</p>
                  <a href="#" className="userVip"><img src={require("../../img/pthy.png")} alt="" /></a>
                </div>
              </div>
              <a href="#" className="sign"><img src={require("../../img/qd.png")} /></a>
            </div>

            <div className="iconItem">
              {
                grid.map((v,i)=>{
                  return (
                    <a className="itemBox" key={i} onClick={this.go.bind(this,path[i])}>
                      <img src={v.img}/>
                      <span>{v.title}</span>
                    </a>
                  )
                })
              }
            </div>
          </div>

          <div className="banner">
            <Carousel autoplay className="bannerList" dots="false">
              <div>
                <img src={require("../../img/my-banner1.png")} />
              </div>
              <div>
                <img src={require("../../img/my-banner2.jpg")} />
              </div>
            </Carousel>
          </div>
          
          <ul className="list">
            <li className="listLi" >
              <img src="/assets/my-yhk.png" />
              <span>银行卡</span>
              <RightOutlined />
            </li>
            <li className="listLi" onClick={this.go.bind(this,"/money")}>
                <img src="/assets/my-ye.png" />
                <span>余额</span>
                <p>{money}</p>
                <RightOutlined />
            </li>
            <li className="listLi"  onClick={this.go.bind(this,"/address")}>
              <img src="/assets/my-dz.png" />
              <span>管理配送地址</span>
              <p>{address}</p>
              <RightOutlined />
            </li>
            <li className="listLi" >
              <img src="/assets/my-dw.png" />
              <span>其他</span>
              <RightOutlined />
            </li>
            <li className="listLi" >
              <img src="/assets/my-kf.png" />
              <span>售后服务</span>
              <RightOutlined />
            </li>
          </ul>
        </section>
        <Footer />
      </div>
    )
  }
}
