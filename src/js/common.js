/**
 * Thư mục chứa các hàm dùng cho cả project
 */
const MISACommon = {
    /**
     * Hàm định dạng tiền: từ số nguyên, số thực => số tiền
     * Author NNduc (2/3/2023)
     * @param {*} s số nguyên, số thực cần đổi 
     * @returns sẽ trả về định dạng 1.000.000
     */
    formatMoney: function (s) {
        s = Math.round(s);
        try {
            s = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s);
            return s.substring(0, s.length - 2);
        }
        catch (Ex) {
            return '';
        }
    },
    /**
     * Hàm định dạng số: từ số tiền => số nguyên
     * Author NNduc (2/3/2023)
     * @param {*} s số tiền cần đổi 
     * @returns sẽ trả về định dạng số 1000000
     */
    convertMoneyToNum: function (s) {
        try {
            if(s!='') return parseInt(s.replaceAll('.', ''));
            return 0;
        }
        catch (Ex) {
            return 0;
        }
        
    },
    /**
     * Hàm định dạng ngày tháng năm
     * Author NNduc (3/3/2023)
     * @param {*} date tham số đầu vào sẽ là datetime, longtime
     * @returns sẽ trả về định dạng dd/mm/yyyy
     */
    formatDate: function (date) {
        try {
            date = new Date(date);
            //lấy ra ngày
            let dateValue = date.getDate();
            dateValue = dateValue<10 ?('0'+dateValue):dateValue;
            //lấy ra tháng
            let month = date.getMonth() + 1;
            month = month<10 ?('0'+month):month;
            //lấy ra năm
            let year = date.getFullYear();
            return `${year}-${month}-${dateValue}`;
        }
        catch (Ex) {
            return "";
        }
    },
}
export default MISACommon