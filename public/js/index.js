const socket=io()

const postDataToCreateNewCollection= async (data)=>{
    try{
        const response=await fetch('/datas',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(data)})
        const returnData= await response.json()
        return returnData
    }catch(e){
        console.log(e)
    }
}
const manualLogin= async (name,pass)=>{
    try{
        const response=await fetch('/datas/login',{
        method:'POST',
         headers:{
        'Content-type':'application/json'
        },
        body:JSON.stringify({name,pass})
        })
        const returnData= await response.json()
        return returnData
    }catch(e){
        console.log(e)
    }   
}

const logout=async(token)=>{
    try{
    const response=await fetch('/datas/logout',{
        method:'PATCH',
        headers:{
            'Content-type':'application/json',
            'x-auth':token
        }
    })
    const returnData= await response.json()
    return returnData
}catch(e){
    console.log(e)
    }
}

const getCollectionByToken=async (token)=>{
    try{
        const response=await fetch('/datas',{
        method:'GET',
        headers:{'x-auth':token}
        })
    const returnData= await response.json()
    return returnData
}catch(e){
    console.log(e)
    }
}
const addNewData=async(amount,details,token)=>{
    try{
        let data={amount,details}
    const response=await fetch('/datas/add',{
        method:'PATCH',
        headers:{
            'Content-type':'application/json',
            'x-auth':token
        },
        body:JSON.stringify(data)
    })
    const returnData= await response.json()
    return returnData
}catch(e){
    console.log(e)
    }
}

const deleteItem=async (date,token)=>{
    try{
        const response=await fetch(`/datas/${date}`,{
        method:'DELETE',
        headers:{'x-auth':token}
        })
    const returnData= await response.json()
    return returnData
    }catch(e){
        console.log(e)
    }
}

const deleteCollection=async (token)=>{
    try{
        const response=await fetch('/delete',{
        method:'DELETE',
        headers:{'x-auth':token}
        })
    const returnData= await response.json()
    return returnData
    }catch(e){
        console.log(e)
    }
}
const editData=async (token,findDate,amount,details)=>{
    try{
        let data={amount,details,findDate}
    const response=await fetch('/datas/edit',{
        method:'PATCH',
        headers:{
            'Content-type':'application/json',
            'x-auth':token
        },
        body:JSON.stringify(data)
    })
    const returnData= await response.json()
    return returnData
}catch(e){
    console.log(e)
    }
}

document.querySelector('.container').addEventListener('click',(e)=>{
    e.preventDefault()

    if(e.target.className==='new'){
    //to pop new creation form
        const template=document.querySelector('#new_collection_template').innerHTML
        const html=Mustache.render(template)
        e.target.parentElement.innerHTML=template
    }

    if(e.target.className==='login'){
        //check if there is token
        let token=window.localStorage.getItem('tokenKey');
        //if there already is token, then auto load data
        if(token){
            //load data
            getCollectionByToken(token).then(collection=>{
            //response is name data sum aces
            let dataArray=collection.data
            let cname=collection.name
            let sum=collection.sum
            let access=collection.access
            let startingTemplate
            let inputTemplate
            if(access==='admin'){
                if(dataArray.length===0){sum=''}
                startingTemplate=document.querySelector('#data_page_overall_template_admin').innerHTML
                inputTemplate=document.querySelector('#single_add_template_admin').innerHTML
            }
            if(access==='user'){
                if(dataArray.length===0){sum=''}
                startingTemplate=document.querySelector('#data_page_overall_template').innerHTML
                inputTemplate=document.querySelector('#single_add_template').innerHTML
            }
            
            const html=Mustache.render(startingTemplate,{name:cname,sum:sum})
            document.querySelector('.container').innerHTML=html

            dataArray.forEach(element => {
                let edt
                if(element.editDate){
                    edt=`Edited at ${element.editDate}`
                }else{edt=''}
            let generatedTemplate=Mustache.render(inputTemplate,{amount:element.amount,details:element.details,time:element.date,edited:edt})       
            document.querySelector('.main_data').innerHTML+=generatedTemplate  
            });

            }).catch(e=>{
                alert('inlavid lodign token request')
                window.localStorage.clear()
                window.location.reload()
            })
            
        }else{
        //generate login form
        const template=document.querySelector('#login_template').innerHTML
        const html=Mustache.render(template)
        e.target.parentElement.innerHTML=template}
        
    }
    if(e.target.className==='connectBtn'){
     //get values from form and login
        
        const cName=document.querySelector('#collection_name').value.toLowerCase(),
                cPass=document.querySelector('#collection_pass').value.toLowerCase()
        manualLogin(cName,cPass).then((dataObj=>{
            let dataArray=dataObj.data
            let cname=dataObj.name
            let sum=dataObj.sum
            let access=dataObj.access
            window.localStorage.setItem('tokenKey', dataObj.token);
            if(access==='admin'){
                //admin
                if(dataArray.length===0){sum=''}
                const startingTemplate=document.querySelector('#data_page_overall_template_admin').innerHTML
                const html=Mustache.render(startingTemplate,{name:cname,sum:sum})
                document.querySelector('.container').innerHTML=html

                const inputTemplate=document.querySelector('#single_add_template_admin').innerHTML
                
                dataArray.forEach(element => {
                    let edt
                    if(element.editDate){
                        edt=`Edited at ${element.editDate}`
                    }else{edt=''}
                let generatedTemplate=Mustache.render(inputTemplate,{amount:element.amount,details:element.details,time:element.date,edited:edt})       
                document.querySelector('.main_data').innerHTML+=generatedTemplate  
                });
            }else if(access==='user'){
              //user
              if(dataArray.length===0){sum=''}
                const startingTemplate=document.querySelector('#data_page_overall_template').innerHTML
                const html=Mustache.render(startingTemplate,{name:cname,sum:sum})
                document.querySelector('.container').innerHTML=html

                const inputTemplate=document.querySelector('#single_add_template').innerHTML
                
                dataArray.forEach(element => {
                    let edt
                    if(element.editDate){
                        edt=`Edited at ${element.editDate}`
                    }else{edt=''}
                let generatedTemplate=Mustache.render(inputTemplate,{amount:element.amount,details:element.details,time:element.date,edited:edt})       
                document.querySelector('.main_data').innerHTML+=generatedTemplate  
                });  
            }
            

            })
        ).catch((e)=>{
            alert('invalid acount name or pasword')
            window.localStorage.clear()
            document.querySelector('#collection_name').value=''
            document.querySelector('#collection_pass').value=''
        })
    }

    if(e.target.className==='createBtn'){
    // send new collection request to database and save new token to localstorage
        const cName=document.querySelector('#collection_name').value.toLowerCase(),
                cPass=document.querySelector('#collection_pass').value.toLowerCase(),
                cAdminPass=document.querySelector('#collection_pass__admin').value.toLowerCase()
        postDataToCreateNewCollection({cName,cPass,cAdminPass}).then(res=>{
            socket.emit('callToCreate',{name:res.collection_name})
            let token=res.token
            localStorage.clear()
            window.localStorage.setItem('tokenKey', token);

        })
    }

    //add new inpoout
    if(e.target.className==='add'){
        let amountInput=e.target.parentElement.firstElementChild.value
        let detailsInput=e.target.parentElement.children[1].value
        if(amountInput==='' || detailsInput===''){return alert('fill both fields')}
        let token=window.localStorage.getItem('tokenKey');
        addNewData(parseFloat(amountInput),detailsInput,token).then(collection=>{
        let lastDataItemInArray
        if(collection.data.length===0){
            lastDataItemInArray=collection.data[0]
        }else{
            lastDataItemInArray=collection.data[collection.data.length-1]
        }
        amountInput=e.target.parentElement.firstElementChild.value=''
        detailsInput=e.target.parentElement.children[1].value=''

        let inputTemplate=document.querySelector('#single_add_template_admin').innerHTML
       
        const generatedTemplate=Mustache.render(inputTemplate,{amount:lastDataItemInArray.amount,details:lastDataItemInArray.details,time:lastDataItemInArray.date})
        
        document.querySelector('.main_data').innerHTML+=generatedTemplate
        document.querySelector('.sumDiv').innerHTML=`<h3>In total: ${collection.sum} &#163;.</h3>`
        })  
    }
    //delete intem
    if(e.target.className==='delete'){
        let date=e.target.parentElement.children[2].textContent
        let token=window.localStorage.getItem('tokenKey');
        deleteItem(date,token).then(res=>{
            if(res.deleted){
                e.target.parentElement.remove()
                document.querySelector('.sumDiv').innerHTML=`<h3>In total: ${res.sum} &#163;.</h3>`
            }
        })
    }
    //delle whole
    if(e.target.className==='deleteAll'){
        let token=window.localStorage.getItem('tokenKey');
        deleteCollection(token).then((deletedCollection)=>{
            alert(`${deletedCollection.collection_name}'s acount sucesfuly deleted`)
            window.localStorage.clear()
            window.location.reload()
        })
        
    }
    //logout token
    if(e.target.className==='logout'){
        let token=window.localStorage.getItem('tokenKey');
        logout(token).then((res)=>{
            if(res.deleted){
                window.localStorage.clear()
                window.location.reload()
            }else{
                console.log(res)
            }
            
        })
        
    }
    
    //bac kbtn
    if(e.target.className==='back'){
        window.location.reload()
    }
    //to change button
    if(e.target.className==='edit'){
        let amountInput=e.target.parentElement.firstElementChild
        let detailsInput=e.target.parentElement.children[1]
        amountInput.disabled=false
        detailsInput.disabled=false


        e.target.innerHTML="<span class='edit_single'>Save</span>"
        e.target.className='saveEdit'
    }
    //edit
    else if(e.target.className==='saveEdit'){
        let findDate=e.target.parentElement.children[2].textContent
        let amountInput=e.target.parentElement.firstElementChild
        let detailsInput=e.target.parentElement.children[1]
        let token=window.localStorage.getItem('tokenKey');
        
        editData(token,findDate,parseFloat(amountInput.value),detailsInput.value).then((res)=>{
            if(!res.edited){return alert('eror')}
            e.target.parentElement.querySelector('.edited').innerText=`Edited at ${res.editDate}`
            document.querySelector('.sumDiv').innerHTML=`<h3>In total: ${res.nsum} &#163;.</h3>`


        })
        amountInput.disabled=true
        detailsInput.disabled=true
        e.target.className='edit'
        e.target.innerHTML='<span class="edit_single">Edit</span>'
    }

    
})
socket.on('callToShowDetailsOf',(collection)=>{
    const startingTemplate=document.querySelector('#data_page_overall_template_admin').innerHTML
    const html=Mustache.render(startingTemplate,{name:collection.name})
    document.querySelector('.container').innerHTML=html
    
})

socket.on('connect',()=>{
    console.log("im connected")
})
socket.on('disconnect',()=>{
    console.log('disconected')
})
