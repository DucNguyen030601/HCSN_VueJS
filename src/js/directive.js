import MISAEnum from "./enum";
const clickOutSide = {
    mounted: (el, binding) => {
        el.clickOutSideEvent = event => {
            //Nếu click phần tử nó hoặc các con của nó thì không thêm sự kiện
            if (!(el == event.target || el.contains(event.target))) {
                //nếu click ra ngoài, gọi hàm được cung cấp trong giá trị thuộc tính bindin
                binding.value();
            }
        };
        document.addEventListener('click', el.clickOutSideEvent, true);
    },
    unmounted: el => {
        document.removeEventListener('click', el.clickOutSideEvent, true);
    }
};
const esc = {
    mounted: (el, binding) => {
        el.keyDownEsc = event => {
            if (event.keyCode === 27) {
                event.preventDefault();
                binding.value();
            }
        };
        document.addEventListener('keydown', el.keyDownEsc);
    },
    unmounted: el => {
        document.removeEventListener('keydown', el.keyDownEsc);
    }
};
const ctrlS = {
    mounted: (el, binding) => {
        el.keyDownCtrlS = event => {
            if (event.ctrlKey && event.keyCode === MISAEnum.KeyCode.S) {
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener('keydown', el.keyDownCtrlS);
    },
    unmounted: el => {
        document.removeEventListener('keydown', el.keyDownCtrlS);
    }
};
const ctrl1 = {
    mounted: (el, binding) => {
        el.keyDownCtrl1 = event => {
            if (event.ctrlKey && event.keyCode === MISAEnum.KeyCode.Number1) {
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener('keydown', el.keyDownCtrl1);
    },
    unmounted: el => {
        document.removeEventListener('keydown', el.keyDownCtrl1);
    }
};
const ctrlShiftD = {
    mounted: (el, binding) => {
        el.keyDownCtrlShiftD = event => {
            if (event.ctrlKey) {
                if (event.shiftKey && event.keyCode === MISAEnum.KeyCode.D) {
                    event.preventDefault();
                    binding.value()
                }
            }
        };
        document.addEventListener('keydown', el.keyDownCtrlShiftD);
    },
    unmounted: el => {
        document.removeEventListener('keydown', el.keyDownCtrlShiftD);
    }
};
export { clickOutSide, esc, ctrlS, ctrl1, ctrlShiftD };