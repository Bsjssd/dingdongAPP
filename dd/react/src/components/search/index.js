import React, { Component } from 'react'
import './index.css'
import {LeftOutlined,FrownTwoTone} from '@ant-design/icons';
import { Rate,message } from 'antd';
import axios from 'axios'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      data:[],
      words:[]
    }
  }
  cofrim=()=>{
    var keyword = this.keyword.value
    if(keyword){
      axios({
        url:'/api/search',
        method:'get',
        params:{keyword}
      }).then((ok)=>{
        console.log(ok.data.data.data)
        this.setState({data:ok.data.data.data})
        if(this.state.data.length>0){
          this.setState({kong:2})
        }else{
          this.setState({kong:1})
        }
        console.log(this.state.kong)
      })
      this.state.words.push(keyword)
      this.setState({words:this.state.words})
      console.log(this.state.words)
    }else{
      message.warning('请输入搜索内容',1)
    }
  }
  render() {
    let {words,data,kong} = {...this.state}
    return (
      <div className="search">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/home")}}/>搜索
        </header>

        <div className="context">
          <div className="ssBox">
            <input type="text" className="inp" placeholder="输入想要搜索的内容..." ref={(keyword) => {this.keyword = keyword}}/>
            <span className="ssBtn" onClick={this.cofrim}>搜索</span>
          </div>
          <div className="record">
            <div className="recordTit">搜索记录</div>
            <ul className="recordList">
              {
                words && words.map((v,i)=>{
                  return (
                    <li key={i}>{v}</li>
                  )
                })
              }
            </ul>

            <div className="partBox shopBox">
              <div className="recordTit" style={data.length>0?{display:'block'}:{display:'none'}}>搜索结果</div>
              {
                data && data.map((v)=>{
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
                        <p className="shopPrice"><span>起送￥{v.start}</span><span>配送费￥{v.free}</span><span>约{v.time}分钟送达</span></p>
                        <p className="shopFree"><span>免</span>订单满{v.mian}元免配送费</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        <div className="null" style={kong && kong==1?{display:'block'}:{display:'none'}}>
          <FrownTwoTone twoToneColor="#FE8103"/>
          <p>店铺正在加盟，暂无搜索结果...</p>
        </div>
      </div>
    )
  }
}
