var express = require('express');
const timetables = require('./models/timetable')
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
const loguser=require('./models/login')
const reguser=require('./models/regituser')
const header=require('./models/header')
var app = express();
const mongoose = require('mongoose');//Routes
const User = require('./models/user')
const addcond=require('./addcond')
const condidates=require('./models/condidates')
const AdminBroExpressjs = require('admin-bro-expressjs')
const votescount=require("./models/votescount")
const votesdetail=require("./models/votes")
//const url = `mongodb://localhost:27017/mydb`;
const url = `mongodb+srv://shifa:shifamemon@cluster0.xlq4f7s.mongodb.net/mydb?retryWrites=true&w=majority`;
const fs=require("fs");

const data= fs.readFileSync('./api/nsdlapi.json','utf-8')
const objdata=JSON.parse(data)


//Database
const connectionParams={
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
  .then( () => {
      console.log('Connected to database ')
  })
  .catch( (err) => {
      console.error(`Error connecting to the database. \n${err}`);
  })


app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(express.static("public"));



const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

const canEditEmp = ({ currentAdmin, record }) => {
    return currentAdmin && (
      currentAdmin.role === 'admin'
      
    )
  }
AdminBro.registerAdapter(AdminBroMongoose)
const AdminBroOptions = {
    resources: 
    [
        {
            resource: loguser,reguser,
            options: {
              properties: {
                ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
              },
              actions: {
                edit: { isAccessible: canEditEmp },
                delete: { isAccessible: canEditEmp },
                new: { isAccessible: canEditEmp },
              }
           }},
    {
      resource: User,  
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
          password: {
            type: 'string',
            isVisible: {
              list: false, edit: true, filter: false, show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if(request.payload.record.password) {
                request.payload.record = {
                  ...request.payload.record,
                  encryptedPassword: await bcrypt.hash(request.payload.record.password, 10),
                  password: undefined,
                }
              }
              return request
            },
          },
          edit: { isAccessible: canModifyUsers },
          delete: { isAccessible: canModifyUsers },
          new: { isAccessible: canModifyUsers },
        }
      }
    },reguser,condidates,loguser,votescount,votesdetail,header,timetables],
  }
  const adminBro = new AdminBro(AdminBroOptions)
  const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email })
        if (user) {
          if (password === user.encryptedPassword) {
            return user
          }
        }
      return false
    },
    cookiePassword: 'session Key',
  })
app.use(adminBro.options.rootPath, router)


var image=objdata[0].image
console.log("image is ",image)



const loadwinner=async(req,res)=>{
  try {
  const ar=[]
  var i=0
  for( i=0;i<objdata.length;i++)
  {
      ar.push(objdata[i].share)
     ar.sort(function(a, b) {
        return a - b;
      });
      ar.reverse()
      
  }
console.log("ar",ar)
  for(var j=0;j<3;j++)
  {
     // console.log(ar[j])
      //let[a,b]=ar
      const vb=getTrivia(ar[j], objdata)
  
      
      
    


       
       var names=vb.name
       var share=vb.share
       var email=vb.email
       var member_id=vb.member_id
       var age=vb.age
       var origin=vb.origin
       var education=vb.education
       var gender=vb.gender
       var image=vb.image
      
      const cond=new  condidates({
          name:names,
          
          share:share,
          email:email,
          member_id:member_id,
          age:age,
          origin:origin,
          education:education,
          gender:gender,
          image:image

      })
      const alldata=await reguser.find({})
      console.log(alldata[j].firstname)

      

      const userdata=await condidates.findOne({email:email})
      const regdata= await condidates.estimatedDocumentCount();
      console.log(regdata)
     
    if(!userdata & regdata<3)
        {const data=await cond.save();
        console.log("saves",data.name)}
     else{
      console.log("already exist")
     }
   
      
  }


      






  } catch (error) {
      
  }
}
function getTrivia(share, items){
  var filtered = items.filter(function(item){
      return item.share == share;
  });
  return filtered[0];
}


loadwinner()



const reguserrout=require('./routers/reguserroute');
const { BSONError } = require('bson');
app.use('/',reguserrout)
const loginrouter=require('./routers/loginrouter')
app.use('/',loginrouter)
const routing=require('./routers/controler');
const timetable = require('./models/timetable');
app.use(routing);
app.listen(5000, function () {
    console.log('Listening to Port 5000');
});





//app.use(addcond.loadwinner);
//addd condidates


// View engine setup


// var ar=[]
//     var i=0
//     for( i=0;i<objdata.length;i++)
//     {
//         ar.push(objdata[i].share)
//         ar.sort()
//         ar.reverse()
        
//     }
//     const cond=new  condidates({
//       name:"kk",

//   })
//   const userdata=condidates.find({})
//   da=cond.save();

//   console.log("da is",userdata)
    // for(var j=0;j<2;j++)
    // {
    //    // console.log(ar[j])
    //     //let[a,b]=ar
    //     const vb=getTrivia(ar[j], objdata)
    //     console.log("vb",vb.name)
    //     console.log("vb",vb.share)

    //      a=vb.name
    //     const cond=new  condidates({
    //         name:a,

    //     })
    //     const name=cond.name
  
    //     if(!name)
    //     {
    //       cond.save();
    //       console.log("saves")
    //     }
    //   console.log(cond.name)
        
    // }

    // function getTrivia(share, items){
    //     var filtered = items.filter(function(item){
    //         return item.share == share;
    //     });
    //     return filtered[0];
    // }

