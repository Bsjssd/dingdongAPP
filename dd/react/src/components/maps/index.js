import React, { Component } from 'react'
import {allCitys} from "./map"
import { Cascader } from 'antd';
import axios from 'axios'

const options = [
  {
    value: '北京',
    label: '北京',
    children: [
      { value: '北京市',label: '北京市',
        children: [
          {value: '东城区',label: '东城区',},
          {value: '西城区',label: '西城区',},
        ]
      },
    ],
  },
  {
    value: '天津',
    label: '天津',
    children: [
      {
        value: '石家庄',
        label: '石家庄',
        children: [
          {value: '长安区',label: '长安区'},
          {value: '桥东区',label: '桥东区'},
          {value: '桥西区',label: '桥西区'},
        ],
      },
    ],
  },
  {
    value: '陕西省',
    label: '陕西省',
    children: [
      {
        value: '西安市',
        label: '西安市',
        children: [
          {value: '莲湖区',label: '莲湖区'},
          {value: '新城区',label: '新城区'},
          {value: '碑林区',label: '碑林区'},
          {value: '雁塔区',label: '雁塔区'},
          {value: '未央区',label: '未央区'},
          {value: '灞桥区',label: '灞桥区'},
          {value: '阎良区',label: '阎良区'},
          {value: '临潼区',label: '临潼区'},
          {value: '长安区',label: '长安区'},
          {value: '高陵县',label: '高陵县'},
          {value: '蓝田县',label: '蓝田县'},
          {value: '户县',label: '户县'},
          {value: '周至县',label: '周至县'},
          {value: '其他',label: '其他'}
        ],
      },
      {
        value: '铜川市',
        label: '铜川市',
        children: [
          {value: '耀州区',label: '耀州区'},
          {value: '王益区',label: '王益区'},
          {value: '印台区',label: '印台区'},
        ],
      },
      {
        value: '宝鸡市',
        label: '宝鸡市',
        children: [
          {value: '渭滨区',label: '渭滨区'},
          {value: '金台区',label: '金台区'},
          {value: '陈仓区',label: '陈仓区'},
        ],
      },
      {
        value: '咸阳市',
        label: '咸阳市',
        children: [
          {value: '秦都区',label: '秦都区'},
          {value: '渭城区',label: '渭城区'},
          {value: '兴平市',label: '兴平市'},
          {value: '礼泉县',label: '礼泉县'},
          {value: '泾阳县',label: '泾阳县'},
        ],
      },
    ],
  },
];
function onChange(value) {
  console.log(value);
}

export default class Maps extends Component {
  constructor(props){
    super(props);
    this.state = {
      dict:[],
      lat:window.lat,
      lng:window.lng
    }
  }
  componentDidMount(){
    console.log(window.lat)
    console.log(allCitys)
    axios({
      url:"https://restapi.amap.com/v3/geocode/regeo?output=json&location=108.88013743649293,34.217109314069596&key=c29e9119013f6728f33f2afed9495200&radius=1000&extensions=all",
      method:'get'
    }).then((ok)=>{
      var pois = ok.data.regeocode.pois;
      var address = [];
      for(var i=0;i<pois.length;i++){
        address.push(pois[i].address)
      }
      console.log(address)
      this.setState({
        dict:address,
        lat:window.lat,
      })
      console.log(this.state.lag)
    })
    axios({
      url:"https://restapi.amap.com/v4/direction/bicycling?origin=108.95309828,34.2777999&destination=110.95309856,34.2777999&key=c29e9119013f6728f33f2afed9495200",
      method:'get'
    }).then((ok)=>{
      console.log(ok.data.data.paths[0])
      var paths = ok.data.data.paths[0];
      var path = "距离"+paths.distance+"米，时间约"+paths.duration/60+"分钟";
      console.log(path)
    })
  }

  
  render() {
    let {dict} = {...this.state}
    return (
      <div>
        <Cascader
          defaultValue={['zhejiang', 'hangzhou', 'xihu']}
          options={options}
          onChange={onChange}
        />

        {
          dict.map((v,i)=>{
            return (
              <p key={i}>{v}</p>
            )
          })
        }
      </div>
    )
  }
}
