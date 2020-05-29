import React, { Component } from 'react'
import { Result, Button } from 'antd';
import './index.css'

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面没有找到！"
          extra={<Button type="primary" onClick={()=>{this.props.history.push("/home")}} >返回首页</Button>}
        />
      </div>
    )
  }
}
