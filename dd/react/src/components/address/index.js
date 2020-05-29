import React, { Component } from 'react'
import './index.css'
import {LeftOutlined,BorderInnerOutlined} from '@ant-design/icons';
import axios from 'axios'

export default class Address extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[]
    }
  }
  type(path){
    var type = this.props.location.search.slice(6);
    console.log(type)
    //判断是从哪个页面跳转过来 并返回
    if(type == 'pay'){
      this.props.history.push('/placeorder')
    }else{
      this.props.history.push(path)
    }
  }
  go(path){
    this.props.history.push(path)
  }
  componentDidMount(){
    let user = sessionStorage.getItem("token");
    axios({
      url:'/api/addresses',
      method:'get',
      params:{user:user}
    }).then((ok)=>{
      // console.log(ok.data.data.data)
      this.setState({
        data:ok.data.data.data
      })
    })
  }

  down(id){
    var type = this.props.location.search.slice(6);
    if(type == 'pay'){
      this.props.history.push('/placeorder?id='+id)
    }
  }
  
  render() {
    let {data} = {...this.state};
    console.log(data)
    return (
      <div className="adds">
        <header>
          <LeftOutlined onClick={this.type.bind(this,"/my")}/>
          <p>管理配送地址</p>
          <BorderInnerOutlined  onClick={this.go.bind(this,"/add?type=add")}/>
        </header>



        <ul className="list">
          {
            data.map((v,i)=>{
              let path = v._id+','+v.name+','+v.sex+','+v.phone+','+v.path;
              return (
                <li key={i}>
                  <div onClick={this.down.bind(this,v._id)}>
                    <div className="nameBox">
                      <p className="txt">{v.name}</p>
                      <p className="txt">{v.phone}</p>
                    </div>
                    <div className="path">{v.path}</div>
                  </div>
                  <div className="btn" onClick={this.go.bind(this,'/add?type=modify&'+path)}>修改信息</div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
