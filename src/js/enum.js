/**
 * Date: 28/02/2023
 * Author: Nguyễn Ngọc Đức
 * Hàm lưu các trạng thái của project
 */
const MISAEnum = {
    SisebarSate:{
        SizeClose :66,
        SizeOpen : 200
    },
    FixedAsset:{
        MaxLenghtFixedAssetName : 200,

        RangeMinCost : 0,
        
        RangeMaxCost : 100000000,
        
        RangeMinQuantity : 0,
        
        RangeMaxQuantity : 100,
        
        RangeMinDepreciationRate : 0.0000,
        
        RangeMaxDeperciationRate : 1,
        
        RangeMinTrackedYear : 2000,
        
        RangeMaxTrackedYear : 2050,
        
        RangeMinLifeTime : 0,
        
        RangeMaxLifeTime : 50,
    },
    FormState:{
        Add:1,
        Edit:2,
        Clone:3,
        Delete:4
    },
    ErrorCode:{
        /// Ngooại lệ
        Exception: 1,
        /// Xác thực dữ liệu
        InvalidData : 2,

        /// </summary>
        DulicateCode:3,

        /// Lỗi không thêm được
        InsertFailed : 4,

        /// Lỗi không sửa được
        UpdateFailed : 5,

        /// Lỗi không xoá được
        DeleteFailed : 6,

        /// Lỗi xoá phát sinh
        DeleteArised : 7
    },
    KeySate:{
        ArrowDown:40,
        ArrowUp:38,
        Enter:13,
        Esc:27,
        Ctrl:17,
        S:83,
        Shift:16
    }
}
export default MISAEnum