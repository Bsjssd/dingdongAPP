import React, { Component } from 'react'
import Footer from '../../pages/footer'
import './index.css'
import { Carousel,BackTop,Rate,Modal,Cascader, message } from 'antd';
import axios from 'axios'
import {options} from './position'
import { Statistic } from 'antd';

const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK


let position = []
function onChange(value) {
  console.log(value);
  position = value;
}

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      shop:[],
      item:[
        {title:"专场派送",img:"/assets/item0.png"},
        {title:"经典西餐",img:"/assets/item1.png"},
        {title:"甜点饮品",img:"/assets/item2.png"},
        {title:"新鲜水果",img:"/assets/item3.png"},
        {title:"精品日料",img:"/assets/item4.png"},
        {title:"火锅冒菜",img:"/assets/item5.png"},
        {title:"快餐",img:"/assets/item6.png"},
        // {title:"鲜香烤鱼",img:"/assets/item7.png"}
      ],
      banner:[
        "/assets/banner1.png",
        "/assets/banner2.jpg",
        "/assets/banner3.jpg",
        "/assets/banner4.jpg"
      ],
      tx:"",
      flag:false,
      visible: false,
      address:"选择地址"
    }
  }
  componentDidMount(){
    console.log(window.log)
    axios({
      url:'/api/shop',
      method:"get",
      params:{text:"xixi"}
    }).then((res)=>{
      this.setState({
        shop:res.data.data
      })
    })
    let name = sessionStorage.getItem("token");
    if(name){
      axios({
        url:"/api/my",
        method:"get",
        params:{data:name}
      }).then((ok)=>{
        let user = ok.data.data.data[0];
        this.setState({
          tx:user.img,
          address:user.address.split("-")[1]+user.address.split("-")[2]
        })
      })
    }else{
      this.setState({
        tx:"/assets/user/yhtx.png"
      })
    }
  }
  //跳转类型
  go(type){
    this.props.history.push("/list?type="+type)
  }
  //选择地址
  showModal = () => {
    let name = sessionStorage.getItem("token");
    if(name){
      this.setState({
        visible: true,
      });
    }else{
      message.warning('请先登录',1);
      this.props.history.push("/login")
    }
  };
  handleOk = e => {
    let name = sessionStorage.getItem("token");
      this.setState({
        visible: false,
        address:position[1]+position[2]
      });
      axios({
        url:"/api/address",
        method:"get",
        params:{user:name,address:position[0]+"-"+position[1]+"-"+position[2]}
      }).then((ok)=>{
        console.log(ok)
      })
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  render() {
    let {item,banner,shop,tx,address} = {...this.state}
    return (
      <div className="home">
        <header>
          <img className="user" src={tx}/>
          <span className="local" onClick={this.showModal}>{address} ></span>
          <input type="text" className="ss" placeholder="输入商品,店铺名称"  onClick={()=>{this.props.history.push("/search")}}/>
        </header>

        <Modal
          title="请选择您的地址"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Cascader
            defaultValue={['zhejiang', 'hangzhou', 'xihu']}
            options={options}
            onChange={onChange}
          />
        </Modal>

        <section>
          <div className="banner">
            <Carousel autoplay className="bannerList">
              {
                banner.map((v,i)=>{
                  return (
                    <div key={i}>
                      <img src={v} className="bannerImg"/>
                    </div>
                  )
                })
              }
            </Carousel>
          </div>

          <div className="item">
            {
              item.map((v,i)=>{
                return (
                  <a className="itemBox" key={i} onClick={this.go.bind(this,v.title)}>
                    <img src={v.img}/>
                    <span>{v.title}</span>
                  </a>
                )
              })
            }
            <a className="itemBox" onClick={()=>{this.props.history.push("/near")}}>
              <img src={require("#/img/item8.png")}/>
              <span>附近美食</span>
            </a>
          </div>

          <div className="part coupon">
            <div className="partTit">优惠专区</div>
            <div className="partBox cuoponBox">
              <a href="#"><img src={require("#/img/yhj1.png")}/></a>
              <a href="#"><img src={require("#/img/yhj.png")}/></a>
            </div>
          </div>

          <div className="part recom">
            <div className="partTit">今日推荐</div>
            <div className="partBox recomBox">
              <div className="recomL">
                <p>9.9元抢午餐</p>
                <p className="time">结束时间&nbsp;
                  <span>
                    <Countdown value={deadline} />
                  </span>
                </p>
              </div>
              <div className="recomR">
                <div className="r1">
                  <p>肯德基全家桶</p>
                  <span>超值特惠</span>
                </div>
                <div className="r2">
                  <div className="r2_con r2L">
                    <p>下单立减8元</p>
                    <span>先抢先得</span>
                  </div>
                  <div className="r2_con r2R">
                    <p>下单立减8元</p>
                    <span>先抢先得</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="part shop">
            <div className="partTit">好评店铺</div>
            <div className="partBox shopBox">
            {
              shop.map((v)=>{
                let path = "/detail?id="+v.id
                return (
                    <div className="shop_box" key={v.id} onClick={()=>{this.props.history.push(path)}}>
                      <div className="shopImg"><img src={v.logo}/></div>
                      <div className="shopCon">
                        <p className="shopTit">{v.title}</p>
                        <div className="shopCom">
                          <div className="shopXx"><Rate disabled defaultValue={v.star} /></div>
                          <span>月售{v.num}份</span>
                        </div>
                        <p className="shopPrice"><span>起送￥{v.start}</span><span>配送费￥{v.free}</span><span>约{v.time}分钟送达</span></p>
                        <p className="shopFree"><span>免</span>订单满{v.mian}元免配送费</p>
                      </div>
                    </div>
                )
              })
            }
            </div>
          </div>
        </section>

        {/* 返回顶部 */}
        <BackTop visibilityHeight="150"/>

        <Footer />
      </div>
    )
  }
}
