import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import {HomeOutlined, UnorderedListOutlined, UserOutlined} from '@ant-design/icons'
import './index.css'
import axios from 'axios'

export default class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
      count:0
    }
  }
  componentDidMount(){
    let name = sessionStorage.getItem("token");
    if(name){
      axios({
        url:"/api/shopcar",
        method:"get",
        params:{user:name}
      }).then((ok)=>{
        this.setState({
          count:ok.data.data.data.length
        })
      })
    }
  }
  render() {
    return (
      <div className='footer'>
        <ul>
          <li className='footBox'>
            <NavLink to='/home'>
              <HomeOutlined />
              <span>首页</span>
            </NavLink>
          </li>
          <li className='footBox'>
              <NavLink to='/order'>
            {/* <Badge count={5}> */}
                <UnorderedListOutlined />
                <span>订单</span>
            {/* </Badge> */}
              </NavLink>
          </li>
          <li className='footBox'>
            <NavLink to='/my'>
              <UserOutlined />
              <span>我的</span>
            </NavLink>
          </li>
        </ul>
        {/* <Badge count={this.state.count}></Badge> */}
      </div>
    )
  }
}
