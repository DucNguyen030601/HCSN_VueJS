/**
 * Date: 28/02/2023
 * Author: Nguyễn Ngọc Đức
 */
const MISAResoure = {
    //lưu các đường dẫn của api của từng đối tượng 
    API:{
        Emp:{
            Get:"https://apidemo.laptrinhweb.edu.vn/api/v1/Employees/"  
        },  
        Dept:{
            Get:"https://apidemo.laptrinhweb.edu.vn/api/v1/Departments"
        },
        Pos:{
            Get:"https://apidemo.laptrinhweb.edu.vn/api/v1/Positions"
        }
        
    },
    //lưu các text, title, lable,...của form 
    Form:{  
        Emp:{
            TitleEdit:"Sửa tài sản",
            TitleAdd:"Thêm tài sản",
            TitleClone:"Nhân bản tài sản",
            ValidateText:"không được để trống"
        }
    },
    //lưu các title, title button của dialog
    Dialog:{
            Title:{ 
                Warning:"Bạn có muốn huỷ bỏ khai báo tài sản này?",
                EditWarning:"Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các này đổi này?",
                Delete: function(s){
                    return `Bạn có muốn xoá tài sản <span style ="font-weight:bold"><<</span><span style ="font-weight:bold">${s}</span><span style ="font-weight:bold">>></span>?`;
                },
                DeleteALot:function(s){
                    s = (s>0&&s<9)? `0${s}`:s;
                    return `<span style ="font-weight:bold">${s}</span> tài sản đã được chọn. Bạn có muốn xoá các tài sản khỏi danh sách?`;
                },
                Validate:function(s){
                    return `Cần phải nhập thông tin <span style ="font-weight:bold"><<</span><span style ="font-weight:bold">${s}</span><span style ="font-weight:bold">>></span>.`
                },
                DeleteWarning:"Không thể xoá tài sản này vì đã có chứng từ phát sinh.",
                DeleteWarningChoose:"Xin mời bạn chọn 1 tài sản để xoá.",
                DeleteALotWarning:function(s){
                    return `<span style ="font-weight:bold">${s}}</span> tài sản được chọn không thể xoá. Vui lòng kiểm tra lại tài sản trước khi thực hiện xoá.`;
                }
            },
            Button:{
                No:"Không",
                Cancel:"Huỷ bỏ",
                Save:"Lưu",
                DoNotSave:"Không lưu",
                Delete:"Xoá",
                Close:"Đóng",
                Yes:"Đồng ý"
            }

    },
    vi:{
        ErrMsg:"Có lỗi xảy ra vui lòng liên hệ"
    },
    en:{
        ErrMsg:"Error, please call "
    }

}
export default MISAResoure