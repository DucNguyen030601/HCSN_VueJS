/**
 * Date: 28/02/2023
 * Author: Nguyễn Ngọc Đức
 */
const MISAResoure = {
    //lưu các đường dẫn của api của từng đối tượng 
    API: {
        FixedAsset: {
            Get: function (departmentCode="", fixedAssetCategoryCode="", filter="", page=0, pageSize=-1) {
                return `https://localhost:44364/api/v1/FixedAssets/Filter?page=${page}&pageSize=${pageSize}&departmentName=${departmentCode}&fixedAssetCategoryName=${fixedAssetCategoryCode}&filter=${filter}`;
            },
            GetId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssets/${id}`
            },
            NewFixedAssetCode: "https://localhost:44364/api/v1/FixedAssets/NewFixedAssetCode",
            Add: "https://localhost:44364/api/v1/FixedAssets",
            UpdateId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssets/${id}`
            },
            DeleteId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssets/${id}`
            },
            Delete: "https://localhost:44364/api/v1/FixedAssets",
            ExportExcel: function (departmentCode, fixedAssetCategoryCode, filter) {
                return `https://localhost:44364/api/v1/FixedAssets/ExportExcel?departmentName=${departmentCode}&fixedAssetCategoryName=${fixedAssetCategoryCode}&filter=${filter}`;
            },
            Increment:function(filter, page, pageSize){
                return `https://localhost:44364/api/v1/FixedAssets/IncrementFilter?page=${page}&pageSize=${pageSize}&filter=${filter}`;
            }
        },
        Dept: {
            Get: "https://localhost:44364/api/v1/Departments"
        },
        Cat: {
            Get: "https://localhost:44364/api/v1/FixedAssetCategories"
        },
        FixedAssetIncrement: {
            Get: function (filter, page, pageSize) {
                return `https://localhost:44364/api/v1/FixedAssetIncrements/Filter?page=${page}&pageSize=${pageSize}&filter=${filter}`;
            },
            NewFixedAssetIncrementCode: "https://localhost:44364/api/v1/FixedAssetIncrements/NewFixedAssetIncrementCode",
            GetId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssetIncrements/${id}`
            },
            AddMultiple:`https://localhost:44364/api/v1/FixedAssetIncrements/InsertMultiple`,
            UpdateMultipleId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssetIncrements/UpdateMultiple/${id}`
            },
            DeleteId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssetIncrements/${id}`
            },
            Delete: "https://localhost:44364/api/v1/FixedAssetIncrements",
        },
        FixedAssetIncrementDetail: {
            Get: function (entityId="",filter="") {
                return `https://localhost:44364/api/v1/FixedAssetIncrementDetails/Filter?entityId=${entityId}&filter=${filter}`;
            }
        },
        Budget:{
            Get: "https://localhost:44364/api/v1/Budgets"
        }
    },
    //lưu các text, title, lable,...của form 
    Form: {
        FixedAsset: {
            Name:"Tài sản",
            Title: {
                Edit: "Sửa tài sản",
                Add: "Thêm tài sản",
                Clone: "Nhân bản tài sản"
            },
            Validate: {
                RegExpCode: /^([A-Z]{2}[0-9]{5})$/,
                RegExpCodeText: "</br>Định dạng 2 chữ cái đầu viết hoa và 5 chữ cuối viết số <b>(AA12345)</b>.",
                ValidatePurchaseProductionDate: `<b>Ngày bắt đầu sử dụng</b> không được nhỏ hơn <b>Ngày mua</b>.`,
                ValidateDeleteIncrement:function(fixedAssetCode, fixedAssetIncrementCode){
                    return  `Tài sản có mã <b>${fixedAssetCode}</b> đã phát sinh chứng từ ghi tăng có mã <b>${fixedAssetIncrementCode}</b>.`;
                },
                ValidateDeleteALotIncrement:function (s) {
                    s = (s > 0 && s < 9) ? `0${s}` : s;
                    return `<b>${s}</b> tài sản được chọn không thể xoá. Vui lòng kiểm tra lại tài sản trước khi thực hiện xoá.`;
                }
            },
            Lable: {
                FixedAssetCode: "Mã tài sản",
                FixedAssetName: "Tên tài sản",
                DepartmentCode: "Mã bộ phận sử dụng",
                DepartmentName: "Tên bộ phận sử dụng",
                FixedAssetCategoryCode: "Mã loại tài sản",
                FixedAssetCategoryName: "Tên loại tài sản",
                Quantity: "Số lượng",
                Cost: "Nguyên giá",
                LifeTime: "Số năm sử dụng",
                DepreciationRate: "Tỷ lệ hao mòn (%)",
                DepreciationCost: "Giá trị hao mòn năm",
                TrackedYear: "Năm theo dõi",
                PurchaseDate: "Ngày mua",
                ProductionYear: "Ngày bắt đầu sử dụng"
            }
        },
        FixedAssetIncrement: {
            Name:"Chứng từ",
            Title: {
                Edit: "Sửa chứng từ ghi tăng",
                Add: "Thêm chứng từ ghi tăng",
                Clone: "Nhân bản chứng từ ghi tăng"
            },
            Validate: {
                RegExpCode: /^([A-Z]{2}[0-9]{5})$/,
                RegExpCodeText: "</br>Định dạng 2 chữ cái đầu viết hoa và 5 chữ cuối viết số <b>(AA12345)</b>.",
                ValidatePurchaseProductionDate: `<b>Ngày bắt đầu sử dụng</b> không được nhỏ hơn <b>Ngày mua</b>.`,
                EmptyFixedAsset: `Chọn ít nhất 1 tài sản.`
            },
            Lable: {
                FixedAssetIncrementCode: "Mã chứng từ",
                IncrementDate: "Ngày ghi tăng",
                ProductionYear: "Ngày bắt đầu sử dụng"
            }
        },
        Budget:{
            Lable:{
                BudgetName:"Nguồn hình thành",
                Cost:"Nguyên giá"
            }
        }
    },
    //Lưu các text chung của validate
    Validate: {
        Required: function (name) {
            return `${name} không được để trống.`;
        },
        MaxLength: function (name, maxLength) {
            return `${name} không được vượt quá ${maxLength} ký tự.`
        },
        Range: function (name, min, max) {
            return `${name} nằm trong khoảng từ ${min} đến ${max}.`
        },
    }
    ,
    //lưu các title, title button của dialog
    Dialog: {
        Title: {
            DulicateCode: function (name, s) {
                return `${name} <b>${s}</b> đã có trong danh sách. Vui lòng sử dụng ${name.toLowerCase()} khác!`;
            },
            Warning: "Có lỗi xảy ra vui lòng liên hệ <b>MISA</b> để được hỗ trợ!",
            CancelWarning:function(name){
               return `Bạn có muốn huỷ bỏ khai báo ${name.toLowerCase()} này?`
            } ,
            EditWarning: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các này đổi này?",
            DeleteDetail: function (name,s) {
                return `Bạn có muốn xoá ${name.toLowerCase()} <b>&#60;&#60;${s}&#62;&#62;</b>?`;
            },
            Delete:function(name,s){
                return `Bạn có muốn xoá ${name.toLowerCase()} có mã <b>${s}</b>?`;
            },
            DeleteALot: function (name,s) {
                s = (s > 0 && s < 9) ? `0${s}` : s;
                return `<b>${s}</b> ${name.toLowerCase()} đã được chọn. Bạn có muốn xoá các ${name.toLowerCase()} này khỏi danh sách?`;
            },
            ValidateRequired: function (s) {
                return `Cần phải nhập thông tin <b>&#60;&#60;${s}&#62;&#62;</b>.`
            },
            ValidateMaxLength: function (name, maxLength) {
                return `<b>${name}</b> không được quá ${maxLength} ký tự.`;
            },
            ValidateGreaterThanZero: function (name) {
                return `<b>${name}</b> phải lớn hơn 0.`;
            },
            ValidateRange: function (name, min, max) {
                return `<b>${name}</b> nằm trong khoảng từ ${min} đến ${max}.`;
            },
            DeleteWarningChoose:function(name) { return `Vui lòng  bạn chọn 1 ${name.toLowerCase()} để xoá.`},
        },
        Button: {
            No: "Không",
            Cancel: "Huỷ bỏ",
            Save: "Lưu",
            DoNotSave: "Không lưu",
            Delete: "Xoá",
            Close: "Đóng",
            Yes: "Đồng ý"
        }

    },
    vi: {
        ErrMsg: "Có lỗi xảy ra vui lòng liên hệ"
    },
    en: {
        ErrMsg: "Error, please call "
    }

}
export default MISAResoure