import React, { Component } from 'react'
import {LeftOutlined, ShoppingCartOutlined, StarOutlined, StarFilled, EllipsisOutlined, DashboardOutlined, MoneyCollectOutlined} from '@ant-design/icons';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { BackTop, message, Rate } from 'antd';
import './index.css'
import axios from 'axios'

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});


export default class Detail extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:{},
      item:[],
      detail:[],
      flag:false,
      search:"",
      choose:true,
      success:false,
      evaluate:[]
    }
  }
  componentDidMount(){
    this.setState({
      search:this.props.location.search
    })
    let id = this.props.location.search.slice(4);   //截取字符串
    //获取详情页菜品
    axios({
      url:"/api/detail",
      method:"get",
      params:{id:id}
    }).then((ok)=>{
      let data = ok.data.data;
      if(data.id === 0){
        //console.log(ok.data.data.data)
        this.setState({
          data:data.data.shop[0],
          detail:data.data.detail[0].item,
          success:true
        })
        let item = this.state.data.item.split(",");
        this.setState({
          item:item
        })
        //console.log(this.state.item)
      }
    })
    //获取该商店评论数据
    console.log(id)
    axios({
      url:"/api/evaluate",
      method:"get",
      params:{id:id}
    }).then((ok)=>{
      console.log(ok.data.data.data)
      this.setState({
        evaluate:ok.data.data.data
      })
    })
    //判断该店铺是否被该用户所收藏
    let name = sessionStorage.getItem("token");
    axios({
      url:"/api/collChooes",
      method:"get",
      params:{user:name,shopId:id}
    }).then((ok)=>{
      if(ok.data.data.id === 0){
        this.setState({flag:true})
      }
    })
  }
  //收藏
  collect=()=>{
    //收藏操作    收藏成功   取消收藏
    let name = sessionStorage.getItem("token");
    let id = Number(this.props.location.search.slice(4));
    if(name){
      axios({
        url:"/api/collection",
        method:"get",
        params:{data:{user:name,shopId:id,data:this.state.data}}
      }).then((ok)=>{
        console.log(ok.data.data)
        if(ok.data.data.id === 0){
          this.setState({flag:true})
        }else{
          this.setState({flag:false})
        }
      })
      //判断收藏和未收藏的提示框
      if(this.state.flag){
        message.warning('取消收藏',1);   //提示框
      }else{
        message.success('收藏成功',1)
      }
    }else{
      message.warning('未登录，请登录后再收藏',1);
      this.props.history.push("/login")
    }
  }
  //菜单评论跳转
  go=function(path){
    if(path === "/evaluate"){
      this.setState({choose:false})
    }else{
      this.setState({choose:true})
    }
  }
  //添加购物车
  add(food){
    let name = sessionStorage.getItem("token");
    axios({
      url:"/api/add",
      method:"get",
      params:{food:[food],user:name}
    }).then((ok)=>{
      console.log(ok.data.data)
      let data = ok.data.data;
      if(data.id === 0){
        message.success('添加成功',1)
      }else{
        message.warning('该商品已存在购物车', 1);
      }
    })
  }
  render() {
    let {data,flag,choose,contect,evaluate} = {...this.state}
    // console.log(this.state.detail)
    return (
      <div className="detail">
        <header>
          <span onClick={()=>{this.props.history.push("/home")}}><LeftOutlined /></span>
          <input placeholder="请输入商品名称" />
          <ShoppingCartOutlined  onClick={()=>{this.props.history.push("/order")}}/>
          <StarOutlined style={flag?{display:"none"}:{display:"block"}} onClick={this.collect}/>
          <StarFilled style={flag?{display:"block"}:{display:"none"}} onClick={this.collect} className="star"/>
          <EllipsisOutlined />
        </header>

        <section>
          <div className="head">
            <img src={data.img} className="bigImg"/>
            <div className="shopDet">
              <p className="title">{data.title}</p>
              <div className="time"><DashboardOutlined /><span className="timeTxt">配送约{data.time}分钟</span></div>
              <div className="time"><MoneyCollectOutlined /><span className="timeTxt">满{data.mian}元免费配送</span></div>
              <p className="notice">公告：{data.notice}</p>
              <div className="logo"><img src={data.logo}/></div>
            </div>

            <div className={contect} ref={(contect) => {this.contect = contect}}>
              <ul className="menu">
                <li onClick={this.go.bind(this,"/dishes")} className={choose?"active":""}>点菜</li>
                <li onClick={this.go.bind(this,"/evaluate")} className={choose?"":"active"}>评价</li>
              </ul>

              {/* 点菜 */}
              <div style={choose?{display:"block"}:{display:"none"}}>
                <div className="dishes">
                  <ul className="list">
                    {
                      this.state.detail.map((v,i)=>{
                        let food = v;
                        // console.log(v)
                        return (
                          <li key={i}>
                            <div className="listCon">
                              <img src={v.img} className="foodImg"/>
                              <div className="food">
                                <p className="foodTit">{v.title}</p>
                                <p className="foodCon">{v.con}</p>
                                <p className="foodPri">￥<span>{v.price}</span></p>
                              </div>
                              <PlusCircleTwoTone  twoToneColor="#FF9427" onClick={this.add.bind(this,food)} />
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>

              {/* 评价 */}
              <div style={choose?{display:"none"}:{display:"block"}}>
                <div className="eva">
                  <div className="all">全部 {evaluate.length}</div>
                  {
                    evaluate.map((v)=>{
                      return (
                        <div className="evaCon" key={v._id}>
                          <img src={v.img} className="tx"/>
                          <div className="evaTxt">
                            <p className="name">
                              <span>{v.user}</span>
                              <span className="date">{v.date}</span>
                            </p>
                            <div >评分&nbsp;&nbsp;<Rate disabled defaultValue={Number(v.score)} /></div>
                            <p className="text">{v.con}</p>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>

              </div>
            </div>
          </div>
        </section>

        <BackTop visibilityHeight="40"/>
      </div>
    )
  }
}
