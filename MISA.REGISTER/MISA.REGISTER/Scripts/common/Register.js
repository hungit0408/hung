function ValidateForm(oForm) {
    let usr = document.forms["formlogin"]["name"].value;
    let pass = document.forms["formlogin"]["state"].value;
    var clas = document.getElementById('selection').value;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//    var FileSize = file.files[0].size / 1024 / 1024; // in MB
//    if (FileSize > 1) {
//        alert('File size exceeds 2 MB');
//        // $(file).val(''); //for clearing with Jquery
//    } else {

//    }
//}
    var _validFileExtensions = [".doc", ".pdf"];   

    var arrInputs = oForm.getElementsByTagName("input");
    for (var i = 0; i < arrInputs.length; i++) {
        var oInput = arrInputs[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }

                if (!blnValid) {
                    //alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
                    document.getElementById("error-file").innerText = "Sorry, " + sFileName + " định dạng không đúng , chỉ cho phép file có định dạng: " + _validFileExtensions.join(", ");

                    return false;
                }
            }
        }
    }
    if (clas == "se") {
        document.getElementById("error-class").innerText = "Bạn phải chọn trường đang học";

    }
 
    if (usr == "") {
        document.getElementById("error-username").innerText = "Bạn phải nhập tên đăng nhập";
    }
    else {
        document.getElementById("error-username").innerText = "";
    }
    if (pass == "") {
        document.getElementById("error-state").innerText = "Bạn phải nhập chuyên ngành ";
    }
    else {
        document.getElementById("error-state").innerText = "";
    }
    
    return false;
}
//function validateEmail(email) {
//    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//    return re.test(email);
//}

//function validate() {
//    var $result = $("#result");
//    var email = $("#email").val();
//    $result.text("");

//    if (validateEmail(email)) {
//        $result.text(email + " is valid :)");
//        $result.css("color", "green");
//    } else {
//        $result.text(email + " is not valid :(");
//        $result.css("color", "red");
//    }
//    return false;
//}
