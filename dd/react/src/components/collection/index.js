import React, { Component } from 'react'
import {LeftOutlined,DropboxOutlined} from '@ant-design/icons'
import { Rate, Result, Button } from 'antd';
import axios from "axios"
import './index.css'

export default class Collection extends Component {
  constructor(props){
    super(props)
    this.state = {
      data:[],
      shop:[],
      flag:false,
      choose:false
    }
  }
  go(path){
    this.props.history.push(path)
  }
  componentDidMount(){
    let name = sessionStorage.getItem("token")
    axios({
      url:"/api/collPage",
      method:"get",
      params:{user:name}
    }).then((ok)=>{
      let data = ok.data.data.data;
      if(data.length > 0){
        this.setState({choose:true})
      }else{
        this.setState({choose:false})
      }
      this.setState({shop:ok.data.data.data})
    })
  }
  set=()=>{
    this.setState({flag:!this.state.flag})
  }
  remove(user,shopId,i){
    console.log(i)
    this.state.shop.splice(i,1);
    this.setState({shop:this.state.shop})
    axios({
      url:"/api/removeColl",
      method:"get",
      params:{user,shopId}
    }).then((ok)=>{
      console.log(ok.data.data)
    })
  }
  render() {
    let {shop,flag,choose} = {...this.state}
    return (
      <div className="coll">
        <header>
          <LeftOutlined onClick={this.go.bind(this,"/my")}/>
          <p>我的收藏</p>
          <p onClick={this.set}>{flag?"完成":"编辑"}</p>
        </header>

        <div className="null" style={choose?{display:"none"}:{display:"block"}}>
          <Result
            icon={<DropboxOutlined />}
            title="您还没有宠幸任何一个美食店铺呢!"
            extra={<Button type="primary" onClick={this.go.bind(this,"/home")}>马上逛逛</Button>}
          />
        </div>

        <ul className="list" style={choose?{display:"block"}:{display:"none"}}>
          {
            shop.map((v,i)=>{
              return (
                <li className="listLi" key={v._id}>
                  <img src={v.img}/>
                  <div className="text">
                    <p className="title">{v.title}</p>
                    <Rate disabled defaultValue={v.star} />
                    <p className="con">{v.con}</p>
                  </div>
                  <button style={flag?{display:"block"}:{display:"none"}} onClick={this.remove.bind(this,v.user,v.shopId,i)}>取消收藏</button>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
