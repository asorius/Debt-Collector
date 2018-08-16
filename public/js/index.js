const socket=io()

const postData= async (data)=>{
    const response=await fetch('/datas',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(data)})
    const returnData= await response.json()
    return returnData

}
document.querySelector('.container').addEventListener('click',(e)=>{
    e.preventDefault()
    if(e.target.className==='new'){
        const template=document.querySelector('#collection_template').innerHTML
        const html=Mustache.render(template)
        e.target.parentElement.innerHTML=template
    }
    if(e.target.className==='createBtn'){
        const cName=document.querySelector('#collection_name').value,
                cPass=document.querySelector('#collection_pass').value,
                cAdminPass=document.querySelector('#collection_pass__admin').value
        postData({cName,cPass,cAdminPass}).then(res=>{
            socket.emit('callToCreate',{name:res.collection_name})

        }).catch(e=>console.log(e))
    }
    if(e.target.className==='add'){

        e.target.setAttribute('disabled',true)
        e.target.nextElementSibling.disabled=false
        const inputTemplate=document.querySelector('#adding_template').innerHTML
        const generatedTemplate=Mustache.render(inputTemplate)
        console.log(typeof generatedTemplate)
        document.querySelector('.main_data').innerHTML+=generatedTemplate
    }
   
    
})
socket.on('callToShowDetailsOf',(collection)=>{
    const startingTemplate=document.querySelector('#data_template').innerHTML
    const html=Mustache.render(startingTemplate,{name:collection.name})
    document.querySelector('.container').innerHTML=html
    
})
// socket.on('createNew',(data)=>{
//     const name=data.cName
//     const template=document.querySelector('#dataTemplate').innerHTML
//     const html=Mustache.render(template,{name:name})
//     document.querySelector('.container').innerHTML=html

// })
// document.querySelector('form').addEventListener('submit',(e)=>{
//     // e.preventDefault()
//     const cName=document.querySelector('#collection_name').value,
//           cPass=document.querySelector('#collection_pass').value,
//           cAdminPass=document.querySelector('#collection_pass__admin').value
//     postData({cName,cPass,cAdminPass}).then((res)=>{
//         // socket.emit('loadDataPage',{
//         //     cName=res.cName
//         // })
//         console.log(res)
//     }).catch(e=>console.log(e))
// })
socket.on('connect',()=>{
    console.log("im connected")
})
socket.on('disconnect',()=>{
    console.log('disconected')
})
