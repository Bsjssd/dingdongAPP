import React, { Component } from 'react'
import "./index.css"
import axios from 'axios'
import {LeftOutlined} from '@ant-design/icons';
import { Rate } from 'antd';

export default class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      title:"",
      shop:[]
    }
  }
  componentDidMount(){
    let type = this.props.location.search.slice(6);
    // let type = "经典西餐"
    this.setState({title:type})
    if(type === "专场派送"){
      axios({
        url:"/api/shops",
        method:"get"
      }).then((ok)=>{
        console.log(ok.data.data)
        this.setState({shop:ok.data.data})
      })
    }else{
      axios({
        url:"/api/typeList",
        method:"get",
        params:{type:type}
      }).then((ok)=>{
        console.log(ok.data.data)
        this.setState({shop:ok.data.data})
      })
    }
  }
  render() {
    let {title,shop} = {...this.state}
    return (
      <div className="shopList">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/home")}}/>{title}
        </header>

        <div className="partBox shopBox">
            {
              shop.map((v)=>{
                let path = "/detail?id="+v.id
                return (
                    <div className="shop_box" key={v.id} onClick={()=>{this.props.history.push(path)}}>
                      <div className="shopImg"><img src={v.logo}/></div>
                      <div className="shopCon">
                        <p className="shopTit">{v.title}</p>
                        <div className="shopCom">
                          <div className="shopXx"><Rate disabled defaultValue={v.star} /></div>
                          <span>月售{v.num}份</span>
                        </div>
                        <p className="shopPrice"><span>起送￥{v.start}</span><span>配送费￥{v.free}</span><span>{v.time}分钟送达</span></p>
                        <p className="shopFree"><span>免</span>订单满{v.mian}元免配送费</p>
                      </div>
                    </div>
                )
              })
            }
            </div>
      </div>
    )
  }
}
