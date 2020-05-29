import React, { Component } from 'react'
import './index.css'
import {LeftOutlined,AimOutlined} from '@ant-design/icons';
import { message,Radio } from 'antd';
import { Spin, Alert } from 'antd';
import axios from 'axios'


export default class Add extends Component {
  constructor(props){
    super(props)
    this.state = {
      type:'modify',
      flag:false,        //判断定位列表是否显示
      dict:[],
      lat:window.lat,
      value:'男',
      spin:false
    }
  }
  componentDidMount(){
    let type = this.props.location.search.slice(6).split('&');
    console.log(type)
    this.setState({
      type:type[0]
    })

    //通过修改信息跳转过来需要的原信息
    if(type[1]){
      let data = type[1].split(',');
      console.log(data)
      this.nameInp.value = data[1];
      this.setState({value:data[2]});
      this.phoneInp.value = data[3];
      this.textInp.value = data[4];
    }
  }

  //确认添加事件
  submit(){
    let path = this.textInp.value;
    let name = this.nameInp.value;
    let phone = this.phoneInp.value;
    let sex = this.state.value;
    let user = sessionStorage.getItem("token");
    console.log(user,name,sex,phone,path)
    if(path && name && phone && sex){
      axios({
        url:"/api/addaddress",
        method:"get",
        params:{data:{name:name,sex:sex,phone:phone,path:path,user:user}}
      }).then((ok)=>{
        console.log(ok)
        message.success('添加成功',1);
        this.props.history.push("/address");
      })
    }else{
      message.warning('内容不能为空',1);
    }
  }
  go(path){
    this.props.history.push(path)
  }
  
  onChange = e => {
    console.log(e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  //获取定位
  location=()=>{
    //显示列表
    this.setState({
      flag:true
    })
    //请求定位      108.9823076111145,32.696616445029804
    var location = sessionStorage.getItem('location');
    axios({
      url:"https://restapi.amap.com/v3/geocode/regeo?output=json&location="+location+"&key=c29e9119013f6728f33f2afed9495200&radius=1000&extensions=all",
      method:'get'
    }).then((ok)=>{
      var pois = ok.data.regeocode.pois;
      console.log(ok.data.pois)
      var address = [];
      for(var i=0;i<pois.length;i++){
        address.push(pois[i].name)
      }
      this.setState({spin:true})
      setTimeout(()=>{
        this.setState({
          dict:address,
          spin:false
        })
      },2000)
    })
  }
  //将定位信息放入input框中
  obtain=(path)=>{
    this.setState({
      flag:false
    })
    this.textInp.value = path;
    // console.log(path)
  }

  //修改信息
  modity=()=>{
    let user = sessionStorage.getItem("token");
    let data = this.props.location.search.slice(6).split('&');
    if(data[1]){
      var id = data[1].split(',')[0]
    }
    var obj = {name:this.nameInp.value,sex:this.state.value,phone:this.phoneInp.value,path:this.textInp.value,user:user,id:id}
    console.log(obj)

    axios({
      url:'/api/modifyaddress',
      method:'get',
      params:{data:obj}
    }).then((ok)=>{
      console.log(ok.data.data.id)
      if(ok.data.data.id == 1){
        message.success('修改成功',1);
        this.props.history.push('/address')
      }else{
        message.warning('修改失败，请检查您的网络', 1);
      }
    })
    console.log(id)
  }

  render() {
    let {type,flag,dict,spin} = {...this.state}
    return (
      <div className="add">
        <header>
          <LeftOutlined onClick={()=>{this.props.history.go(-1)}}/>填写地址信息
        </header>

        
        <ul className="list">
          <li>
            <p>姓名：</p>
            <div><input className="Inp" placeholder="请填写姓名" ref={(nameInp) => {this.nameInp = nameInp}}/></div>
          </li>
          <li>
            <p>性别：</p>
            <div>
              <Radio.Group onChange={this.onChange} value={this.state.value}>
                <Radio value={"男"}>男</Radio>
                <Radio value={"女"}>女</Radio>
              </Radio.Group>
            </div>
          </li>
          <li>
            <p>电话：</p>
            <div><input className="Inp" placeholder="请填写电话" ref={(phoneInp) => {this.phoneInp = phoneInp}}/></div>
          </li>
          <li>
            <p>地址：</p>
            <div><input  className="Inp" placeholder="请填写地址/系统定位" ref={(textInp) => {this.textInp = textInp}}/></div>
            <AimOutlined onClick={this.location}/>
          </li>
        </ul>

        <p className="btn" onClick={this.submit.bind(this)} style={type == 'add'?{display:'block'}:{display:'none'}}>提交</p>
        <p className="btn" style={type == 'modify'?{display:'block'}:{display:'none'}} onClick={this.modity}>确认修改</p>


        {/* 弹出定位地址信息 */}
        <div className="location" style={flag?{display:'block'}:{display:'none'}}>
          <ul className="pathList">
            {
              dict && dict.map((v,i)=>{
                return (
                  <li onClick={this.obtain.bind(this,v)} key={i}>{v}</li>
                )
              })
            }
          </ul>

          <Spin tip="正在获取定位..." style={spin?{display:'block'}:{display:'none'}}></Spin>
        </div>
      </div>
    )
  }
}
