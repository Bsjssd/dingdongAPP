import React, { Component } from 'react'
import './index.css'
import {LeftOutlined,RightOutlined} from '@ant-design/icons';
import { message,Modal } from 'antd';
import axios from 'axios'

export default class Placeorder extends Component {
  constructor(props){
    super(props);
    this.state = {
      money:0,
      data:{},
      food:[],
      visible:false,
      sum:0,
      flag:false
    }
  }
  componentDidMount(){
    let name = sessionStorage.getItem("token");
    //获取商品信息
    axios({
      url:"/api/shopcar",
      method:"get",
      params:{user:name}
    }).then((ok)=>{
      let data = ok.data.data.data;
      this.setState({food:data})
      var sum = 0;
      for(var i=0;i<this.state.food.length;i++){
        var x = this.state.food[i].num * Number(this.state.food[i].price)
        sum += x;
      }
      this.setState({sum:sum})
      console.log(this.state.sum)
    })
    //获取地址信息
    var id = this.props.location.search.slice(4);
    console.log(id)
    if(id){
      axios({
        url:'/api/orderaddress',
        method:'get',
        params:{id}
      }).then((ok)=>{
        console.log(ok.data.data.data[0])
        this.setState({data:ok.data.data.data[0]})
        console.log(this.state.data)
        //判断地址是否获取
        if(ok.data.data.data.length>0){
          this.setState({flag:true})
        }else{
          this.setState({flag:false})
        }
        console.log(this.state.flag)
      })
    }
  }
    //支付
  pay(totle){
    let username = sessionStorage.getItem("token")
    axios({
      url:"/api/my",
      method:"get",
      params:{data:username}
    }).then((ok)=>{
      let money = ok.data.data.data[0].money;
      this.setState({
        money:money
      })
      console.log(this.state.money)
      if(totle>this.state.money){
        message.error('余额不足，请充值',1);
        this.props.history.push("/money");
      }else{
        //支付成功
        axios({
          url:"/api/pay",
          method:"get",
          params:{username:username,totle:totle}
        }).then((ok)=>{
          console.log(ok)
          this.props.history.push("/pay");
        })
        message.success('支付成功',1);
        axios({
          url:"/api/finish",
          method:"get"
        }).then((ok)=>{
          console.log(ok)
        })
      }
    })
    this.setState({
      visible: false,
    });
  }
  showModal = () => {
    if(this.state.flag){
      this.setState({ visible: true});
    }else{
      message.warning('请确定地址信息',1);
    }
  };
  handleCancel = e => {
    this.setState({visible: false});
  };

  render() {
    let {data,food,sum,flag} = {...this.state}
    return (
      <div className="place">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/order")}}/>提交订单
        </header>

        <div className="context">
          <div className="pathBox">
            <div className="tit">配送信息</div>
            <div className="cen" style={flag?{display:"block"}:{display:"none"}}>
              <div className="nameBox">
                <p className="txt">{data.name}</p>
                <p className="txt">{data.phone}</p>
              </div>
              <div className="path">{data.path}</div>
            </div>
            <div className="cen cen1" style={flag?{display:"none"}:{display:"block"}}  onClick={()=>{this.props.history.push("/address?type=pay")}}>请选择地址</div>
            <RightOutlined onClick={()=>{this.props.history.push("/address?type=pay")}}/>
          </div>

          <div className="orderBox">
            <div className="tit">订单信息</div>
            <ul className="list">
            {
              food && food.map((v)=>{
                return (
                  <li key={v._id}>
                    <img src={v.img}/>
                    <div className="con">
                      <p>{v.title}</p>
                      <p>{v.con}</p>
                      <p>￥{v.price}</p>
                    </div>
                    <div>x{v.num}</div>
                  </li>
                )
              })
            }
            </ul>
          </div>

          <Modal
            title="确认支付"
            visible={this.state.visible}
            onOk={this.pay.bind(this,sum)}
            onCancel={this.handleCancel}
          >
            <p>商品共计{sum}元</p>
          </Modal>
        </div>

        
          <div className="btn" onClick={this.showModal}>确认支付</div>
      </div>
    )
  }
}
