class MISAAPI {
    constructor(){
    }
    /**
     * Hàm lấy dữ liệu từ api
     * Author NNduc (3/3/2023)
     * @param {*} api đường dẫn
     * @returns sẽ trả về dữ liệu tuỳ theo đường dẫn: mảng hoặc object
     */
         async Get (api) {
        try{
        let data =  await fetch(api);
            return await data.json(); 
        }
        catch(Ex){
            console.log(Ex);
        }
    }
}
export default MISAAPI