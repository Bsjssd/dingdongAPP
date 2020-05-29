import React, { Component } from 'react'
import "./index.css"
import axios from 'axios'
import {ReconciliationOutlined,LeftOutlined} from '@ant-design/icons';

export default class Finish extends Component {
  constructor(props){
    super(props);
    this.state = {
      flag:false,
      data:[],
      shop:0
    }
  }
  componentDidMount(){
    axios({
      url:"/api/finishs",
      method:"get"
    }).then((ok)=>{
      console.log(ok.data.data.data)
      let data = ok.data.data.data;
      if(data.length === 0){
        this.setState({flag:false})
      }else{
        this.setState({
          flag:true,
          data:data
        })
      }
    })
  }
  go(path,id){
    // console.log(path,id)
    this.props.history.push(path+"?id="+id)
  }
  render() {
    let {flag,data} = {...this.state}
    return (
      <div className="finish">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/my")}}/>完成订单
        </header>
        
        <div className="nullcar" style={flag?{display:"none"}:{display:"block"}}>
          <ReconciliationOutlined />
          <p>暂无完成订单</p>
        </div>

        <ul className="list" style={flag?{display:"block"}:{display:"none"}}>
            {
              data.map((v)=>{
                return (
                  <li key={v._id}>
                    <img src={v.img}/>
                    <div className="con">
                      <p>{v.title}</p>
                      <p>{v.con}</p>
                      <p>￥{v.price}</p>
                    </div>
                    {/* <CheckCircleOutlined /> */}
                    <button onClick={this.go.bind(this,"/evaluate",v.shop)}>去评价</button>
                  </li>
                )
              })
              
            }
          </ul>
      </div>
    )
  }
}
