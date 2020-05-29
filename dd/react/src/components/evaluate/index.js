import React, { Component } from 'react'
import './index.css'
import {LeftOutlined} from '@ant-design/icons';
import { Rate, message } from 'antd';
import axios from 'axios'

const desc = ['很差', '一般', '满意', '非常满意', '无可挑剔'];

export default class Evaluate extends Component {
  constructor(props){
    super(props);
    var today = new Date(),
            date = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
    this.state={
      shop:{},
      value:0,
      date:date,
      img:"",
      user:""
    }
  }
  componentDidMount(){
    let id = this.props.location.search.slice(4);
    axios({
      url:"/api/evalpage",
      method:"get",
      params:{id:id}
    }).then((ok)=>{
      console.log(ok.data.data.data[0])
      this.setState({
        shop:ok.data.data.data[0]
      })
    })
    console.log(this.state.date)
  }
  //获取评分
  handleChange = value => {
    this.setState({ value });
  };
  //提交添加评论
  submit(score){
    let text = this.textInp.value;
    let name = sessionStorage.getItem("token");
    // 获取个人信息
    axios({
      url:"/api/my",
      method:"get",
      params:{data:name}
    }).then((ok)=>{
      console.log(ok.data.data.data[0])
      let data = ok.data.data.data[0];
      this.setState({
        img:data.img,
        user:data.username
      })
      // 添加评论
      if(score != 0){
        let shopId = Number(this.props.location.search.slice(4));
        let {img,user,date} = {...this.state}
        axios({
          url:"/api/addeval",
          method:"get",
          params:{data:{shopId:shopId,con:text,score:score,img:img,user:user,date:date}}
        }).then((ok)=>{
          console.log(ok)
          message.success('评论成功',1);
          this.props.history.push("/finish");
        })
      }else{
        message.warning('请选择评分',1);
      }
    })
  }
  render() {
    let {shop,value} = {...this.state}
    
    return (
      <div className="eval">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.push("/finish")}}/>评论商家
        </header>

        <div className="box">
          <div className="head">您对商家/菜品满意么?</div>
          <div className="shop">
            <img src={shop.logo} />
            <p>{shop.title}</p>
          </div>
          <div className="pf">
            <p>评分</p>
            <span>
              <Rate onChange={this.handleChange} value={value} />
              {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
            </span>
          </div>
          {/* <input /> */}
          <textarea placeholder="口味赞，包装好，推荐给大家" ref={(textInp) => {this.textInp = textInp}}></textarea>
        </div>
        <p className="btn" onClick={this.submit.bind(this,value)}>提交评论</p>
      </div>
    )
  }
}
