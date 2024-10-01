
const url = `https://api.cloudinary.com/v1_1/drdyt4mms/auto/upload`
const uploadfile = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","woopab-file")  

    const response = await fetch(url,{
        method:'POST',
        body : formData
    })
    const responseData = await response.json()

    return responseData
}
export default uploadfile