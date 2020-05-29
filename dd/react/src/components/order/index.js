import React, { Component } from 'react'
import Footer from '../../pages/footer'
import './index.css'
import {ReconciliationOutlined,MinusCircleOutlined,PlusCircleOutlined} from '@ant-design/icons';
import axios from 'axios'
import { Modal, message,Badge } from 'antd';

export default class Order extends Component {
  constructor(props){
    super(props)
    this.state = {
      flag:false,
      food:[],
      totle:0,
      money:0,
      visible: false,
      numarr:[],
      price:[],
      sum:0,
      bool:false     //判断页面是操作页面还是支付页面
    }
  }
  componentDidMount(){
    let name = sessionStorage.getItem("token");
    if(name){
      this.setState({
        flag:true
      })
      axios({
        url:"/api/shopcar",
        method:"get",
        params:{user:name}
      }).then((ok)=>{
        let data = ok.data.data.data;
        if(data.length === 0){
          this.setState({
            flag:false
          })
        }else{
          this.setState({
            food:data
          })
          //页面赋值
          var numarr = [];
          var price = [];
          // var sum = 0;
          console.log(this.state.food)
          for(var i=0;i<this.state.food.length;i++){
            numarr.push(Number(this.state.food[i].num))
            price.push(Number(this.state.food[i].price))
            this.setState({numarr:numarr,price:price})    //数量  单价
            // var x = this.state.numarr[i]*this.state.price[i]
            // sum = sum+x
            // this.setState({sum:sum})    //总价
            this.sum()
          }
          console.log(this.state.price,this.state.sum)
        }
      })
    }else{
      this.setState({
        flag:false
      })
    }
  }
  //数量加减
  Change(x,i,id){
    console.log(x,i,id)
    var num = this.state.numarr[i] + x;
    if(num > 0){
      this.state.numarr[i] = num;
      this.setState({numarr:this.state.numarr})
      //更改数量后再次计算总价
      this.sum()
      axios({
        url:"/api/changeNum",
        method:"get",
        params:{"data":[num,id]}
      }).then((ok)=>{
        console.log(ok)
      })
    }else{
      message.error('不能再减了',1);
    }
  }
  //总价计算
  sum=(y)=>{
    var sum = 0;
    for(var i=0;i<this.state.numarr.length;i++){
      var x = this.state.numarr[i]*this.state.price[i]
      sum = sum+x
      this.setState({sum:sum})
    }
    if(y){this.setState({sum:this.state.sum-y})}
    console.log(this.state.sum)
  }

  //操作
  headBtn=()=>{
    this.setState({bool:!this.state.bool})
  }
  //删除商品
  delete(i,id){
    var x = this.state.price[i] * this.state.numarr[i];
    this.state.food.splice(i,1)
    this.state.price.splice(i,1)
    this.state.numarr.splice(i,1)
    this.setState({
      food:this.state.food,
      price:this.state.price,
      numarr:this.state.numarr
    })
    axios({
      url:'/api/deletegoods',
      method:'get',
      params:{id:id}
    }).then((ok)=>[
      console.log(ok)
    ])
    console.log(x)
    this.sum(x)
  }
  render() {
    let {flag,food,totle,numarr,sum,bool} = {...this.state}
    return (
      <div className="order">
        <header>
          订单页
          <span className="headBtn" onClick={this.headBtn} style={flag?{display:"block"}:{display:"none"}}>操作</span>
        </header>
        <section>
          <div className="nullcar" style={flag?{display:"none"}:{display:"block"}}>
            <ReconciliationOutlined />
            <p>暂无订单</p>
          </div>

          <ul className="list" style={flag?{display:"block"}:{display:"none"}}>
            {
              food.map((v,i)=>{
                return (
                  <li key={v._id}>
                    <img src={v.img}/>
                    <div className="con">
                      <p>{v.title}</p>
                      <p>{v.con}</p>
                      <p>￥{v.price}</p>
                    </div>
                    <div className="num" style={bool?{display:"none"}:{display:"flex"}}>
                      <MinusCircleOutlined onClick={this.Change.bind(this,-1,i,v._id)}/>
                      <span className="price" ref={(foodPri)=>{this.foodPri = foodPri}}>{numarr[i]}</span>
                      <PlusCircleOutlined onClick={this.Change.bind(this,1,i,v._id)}/>
                    </div>
                    <p style={{display:"none"}}>{v.price*v.num}</p>
                    <div className="del" style={bool?{display:"block"}:{display:"none"}} onClick={this.delete.bind(this,i,v._id)}>删除</div>
                  </li>
                )
              })
              
            }
          </ul>

          <div className="totBox" style={flag?{display:"flex"}:{display:"none"}}>
            <div className="totle">
              <p className="foodnum">共计{food.length}件商品</p>
              <p className="foodprice">总计：￥<span>{sum}</span></p>
            </div>
            <div className="pay" onClick={()=>{this.props.history.push("/placeorder")}} style={bool?{display:"none"}:{display:"block"}}>去支付</div>
            
          </div>

        </section>
        <Footer />
        <div className="badge">
          <Badge count={food.length}></Badge>
        </div>
      </div>
    )
  }
}
