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
            if (isNaN(s)) return "";
            s = Math.round(s);
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
            if (s != '') return parseInt(s.replaceAll('.', ''));
            return NaN;
        }
        catch (Ex) {
            return NaN;
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
            dateValue = dateValue < 10 ? ('0' + dateValue) : dateValue;
            //lấy ra tháng
            let month = date.getMonth() + 1;
            month = month < 10 ? ('0' + month) : month;
            //lấy ra năm
            let year = date.getFullYear();
            return `${year}-${month}-${dateValue}`;
        }
        catch (Ex) {
            return "";
        }
    },

    /**
     * @description: Đổi định dạng ngày tháng mặc định sang ngày tháng theo props
     * VD: 2023-02-12 -> 12/02/2023
     * @param: {date} ngày tháng muốn đổi
     * Author: NNduc (05/04/2023)
     */
    formatDateByType(date, type) {
        try {
            date = new Date(date);
            //lấy ra ngày
            let dateValue = date.getDate();
            dateValue = dateValue < 10 ? "0" + dateValue : dateValue;
            //lấy ra tháng
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            //lấy ra năm
            let year = date.getFullYear();
            if (type == "dd/mm/yyyy") return `${dateValue}/${month}/${year}`;
            else if (type == "mm/dd/yyyy")
                return `${month}/${dateValue}/${year}`;
            else return `${year}/${month}/${dateValue}`;
        } catch (Ex) {
            return "";
        }
    },

    /**
     * @description: Phân trang
     * @param: {any}
     * Author: NNduc (24/04/2023)
     */
    getPaggingResult(array, offset = 1, limit = 20) {
        return array.slice((offset - 1) * limit, offset * limit);
    },
    /**
     * @description: So sánh 2 mảng object
     * @param: {any}
     * Author: NNduc (25/04/2023)
     */
    arraysEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }

        const set1 = new Set(array1.map(JSON.stringify));
        const set2 = new Set(array2.map(JSON.stringify));

        return this.setsEqual(set1, set2);
    },

    setsEqual(set1, set2) {
        if (set1.size !== set2.size) {
            return false;
        }

        for (const item of set1) {
            if (!set2.has(item)) {
                return false;
            }
        }

        return true;
    }




}
export default MISACommon