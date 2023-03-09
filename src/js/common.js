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
        try {
            s = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s);
            return s.substring(0, s.length - 2);
        }
        catch (Ex) {
            return '';
        }
    },
    /**
     * Hàm định dạng số: từ số tiền => số nguyên, số thực
     * Author NNduc (2/3/2023)
     * @param {*} s số tiền cần đổi 
     * @returns sẽ trả về định dạng số 1000000
     */
    convertMoneyToNum: function (s) {
        try {
            return s.replaceAll('.', '');
        }
        catch (Ex) {
            return '';
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
            //lấy ra tháng
            let month = date.getMonth() + 1;
            //lấy ra năm
            let year = date.getFullYear();
            return `${dateValue}/${month}/${year}`;
        }
        catch (Ex) {
            return "";
        }
    },
}
export default MISACommon