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
document.querySelector('form').addEventListener('submit',(e)=>{
    // e.preventDefault()
    const cName=document.querySelector('#collection_name').value,
          cPass=document.querySelector('#collection_pass').value,
          cAdminPass=document.querySelector('#collection_pass__admin').value
    postData({cName,cPass,cAdminPass}).then((res)=>{
        // socket.emit('loadDataPage',{
        //     cName=res.cName
        // })
    }).catch(e=>console.log(e))
})
socket.on('connect',()=>{
    console.log("im connected")
})
socket.on('disconnect',()=>{
    console.log('disconected')
})
