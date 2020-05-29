import React, { Component } from 'react'
import './index.css'
import {LeftOutlined,MoneyCollectOutlined} from '@ant-design/icons'
import { Modal, message  } from 'antd';
import axios from 'axios'

export default class Money extends Component {
  constructor(props){
    super(props);
    this.state = {
      money:0.0,
      visible: false,
      recharge:0
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  componentDidMount(){
    let username = sessionStorage.getItem("token")
    if(username){
      // let money = 0.0;
      axios({
        url:"/api/my",
        method:"get",
        params:{data:username}
      }).then((ok)=>{
        let data = ok.data.data.data[0];
        this.setState({
          money:data.money,
        })
      })
    }
  }
  recharge(){
    let money = this.moneyInp.value;
    let username = sessionStorage.getItem("token")
    this.setState({
      visible: false,
    });
    axios({
      url:"/api/recharge",
      method:"get",
      params:{"data":money,"uname":username}
    }).then((ok)=>{
      console.log(ok.data.data)
      message.success("充值成功",1)
      this.props.history.push("/my")
    })
  }
  render() {
    let {money} = {...this.state}
    return (
      <div className="money">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/my")}}/>
          <p>钱包</p>
        </header>
        <p className="head">我的钱包</p>
        <div className="con">
          <MoneyCollectOutlined />
          <p>{money}</p>
        </div>
        <div className="btnBox">
          <button className="btn" onClick={this.showModal}>充值</button>
        </div>

        <Modal
          title="输入金额"
          visible={this.state.visible}
          onOk={this.recharge.bind(this)}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <input id="Inp" placeholder="输入充值金额" ref={(moneyInp)=>{this.moneyInp = moneyInp}}/>
        </Modal>
      </div>
    )
  }
}
