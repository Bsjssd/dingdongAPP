import Home from '../components/home'
import Order from '../components/order'
import My from '../components/my'
import NotFound from '../components/notfound'
import Login from '../components/login'
import Register from '../components/register'
import Collection from '../components/collection'
import Detail from '../components/detail'
import Setting from '../components/setting'

import Money from '../components/money'
import Pay from '../components/pay'
import Finish from '../components/finish'
import Evaluate from '../components/evaluate'
import Maps from '../components/maps'
import List from '../components/list'
import Address from '../components/address'
import Add from '../components/add'
import Placeorder from '../components/placeorder'
import Search from '../components/search'
import Near from '../components/near'



export const routes = [
  {
    path:'/home',
    component:Home
  },{
    path:"/order",
    component:Order
  },{
    path:"/my",
    component:My
  },{
    path:'/404',
    component:NotFound
  },{
    path:'/login',
    component:Login
  },{
    path:'/register',
    component:Register
  },{
    path:'/collection',
    component:Collection
  },{
    path:'/detail',
    component:Detail
  },{
    path:'/setting',
    component:Setting
  },{
    path:"/money",
    component:Money
  },{
    path:"/pay",
    component:Pay
  },{
    path:"/finish",
    component:Finish
  },{
    path:"/evaluate",
    component:Evaluate
  },{
    path:"/maps",
    component:Maps
  },{
    path:"/list",
    component:List
  },{
    path:"/address",
    component:Address
  },{
    path:"/add",
    component:Add
  },{
    path:"/placeorder",
    component:Placeorder
  },{
    path:"/search",
    component:Search
  },{
    path:"/near",
    component:Near
  }
]
