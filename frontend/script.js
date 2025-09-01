//  SIGNUP INPUT SAVED IN DB //
    let username = document.getElementById('username')
    let email = document.getElementById('email')
    let role = document.getElementById('role')
    let password = document.getElementById('password')
    
    let createButton = document.querySelector('.submit-btn')
    createButton.addEventListener("click", async()=>{
      const name = username.value
      const mail = email.value
      const roll = role.value
      const pass = password.value
      try{
          const response = await fetch('http://localhost:5000/user/signup',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username:name,email:mail,role:roll,password:pass})
        })
        if(!response.ok)
            throw new Error('something went wrong')
        const data =await  response.json()
        console.log(data)
      }catch(err){
        console.log('Details not saved',err)
      }
    });

    // USER LOGIN WITH LOGIN PAGE//
    
  
