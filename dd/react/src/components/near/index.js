import React, { Component } from 'react'
import './index.css'
import {LeftOutlined,ExclamationCircleTwoTone,ShopFilled,EnvironmentFilled } from '@ant-design/icons';
import { Spin } from 'antd';
import axios from 'axios'

export default class Near extends Component {
  constructor(props){
    super(props)
    this.state = {
      data:[],
      spin:false
    }
  }
  componentDidMount(){
    console.log(sessionStorage.getItem('location'))
    var location = sessionStorage.getItem('location');
    // 108.9823076111145,32.696616445029804   安康学院坐标
    axios({
      url:'https://restapi.amap.com/v3/place/around?key=c29e9119013f6728f33f2afed9495200&location='+location+'&types=050000',
      method:'get'
    }).then((ok)=>{
      var data = ok.data.pois;
      console.log(data)
      this.setState({spin:true})
      setTimeout(()=>{
        this.setState({data:data,spin:false})
      },2000)
    })
  }
  render() {
    var {data,spin} = {...this.state}
    return (
      <div className="near">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/home")}}/>附近美食
        </header>

        <div className="info">
          <ExclamationCircleTwoTone twoToneColor="#fe8103"/>
          <div>为您提供离您最近的商家，由于商家暂时还未入驻平台，您可以选择到店就餐，同时向您提供商家地址。目前开发人员还在努力，请谅解...</div>
        </div>
        <ul className="list">
          {
            data && data.map((v)=>{
              return (
                <li key={v.name}>
                  <div><ShopFilled /><p>{v.name}</p></div>
                  <div><EnvironmentFilled /><p className="txt2">{v.address!=''?v.address:'地址暂时不详，我们会努力更新...'}</p></div>
                </li>
              )
            })
          }
        </ul>

        <Spin tip="正在获取定位..." style={spin?{display:'block'}:{display:'none'}}></Spin>
      </div>
    )
  }
}
