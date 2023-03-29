/**
 * Date: 28/02/2023
 * Author: Nguyễn Ngọc Đức
 */
const MISAResoure = {
    //lưu các đường dẫn của api của từng đối tượng 
    API: {
        FixedAsset: {
            Get: function (departmentCode, fixedAssetCategoryCode, filter, page, pageSize) {
                return `https://localhost:44364/api/v1/FixedAssets/Filter?page=${page}&pageSize=${pageSize}&departmentName=${departmentCode}&fixedAssetCategoryName=${fixedAssetCategoryCode}&filter=${filter}`;
            },
            GetId:function (id) {
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
        },
        Dept: {
            Get: "https://localhost:44364/api/v1/Departments"
        },
        Cat: {
            Get: "https://localhost:44364/api/v1/FixedAssetCategories"
        }

    },
    //lưu các text, title, lable,...của form 
    Form: {
        FixedAsset: {
            Title: {
                Edit: "Sửa tài sản",
                Add: "Thêm tài sản",
                Clone: "Nhân bản tài sản"
            },
            Validate: {
                ValidateText: "không được để trống",
                RegExpCodeText: "</br>Định dạng 2 chữ cái đầu viết hoa và 5 chữ cuối viết số (AA12345)."
            },
            Lable:{
                FixedAssetCode:"Mã tài sản",
                FixedAssetName:"Tên tài sản",
                DepartmentCode:"Mã bộ phận sử dụng",
                DepartmentName:"Tên bộ phận sử dụng",
                Quantity:"Số lượng",
                Cost:"Nguyên giá",
                LifeTime:"Số năm sử dụng",
                DepreciationRate:"Tỷ lệ hao mòn (%)",
                DepreciationCost:"Giá trị hao mòn năm",
                TrackedYear:"Năm theo dõi",
                PurchaseDate:"Ngày mua",
                ProductionYear:"Ngày bắt đầu sử dụng"
            }
        }
    },
    //lưu các title, title button của dialog
    Dialog: {
        Title: {
            NetworkWarning: "Có lỗi xảy ra vui lòng liên hệ để được hỗ trợ!",
            Warning: "Bạn có muốn huỷ bỏ khai báo tài sản này?",
            EditWarning: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các này đổi này?",
            Delete: function (s) {
                return `Bạn có muốn xoá tài sản <span style ="font-weight:bold"><<</span><span style ="font-weight:bold">${s}</span><span style ="font-weight:bold">>></span>?`;
            },
            DeleteALot: function (s) {
                s = (s > 0 && s < 9) ? `0${s}` : s;
                return `<span style ="font-weight:bold">${s}</span> tài sản đã được chọn. Bạn có muốn xoá các tài sản khỏi danh sách?`;
            },
            Validate: function (s) {
                return `Cần phải nhập thông tin <span style ="font-weight:bold"><<</span><span style ="font-weight:bold">${s}</span><span style ="font-weight:bold">>></span>.`
            },
            DeleteWarning: "Không thể xoá tài sản này vì đã có chứng từ phát sinh.",
            DeleteWarningChoose: "Xin mời bạn chọn 1 tài sản để xoá.",
            DeleteALotWarning: function (s) {
                return `<span style ="font-weight:bold">${s}}</span> tài sản được chọn không thể xoá. Vui lòng kiểm tra lại tài sản trước khi thực hiện xoá.`;
            }
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