


const islogin=async(req,res,next)=>{

    try {
        if(req.session.user_id){

        }
        else{
            return res.render('login')
        }
     
        next();

    } catch (error) {
        console.log(error)
        
    }

}

const islogout=async(req,res,next)=>{

    try {
        if(req.session.user_id){
            return res.render('home')
        }
        else{
            
        }
      next();
        
    } catch (error) {
        console.log(error)
        
    }

}
module.exports={
islogin,
islogout
}