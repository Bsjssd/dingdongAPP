import React, { Component } from 'react'
import { Result, Button } from 'antd';

export default class Pay extends Component {
  render() {
    return (
      <div style={{height:".5rem",backgroundColor:"#FE8103",fontSize:".18rem",textAlign:"center",lineHeight:".5rem"}}>
        <header>
          支付成功
        </header>
        <Result
          status="success"
          title="支付成功!"
          subTitle="您可以选择继续购买或者查看订单."
          extra={[
            <Button type="primary" key="console" onClick={()=>{this.props.history.push("/finish")}}>
              返回订单
            </Button>,
            <Button key="buy" onClick={()=>{this.props.history.push("/home")}}>继续逛逛</Button>,
          ]}
        />
      </div>
    )
  }
}
