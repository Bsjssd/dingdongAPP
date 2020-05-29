let express = require("express");
let app = express();
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let uE = bodyParser.urlencoded({extended:false});


let collectionShops = mongoose.model("shops",{
  title:String,
  logo:String,
  num:Number,
  start:Number,
  mian:Number,
  free:String,
  time:String
})
let collectionUsers = mongoose.model("users",{
  username:String,
  password:String,
  phone:String,
  money:Number,
  img:String,
  address:String
})
let collectionDetails = mongoose.model("details",{})
let collectionColls = mongoose.model("collections",{
  user:String,
  shopId:Number,
  title:String,
  img:String,
  star:Number,
  con:String
})
let collectionCars = mongoose.model("cars",{
  img:String,
  title:String,
  con:String,
  price:String,
  num:Number,
  id:String,
  shop:Number,
  n:Number,
  user:String
})
let collectionFinishs = mongoose.model("finishs",{
  img:String,
  title:String,
  con:String,
  price:String,
  id:String,
  shop:Number,
  n:Number
})
let collectionEvas = mongoose.model("evaluates",{
  img:String,
  user:String,
  con:String,
  score:String,
  shopId:Number,
  date:String
})
let collectionAddress = mongoose.model("addresses",{
  name:String,
  sex:String,
  phone:String,
  path:String,
  user:String
})


//获取好评店铺信息
app.get("/shop",function(req,res){
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      res.send({status:-1,war:"数据库连接失败"});
    }else{
      collectionShops.find({star:5}).then((ok)=>{
        res.send({status:0,data:ok});
      })
    }
  })
})

//获取所有店铺信息
app.get("/shops",function(req,res){
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      res.send({status:-1,war:"数据库连接失败"});
    }else{
      collectionShops.find().then((ok)=>{
        res.send({status:0,data:ok});
      })
    }
  })
})

//查找对应类型店铺数据
app.get("/typeList",function(req,res){
  let type = req.query.type;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      res.send({status:-1,war:"数据库连接失败"});
    }else{
      console.log("对应类型店铺连接成功")
      collectionShops.find({type:type}).then((ok)=>{
        res.send({status:0,data:ok});
      })
    }
  })
})

//注册
app.post("/register",uE,function(req,res){
  let data = req.body.data.split(",");
  let phone = data[0];
  let uname = data[1];
  let pwd = data[2];
  console.log(phone,uname,pwd);
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("注册连接成功")
      collectionUsers.find({$or:[{username:uname},{phone:phone}]}).then((ok)=>{
        console.log(ok.length)
        if(ok.length === 0){
          let newuser = new collectionUsers({phone:phone,username:uname,password:pwd,money:0,img:"/assets/user/tx.jpg",address:"0-选择地址-"});
          newuser.save().then((ok)=>{
            console.log(ok,"注册成功");
            res.send({mes:"成功",status:200,data:{id:0,data:ok}});
          },(err)=>{
            console.log("注册失败");
          })
        }else{
          console.log("注册失败");
          res.send({mes:"失败",status:200,data:{id:-1}});
        }
      })
    }
  })
})

//登录
app.post("/login",uE,function(req,res){
  let data = req.body.data.split(",");
  let uname = data[0];
  let pwd = data[1];
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("登录连接成功");
      collectionUsers.find({$or:[{username:uname,password:pwd},{phone:uname,password:pwd}]}).then((ok)=>{
        if(ok.length>0){
          console.log(ok,"登录成功")
          res.send({mes:"成功",status:200,data:{id:0,data:ok}});
        }else{
          console.log("登录失败")
          res.send({mes:"成功",status:200,data:{id:1,data:ok}});
        }
      })
    }
  })
})

//获取个人信息
app.get("/my",function(req,res){
  let data = req.query.data;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("个人信息连接成功");
      collectionUsers.find({username:data}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:0,data:ok}});
      })
    }
  })
})

//添加个人地址
app.get("/address",function(req,res){
  let {user,address} = {...req.query};
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("添加地址连接成功");
      collectionUsers.update({username:user},{$set:{address:address}}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:0,data:ok}});
      })
    }
  })
})

//店铺详情
app.get("/detail",function(req,res){
  let id = req.query.id;     //传递过来的参数都是字符串，需要转化成数值型
  let data = {}
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败");
    }else{
      console.log("店铺详情连接成功");
      collectionShops.find({id:Number(id)}).then((ok)=>{
        data.shop = ok;
      })
      collectionDetails.find({id:Number(id)}).then((ok)=>{
        data.detail = ok
        // console.log(data)
        res.send({mes:"成功",status:200,data:{id:0,data:data}});
      })
    }
  })
})

//收藏
app.get("/collection",function(req,res){
  let data = JSON.parse(req.query.data)
  let shop = data.data;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("收藏连接成功")
      collectionColls.find({user:data.user,shopId:data.shopId}).then((ok)=>{
        if(ok.length === 0){
          let newdata = new collectionColls({user:data.user,shopId:data.shopId,title:shop.title,img:shop.logo,star:shop.star,con:shop.notice})
          newdata.save().then((ok)=>{
            res.send({mes:"成功",status:200,data:{id:0,text:"收藏成功"}});
          })
        }else{
          collectionColls.remove({user:data.user,shopId:data.shopId}).then((ok)=>{
            res.send({mes:"成功",status:200,data:{id:1,text:"取消收藏"}});
          })
        }
      })
    }
  })
})

//判断该用户是否收藏过相应店铺
app.get("/collChooes",function(req,res){
  let {user,shopId} = {...req.query}
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("判断收藏连接成功")
      collectionColls.find({user:user,shopId:shopId}).then((ok)=>{
        if(ok.length != 0){
          res.send({mes:"成功",status:200,data:{id:0}});
        }else{
          res.send({mes:"成功",status:200,data:{id:1}});
        }
      })
    }
  })
})

//获取收藏数据
app.get("/collPage",function(req,res){
  let {user} = {...req.query}
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("获取收藏数据连接成功")
      collectionColls.find({user:user}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:0,data:ok}});
      })
    }
  })
})

//收藏页面取消收藏
app.get("/removeColl",function(req,res){
  let {user,shopId} = {...req.query}
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("取消收藏连接成功")
      collectionColls.remove({user:user,shopId:shopId}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:0}});
      })
    }
  })
})

//设置页面
app.post("/setting",uE,function(req,res){
  let uname = req.body.data;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("设置页连接成功");
      collectionUsers.find({username:uname}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:0,data:ok}});
      })
    }
  })
})

//获取购物车订单数据
app.get("/shopcar",function(req,res){
  let user = req.query.user;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("购物车连接成功");
      collectionCars.find({user:user}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:0,data:ok}});
      })
    }
  })
})

//添加购物车
app.get("/add",function(req,res){
  let food = JSON.parse(req.query.food[0]);
  let user = req.query.user;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("添加购物车连接成功");
      collectionCars.find({id:food.id}).then((ok)=>{
        console.log(ok.length)
        if(ok.length===0){
          let newfood = new collectionCars({img:food.img,title:food.title,con:food.con,price:food.price,num:1,id:food.id,shop:food.shop,n:0,user:user});
          newfood.save().then((ok)=>{
            console.log("添加成功")
          })
          res.send({mes:"成功",status:200,data:{id:0}});
        }else{
          res.send({mes:"成功",status:200,data:{id:1}});
        }
      })
    }
  })
})

//更改商品数量
app.get("/changeNum",function(req,res){
  let num = Number(req.query.data[0]);
  let id = req.query.data[1];
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("更改数量连接成功");
      collectionCars.update({_id:id},{$set:{num:num}}).then((ok)=>{
        console.log("商品数量修改成功",ok)
        res.send({mes:"成功",status:200,data:{id:1}});
      })
    }
  })
})

//删除商品
app.get("/deletegoods",function(req,res){
  let id = req.query.id;
  console.log(id)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("删除商品连接成功");
      collectionCars.remove({_id:id}).then((ok)=>{
        console.log("商品删除成功")
        res.send({mes:"成功",status:200,data:{id:0}});
      })
    }
  })
})

//充值
app.get("/recharge",function(req,res){
  let money = Number(req.query.data);
  let name = req.query.uname;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("充值连接成功");
      collectionUsers.find({username:name}).then((ok)=>{
        console.log(ok[0].money)
        collectionUsers.update({username:name},{$set:{money:ok[0].money+money}}).then((ok)=>{
          console.log("充值成功")
          res.send({mes:"成功",status:200,data:{id:1}});
        })
      })
    }
  })
})

//支付成功
app.get("/pay",function(req,res){
  let totle = Number(req.query.totle);
  let name = req.query.username;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("支付连接成功");
      collectionUsers.find({username:name}).then((ok)=>{
        console.log(ok[0].money)
        collectionUsers.update({username:name},{$set:{money:ok[0].money-totle}}).then((ok)=>{
          console.log("充值成功")
          res.send({mes:"成功",status:200,data:{id:1}});
        })
      })
    }
  })
})

//支付成功后完成订单页
app.get("/finish",function(req,res){
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("完成订单连接成功");
      let data = {};
      collectionCars.find({n:0}).then((ok)=>{
        console.log(ok)
        for(let i=0;i<ok.length;i++){
          data = new collectionFinishs({title:ok[i].title,img:ok[i].img,con:ok[i].con,price:ok[i].price,id:ok[i].id,shop:ok[i].shop,n:0});
          data.save().then((ok)=>{
            console.log("已完成订单添加成功")
            collectionCars.remove({n:0}).then((ok)=>{
              console.log("完成订单，清空购物车")
            })
          })
        }
      })
    }
  })
})

//完成订单页获取
app.get("/finishs",function(req,res){
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("订单数据连接成功");
      collectionFinishs.find().then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:1,data:ok}});
      })
    }
  })
})

// 评论页获取对应商家
app.get("/evalpage",function(req,res){
  let id = Number(req.query.id);
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("评论页获取商家连接成功");
      collectionShops.find({id:id}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:1,data:ok}});
      })
    }
  })
})

// 添加评论
app.get("/addeval",function(req,res){
  let data = JSON.parse(req.query.data);
  console.log(data)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("添加评论连接成功");
      let newdata = new collectionEvas(data);
      newdata.save().then((ok)=>{
        console.log("评论添加成功")
        collectionFinishs.remove({shop:data.shopId}).then((ok)=>{
          console.log("评论添加成功，删除订单")
          res.send({mes:"成功",status:200,data:{id:1}});
        })
      })
    }
  })
})

//获取评论数据
app.get("/evaluate",function(req,res){
  let shopId = Number(req.query.id);
  console.log(shopId)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("评论数据获取连接成功");
      collectionEvas.find({shopId:shopId}).then((ok)=>{
        console.log("获取成功")
        res.send({mes:"成功",status:200,data:{id:1,data:ok}});
      })
    }
  })
})

//添加地址
app.get("/addaddress",function(req,res){
  let data = JSON.parse(req.query.data);
  console.log(data)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("添加地址连接成功");
      let newdata = new collectionAddress(data);
      newdata.save().then((ok)=>{
        console.log("添加地址成功",ok)
        res.send({mes:"成功",status:200,data:{id:1}});
      })
    }
  })
})

//查询用户添加的配送地址
app.get('/addresses',function(req,res){
  let user = req.query.user;
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("配送地址表连接成功");
      collectionAddress.find({user:user}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:1,data:ok}});
      })
    }
  })
})

//修改地址信息
app.get('/modifyaddress',function(req,res){
  let data = JSON.parse(req.query.data);
  console.log(data)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("修改配送地址表连接成功");
      collectionAddress.update({_id:data.id},{$set:{name:data.name,sex:data.sex,phone:data.phone,path:data.path}}).then((ok)=>{
        console.log("地址信息修改成功")
        res.send({mes:"成功",status:200,data:{id:1}});
      })
    }
  })
})

//提交订单页获取地址信息orderAddress
app.get('/orderaddress',function(req,res){
  let id = req.query.id;
  console.log(id)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("提交订单页获取地址信息连接成功");
      collectionAddress.find({_id:id}).then((ok)=>{
        res.send({mes:"成功",status:200,data:{id:1,data:ok}});
      })
    }
  })
})

//搜索 模糊查询
app.get('/search',function(req,res){
  let keyword = req.query.keyword;
  console.log(keyword)
  mongoose.connect("mongodb://localhost:27017/dingdong",{useNewUrlParser:true,useUnifiedTopology:true},function(err){
    if(err){
      console.log("连接失败")
    }else{
      console.log("搜索页面连接成功");
      var re=new RegExp("\\"+keyword)
      collectionShops.find({keyword:re}).sort({"count":-1}).then((ok)=>{
        console.log("返回查询结果")
        res.send({mes:"成功",status:200,data:{id:1,data:ok}});
      })
    }
  })
})


app.listen(8683);