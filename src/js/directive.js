const clickOutSide={
    mounted:(el,binding)=>{
        el.clickOutSideEvent = event =>{
            //Nếu click phần tử nó hoặc các con của nó thì không thêm sự kiện
            if(!(el==event.target || el.contains(event.target))){
                //nếu click ra ngoài, gọi hàm được cung cấp trong giá trị thuộc tính bindin
                binding.value();
            }
        };
        document.addEventListener('click',el.clickOutSideEvent,true);
    },
    unmounted:el =>{
        document.removeEventListener('click',el.clickOutSideEvent,true);
    }
};
const esc = {
    mounted:(el,binding)=>{
        el.keyDownEsc = event =>{
           if(event.keyCode === 27){
            event.preventDefault();
            binding.value();
           }
        };
        document.addEventListener('keydown',el.keyDownEsc);
    },
    unmounted:el =>{
        document.removeEventListener('keydown',el.keyDownEsc);
    }
};
const ctrlS = {
    mounted:(el,binding)=>{
        el.keyDownCtrlS = event =>{
            if (event.ctrlKey && event.keyCode === 83){
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener('keydown',el.keyDownCtrlS);
    },
    unmounted:el =>{
        document.removeEventListener('keydown',el.keyDownCtrlS);
    }
};
const shift = {
    mounted:(el,binding)=>{
        el.keyDownShift = event =>{
            if (event.shiftKey){
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener('keydown',el.keyDownShift);
    },
    unmounted:el =>{
        document.removeEventListener('keydown',el.keyDownShift);
    }
};


export {clickOutSide,esc,ctrlS,shift};