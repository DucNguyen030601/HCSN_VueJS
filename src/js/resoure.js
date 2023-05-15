/**
 * Date: 28/02/2023
 * Author: Nguyễn Ngọc Đức
 */
import MISAEnum from "./enum";
const MISAResoure = {
    //lưu các đường dẫn của api của từng đối tượng 
    API: {
        FixedAsset: {
            Get: function (departmentCode = "", fixedAssetCategoryCode = "", filter = "", page = 0, pageSize = -1) {
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
            Increment: function (filter, page, pageSize) {
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
            AddMultiple: `https://localhost:44364/api/v1/FixedAssetIncrements/InsertMultiple`,
            UpdateMultipleId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssetIncrements/UpdateMultiple/${id}`
            },
            DeleteId: function (id) {
                return `https://localhost:44364/api/v1/FixedAssetIncrements/${id}`
            },
            Delete: "https://localhost:44364/api/v1/FixedAssetIncrements",
        },
        FixedAssetIncrementDetail: {
            Get: function (entityId = "", filter = "") {
                return `https://localhost:44364/api/v1/FixedAssetIncrementDetails/Filter?entityId=${entityId}&filter=${filter}`;
            }
        },
        Budget: {
            Get: "https://localhost:44364/api/v1/Budgets"
        }
    },
    //lưu các text, title, lable,...của form 
    Form: {
        FixedAsset: {
            Name: "Tài sản",
            Title: {
                Edit: "Sửa tài sản",
                Add: "Thêm tài sản",
                Clone: "Nhân bản tài sản"
            },
            Validate: {
                RegExpCode: /^([A-Z]{2}[0-9]{5})$/,
                RegExpCodeText: "</br>Định dạng 2 chữ cái đầu viết hoa và 5 chữ cuối viết số <b>(AA12345)</b>.",
                ValidatePurchaseProductionDate: `<b>Ngày bắt đầu sử dụng</b> không được nhỏ hơn <b>Ngày mua</b>.`,
                ValidateDeleteIncrement: function (fixedAssetCode, fixedAssetIncrementCode) {
                    return `Tài sản có mã <b>${fixedAssetCode}</b> đã phát sinh chứng từ ghi tăng có mã <b>${fixedAssetIncrementCode}</b>.`;
                },
                ValidateDeleteALotIncrement: function (s) {
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
            Name: "Chứng từ",
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
        Budget: {
            Lable: {
                BudgetName: "Nguồn hình thành",
                Cost: "Nguyên giá"
            }
        }
    },

    Table: {
        FixedAsset: {
            Columns: [
                { type: "checkbox", width: 39, isResizing: false },
                { name: "STT", width: 52, isResizing: false, tooltip: "Số thứ tự" },
                { name: "Mã tài sản", width: 101, isResizing: true },
                { name: "Tên tài sản", width: 225, isResizing: true },
                { name: "Loại tài sản", width: 235, isResizing: true },
                { name: "Bộ phận sử dụng", width: 256, isResizing: true },
                { name: "Trạng thái", width: 100, isResizing: true },
                { name: "Số lượng", width: 90, isResizing: false, align: "right" },
                { name: "Nguyên giá", width: 125, isResizing: false, align: "right" },
                {
                    name: "KH/HM luỹ kế",
                    width: 127,
                    isResizing: false,
                    tooltip: "Khấu hao/Hao mòn luỹ kế",
                    align: "right",
                },
                {
                    name: "Giá trị còn lại",
                    width: 125,
                    isResizing: false,
                    align: "right",
                },
                { name: "Chức năng", width: 104, isResizing: false },
            ],
            Cells: [
                { type: "checkbox" },
                { type: "sort" },
                { name: "fixed_asset_code" },
                { name: "fixed_asset_name" },
                { name: "fixed_asset_category_name" },
                { name: "department_name" },
                { name: "status" },
                { name: "quantity", align: "right", type: "money" },
                { name: "cost", align: "right", type: "money" },
                { name: "accumulated_depreciation", align: "right", type: "money" },
                { name: "residual_value", align: "right", type: "money" },

            ],
            Pages: {
                ArrPage: ["10", "20", "30", "50", "100"],
                PageSize: 20,
            },
            ButtonFeatureTable: [
                { state: MISAEnum.FormState.Edit, name: 'Sửa (CTRL + E)', icon: 'icon-edit' },
                { state: MISAEnum.FormState.Clone, name: 'Nhân bản (CTRL + 2)', icon: 'icon-copy' },
            ],
            ItemFeatureContextMenu: [
                { state: MISAEnum.FormState.Add, name: 'Thêm tài sản', icon: 'icon-add' },
                { state: MISAEnum.FormState.Edit, name: 'Sửa tài sản', icon: 'icon-edit' },
                { state: MISAEnum.FormState.Clone, name: 'Nhân bản tài sản', icon: 'icon-copy' },
                { state: MISAEnum.FormState.Delete, name: 'Xoá tài sản', icon: 'icon-bin' },
            ]
        },
        FixedAssetIncrement: {
            Columns: [
                { type: "checkbox", width: 39, isResizing: false },
                { name: "STT", width: 52, isResizing: false, tooltip: "Số thứ tự" },
                { name: "Số chứng từ", width: 152, isResizing: true },
                {
                    name: "Ngày chứng từ",
                    width: 200,
                    isResizing: true,
                    align: "center",
                },
                {
                    name: "Ngày ghi tăng",
                    width: 200,
                    isResizing: true,
                    align: "center",
                },
                {
                    name: "Tổng nguyên giá",
                    width: 200,
                    isResizing: true,
                    align: "right",
                },
                { name: "Nội dung", width: 635, isResizing: false },
                { name: "", width: 104, isResizing: false },
            ],
            Cells: [
                { type: "checkbox" },
                { type: "sort" },
                { name: "fixed_asset_increment_code",color:"#17a6ed" },
                {
                    name: "production_year",
                    align: "center",
                    type: "date",
                    format: "dd/mm/yyyy",
                },
                {
                    name: "increment_date",
                    align: "center",
                    type: "date",
                    format: "dd/mm/yyyy",
                },
                { name: "cost", align: "right", type: "money" },
                { name: "description" },
            ],
            Pages: {
                ArrPage: ["10", "20", "30", "50", "100"],
                PageSize: 20,
            },
            ButtonFeatureTable: [
                { state: MISAEnum.FormState.Edit, name: 'Sửa (CTRL + E)', icon: 'icon-edit' },
                { state: MISAEnum.FormState.Delete, name: 'Xoá (CTRL + D)', icon: 'icon-bin--red' },
            ],
            ItemFeatureContextMenu: [
                { state: MISAEnum.FormState.Add, name: 'Thêm chứng từ ghi tăng', icon: 'icon-add' },
                { state: MISAEnum.FormState.Edit, name: 'Sửa chứng từ ghi tăng', icon: 'icon-edit' },
                { state: MISAEnum.FormState.Delete, name: 'Xoá chứng từ ghi tăng', icon: 'icon-bin' },
            ],
            FixedAssetIncrementDetail: {
                Columns: [
                    { name: "STT", width: 52, isResizing: false, tooltip: "Số thứ tự" },
                    { name: "Mã tài sản", width: 95, isResizing: true },
                    { name: "Tên tài sản", width: 145, isResizing: true },
                    { name: "Bộ phận sử dụng", width: 165, isResizing: true },
                    { name: "Nguyên giá", width: 85, isResizing: false, align: "right" },
                    {
                        name: "KH/HM luỹ kế",
                        width: 85,
                        isResizing: false,
                        tooltip: "Khấu hao/Hao mòn luỹ kế",
                        align: "right",
                    },
                    {
                        name: "Giá trị còn lại",
                        width: 85,
                        isResizing: false,
                        align: "right",
                    },
                    { name: "", width: 75, isResizing: false },
                ],
                Cells: [
                    { type: "sort" },
                    { name: "fixed_asset_code" },
                    { name: "fixed_asset_name" },
                    { name: "department_name" },
                    { name: "cost", align: "right", type: "money" },
                    { name: "accumulated_depreciation", align: "right", type: "money" },
                    { name: "residual_value", align: "right", type: "money" },
                ],
                ButtonFeatureTable: [
                    { state: MISAEnum.FormState.Edit, name: 'Sửa (CTRL + E)', icon: 'icon-edit' },
                    { state: MISAEnum.FormState.Delete, name: 'Xoá (CTRL + D)', icon: 'icon-bin--red' },
                ],
            },
            FixedAsset: {
                Columns: [
                    { type: "checkbox", width: 39, isResizing: false },
                    { name: "STT", width: 52, isResizing: false, tooltip: "Số thứ tự" },
                    { name: "Mã tài sản", width: 100, isResizing: true },
                    { name: "Tên tài sản", width: 145, isResizing: true },
                    { name: "Bộ phận sử dụng", width: 187, isResizing: true },
                    { name: "Nguyên giá", width: 85, isResizing: false, align: "right" },
                    {
                        name: "HM/KH luỹ kế",
                        width: 85,
                        isResizing: false,
                        tooltip: "Hao mòn/Khấu hao luỹ kế",
                        align: "right",
                    },
                    {
                        name: "Giá trị còn lại",
                        width: 85,
                        isResizing: false,
                        align: "right",
                    },
                ],
                Cells: [
                    { type: "checkbox" },
                    { type: "sort" },
                    { name: "fixed_asset_code" },
                    { name: "fixed_asset_name" },
                    { name: "department_name" },
                    { name: "cost", align: "right", type: "money" },
                    { name: "accumulated_depreciation", align: "right", type: "money" },
                    { name: "residual_value", align: "right", type: "money" },
                ],
                Pages: {
                    ArrPage: ["10", "20", "30", "50", "100"],
                    PageSize: 20,
                },
            }
        },
        FixedAssetIncrementDetail: {
            Columns: [
                { name: "STT", width: 52, isResizing: false, tooltip: "Số thứ tự" },
                { name: "Mã tài sản", width: 200, isResizing: true },
                { name: "Tên tài sản", width: 200, isResizing: true },
                { name: "Bộ phận sử dụng", width: 241, isResizing: true },
                { name: "Nguyên giá", width: 205, isResizing: false, align: "right" },
                {
                    name: "HM/KH luỹ kế",
                    width: 205,
                    isResizing: false,
                    tooltip: "Hao mòn/Khấu hao luỹ kế",
                    align: "right",
                },
                {
                    name: "Giá trị còn lại",
                    width: 205,
                    isResizing: false,
                    align: "right",
                },
            ],
            Cells: [
                { type: "sort" },
                { name: "fixed_asset_code" },
                { name: "fixed_asset_name" },
                { name: "department_name" },
                { name: "cost", align: "right", type: "money" },
                { name: "accumulated_depreciation", align: "right", type: "money" },
                { name: "residual_value", align: "right", type: "money" },
            ],
            Pages: {
                ArrPage: ["10", "20", "30", "50", "100"],
                PageSize: 20,
            },
            ButtonFeatureTable: [
                { state: MISAEnum.FormState.Edit, name: 'Sửa (CTRL + E)', icon: 'icon-edit' },
                { state: MISAEnum.FormState.Delete, name: 'Xoá (CTRL + D)', icon: 'icon-bin--red' },
            ],
        },

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
            ErrorNetwork: "Vui lòng kết nối mạng!",
            Warning: "Có lỗi xảy ra vui lòng liên hệ <b>MISA</b> để được hỗ trợ!",
            CancelWarning: function (name) {
                return `Bạn có muốn huỷ bỏ khai báo ${name.toLowerCase()} này?`
            },
            EditWarning: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các này đổi này?",
            DeleteDetail: function (name, s) {
                return `Bạn có muốn xoá ${name.toLowerCase()} <b>&#60;&#60;${s}&#62;&#62;</b>?`;
            },
            Delete: function (name, s) {
                return `Bạn có muốn xoá ${name.toLowerCase()} có mã <b>${s}</b>?`;
            },
            DeleteALot: function (name, s) {
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
            DeleteWarningChoose: function (name) { return `Vui lòng  bạn chọn 1 ${name.toLowerCase()} để xoá.` },
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
    //lưu các tiêu đề 
    Toast: {
        Success: "Lưu dữ liệu thành công!",
        Error: "Lưu dữ liệu không thành công!"
    },
    vi: {
        ErrMsg: "Có lỗi xảy ra vui lòng liên hệ"
    },
    en: {
        ErrMsg: "Error, please call "
    }

}
export default MISAResoure