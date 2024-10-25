// rule validate (những yêu cầu để công nhận là validate)
// email: isRequired, isEmail
// name: isRequired, isName(có thể tiếng việt, tiếng anh, max 50)
// gender: isRequired
// country: isRequired
// password: isRequired, min 8 , max 30
// confirmedPassword: isRequired, min 8 , max 30, isSame(password)
// agree: isRequired
const REG_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;

//Viết các hàm: nhận vào giá trị, kiểm tra và trả ra chuỗi chửi
//                 Nếu kiểm tra mà đúng thì trả ra chuỗi rỗng

// const isRequired = (value) => {
//     // if(value !="") return "";
//     // else return "That field is required";
//     return value ? "" : "That field is required";
// }; viết kiểu này gà
const isRequired = (value) => (value ? "" : "That field is required");
const isEmail = (value) => REG_EMAIL.test(value) ? "" : "Email is valid";
const isName = (value) => REG_NAME.test(value) ? "" : "Name is valid";
const min = (value) => (numBound) =>{
    return value.length >= numBound ? "" : `Min is ${numBound} `;
};
const max = (value) => (numBound) =>{
    return value.length <= numBound ? "" : `Max is ${numBound} `;
};
// Nhận vào gtri cần kiểm tra và gtri đc ktra
const isSame = (paramsValue, fieldName1, fieldName2) => (value) => {
    return value == paramsValue ? "" : `${fieldName1} is not same ${fieldName2}`;
};

//học cách mô tả trường dữ liệu như 1 frontend đẳng cấp thế giới Lê Điệp
/*
    Đối với một inputNode thì ta phải nhìn nó dưới dạng 1 object có các thành phần sau
    {
        value: giá trị cần kiểm tra của input,
        funcS: mảng các hàm mà mình sẽ kiểm tra value: hàm trong đó có dạng
                (value) => chửi
        parentNode: node cha của thằng input để đặt câu chửi - tìm đếm thằng cha để đặt div chửi
        controlNodes(có khả năng có nhiều input): mảng các input để tô đỏ (thêm class is-invalid) 
    }
*/
// let nameNode = document.querySelector("#name"); //nút inputName
// let paramsObject = {
//     value : nameNode.value,
//     funcs : [isRequired, isName],
//     parentNode: nameNode.parentElement,
//     controlNodes: [nameNode],
// }

//Viết hàm tạo thông báo chửi
const createMsg = (parentNode, controlNodes, msg) => {
    //tạo div chứa msg cần chửi
    let invalidDiv = document.createElement("div");
    invalidDiv.innerHTML = msg;
    invalidDiv.className = "invalid-feedback";
    parentNode.appendChild(invalidDiv);
    //tô đỏ các nút input
    controlNodes.forEach((inputNode) => {
        inputNode.classList.add("is-invalid");
    });   
};
// let nameNode = document.querySelector("#name");
// createMsg(nameNode.parentElement,[nameNode], "Đmmm thằng ngu!!");

//hàm isValid: là hàm nhận vào object có dạng
//{value, funcs, parentNode, controlNodes}
// duyệt funcs, đi qua từng func với value
// nếu bị chửi gọi createMsg và return msg
// nếu duyệt function S mà không bị chửi không bị dừng thì
// return ""; mày mà return true; thì đúng là súc vật vì String và Boolean !!!!
// thay vì truyền vô từng params thì hãy truyền vào 1 object
const isValid = ({value, funcs, parentNode, controlNodes}) =>{
    //duyện danh sách các hàm cần kiểm tra
    //sử dụng destructuring
    for(const funcCheck of funcs){      
        let msg = funcCheck(value);
        if(msg){
            createMsg(parentNode, controlNodes, msg);
            return msg;
        };
    };
    return "";
};

//test
// let nameNode = document.querySelector("#name");
// isValid({
//     value : nameNode.value,
//     funcs : [isRequired, isName],
//     parentNode: nameNode.parentElement,
//     controlNodes: [nameNode]
// });
//hàm xóa thông báo lỗi
const clearMsg = () =>{
    // tìm những input có is invalkid và remove classs đó đi
    document.querySelectorAll(".is-invalid").forEach((inputNode) => {
        inputNode.classList.remove("is-invalid");
    });
    // tìm những div chửi và xóa luôn
    document.querySelectorAll(".invalid-feedback").forEach((divMsg) => {
        divMsg.remove(); //xóa node
    });
};

//main Flow
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();//chặn reset trang 
    clearMsg();
    //dom tới các input cần kiểm tra
    const emailNode = document.querySelector("#email");
    const nameNode = document.querySelector("#name");
    const genderNode = document.querySelector("#gender");
    const passwordNode = document.querySelector("#password");
    const confirmedPasswordNode = document.querySelector("#confirmedPassword");
    //
    const countryNode = document.querySelector("input[name='country']:checked");
    const agreeNode = document.querySelector("input#agree:checked");

    //kiểm tra 
    let errMsgs = [
    //email
    isValid({
        value : emailNode.value,
        funcs : [isRequired, isEmail],
        parentNode: emailNode.parentElement,
        controlNodes: [emailNode],
    }),

    //name
    isValid({
        value : nameNode.value,
        funcs : [isRequired, isName],
        parentNode: nameNode.parentElement,
        controlNodes: [nameNode],
    }),

    //gender
    isValid({
        value : genderNode.value,
        funcs : [isRequired],
        parentNode: genderNode.parentElement,
        controlNodes: [genderNode],
    }),

    //password
    isValid({
        value : passwordNode.value,
        funcs : [isRequired, min(8), max(30)],
        parentNode: passwordNode.parentElement,
        controlNodes: [passwordNode],
    }),
    
    //confirmedPassword
    isValid({
        value : confirmedPasswordNode.value,
        funcs : [isRequired, min(8),max(30), isSame(passwordNode.value,"confirmed Password", "Password")],
        parentNode: confirmedPasswordNode.parentElement,
        controlNodes: [confirmedPasswordNode],
    }),

    //country
    isValid({
        value : countryNode ? countryNode.value : "", 
        // countryNode này bắt cái nút bị nhấn nhưng trường hợp người dùng không nhấn thì đưa cho chuỗi rỗng
        funcs : [isRequired],
        parentNode: document.querySelector(".form-check-country"),
        controlNodes: document.querySelectorAll("input[name='country']"), //Select là không có khoảng cách thừa
    }),
    //agree
    isValid({
        value : agreeNode ? agreeNode.value : "", 
        funcs : [isRequired],
        parentNode: document.querySelector("#agree").parentElement,
        controlNodes: [document.querySelector("#agree")], 
    }),
    ];
    console.log(errMsgs);
    let isValidForm = errMsgs.every((item) => item == "");
    if(isValidForm){
        alert("Đăng ký thành công");
    }
    
});
