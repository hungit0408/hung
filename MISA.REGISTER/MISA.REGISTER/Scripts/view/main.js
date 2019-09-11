$(document).ready(function () {
    mainJS = new Main();
})

class Main {
    constructor() {
        this.eventButtons();
        this.init();
        this.initForm();
        this.initInput();
        this.setHotKey();
    }
    /**
     * hàm khởi tạo ban đầu
     * CreatedBy TDLam(28/08/2019)
     */
    init() {
        // this.showAutoCompleteInput();
        this.filterData();
    }
    /**
     * hàm khởi tạo cho các input datepick,autocomplete
     * CreatedBy TDLam(28/08/2019)
     */
    initInput() {
        $('input[fieldselect="Date"]').datepicker(
            {
                dateFormat: "dd/mm/yy",
                showOtherMonths: true,
                showOn: "button",
                buttonImage: '/Content/icons/date-picker-icon.png',
                yearRange: "1900:2099",
                showButtonPanel: true
            }
        ).mask('99/99/9999');
        $('input[name="RefTypeName"]').autocomplete({
            minLength: 0,
            source: ["Tất cả","Phiếu thu Tiền mặt", "Phiếu thu đặt cọc - Tiền mặt", "Phiếu trả nợ - tiền mặt", "Phiếu chi tiền mặt", "Phiếu chi tiền cọc", "Phiếu chi đặt cọc - Tiền mặt"],
            select: function (event,ui) {
                $('input[name="RefTypeName"]').val(ui.item.value);
                $(this).change();
            },

        }).focus(function () {
            $(this).data("uiAutocomplete").search("");
        });
        $('input').not('input[name="RefTypeName"]').not('input[field="BudgetName"]').attr('autocomplete', 'off');
    }
    /**
     * hàm khởi tạo form dialog
     * CreatedBy TDLam(28/08/2019)
     */
    initForm() {
        //dialog chính 
        $('#dialog-main').dialog({
            width: 900,
            height: 600,
            autoOpen: false

        });
        // dialog hỏi đóng dialog
        $('.dialog-close').dialog({
            autoOpen: false,
            width: 396,
            height: 152,
            modal: true
        });
        // dialog xóa 
        $('.dialog-delete').dialog({
            autoOpen: false,
            width: 396,
            height: 152,
            modal: true
        });
        // dialog thông báo lỗi 
        $('.dialog-error').dialog({
            autoOpen: false,
            width: 396,
            height: 152,
            modal: true
        });
    }
    /**
     * hàm bắt các sự kiện cho các button,input trong toàn bộ chương trình
     * CreatedBy TDLam(29/08/2019)
     * ModifiedBy TDLam(01/09/2019)
     */
    eventButtons() {
        $(document).on('click', '.item-header .title-col-header', { scope: this }, this.bindOrderBy);
        //event cho toolbar
        $(document).on('click', '.content-toolbar .arrow-down', this.showComboboxRefType);
        $(document).on('click', '.item-edit', { scope: this, RefTypeID: 4, action: "edit" }, this.showDialog);
        $(document).on('click', '.add-payment', { scope: this, RefTypeID: 4, action: "add" }, this.showDialog);
        $(document).on('click', '.add-receipt', { scope: this, RefTypeID: 1, action: "add" }, this.showDialog);
        $(document).on('click', '.item-view', { scope: this, action: "view" }, this.showDialog);
        $(document).on('click', '.item-duplicate', { scope: this, action: "duplicate" }, this.showDialog);
        $(document).on('click', '.item-delete', { scope: this }, this.showDialogDelete);
        $(document).on('click', '.item-refresh', function () {
            $('.icon-page-reload').trigger('click');
        })
        $(document).on('click', '.item-stop', { scope: this }, this.stopEditDialog);
        $(document).on('click', '.item-close', { scope: this }, this.closeDialog);
        $(document).on('click', '.btn-close-save', { scope: this }, this.closeDialog);

        //event cho iconcompare
        $(document).on('click', '.icon-compare', this.showCompareCondition);
        $(document).on('click', '.anotation-compare a', { scope: this }, this.bindCompareCondition);
        $(document).on('change', '.filter-header input', { scope: this }, this.filterData);
        $(document).on('focus', '.filter-header input', { scope: this }, this.setBorderInput);
        $(document).on('click', '.filter-header .arrow-down', { scope: this }, function () {
            var input = $('input[name="RefTypeName"]');
            $(input).trigger('focus');
        });
        $(document).on('click', 'body', this.hideElement);
        //event cho paginate
        $(document).on('click', '.icon-page-start', { scope: this, value: "start" }, this.pagingFilter);
        $(document).on('click', '.icon-page-previous', { scope: this, value: "previous" }, this.pagingFilter);
        $(document).on('click', '.icon-page-next', { scope: this, value: "next" }, this.pagingFilter);
        $(document).on('click', '.icon-page-end', { scope: this, value: "end" }, this.pagingFilter);
        $(document).on('click', '.icon-page-reload', { scope: this, value: "reload" }, this.pagingFilter);
        $(document).on('click', '.item-refresh', { scope: this, value: "reloadAll" }, this.pagingFilter);
        $(document).on('change', 'select[field="pageSize"]', { scope: this, value: "reload" }, this.pagingFilter);
        $(document).on('change', 'input[field="pageNumber"]', { scope: this }, this.pagingFilter);
        $(document).on('keyup', 'input[field="pageNumber"]', { scope: this }, function () {
            var val = $(this).val();
            var totalPage = parseInt($('.total-page').text());
            if (val == '') {
                $(this).val(1);
            }
            else {
                if (parseInt(val) > totalPage) {
                    $(this).val(totalPage);
                }
            }
        });
        $(document).on('focus click', '.grid-dialog-body tbody tr input', this.selectRowTableDialog);
        $(document).on('click', '.grid-master-body tbody tr', { scope: this }, this.showRefDetail);
        $(document).on('dblclick', '.grid-master-body tbody tr', { scope: this, action: "view" }, this.showDialog);
        $(document).on('click', '.grid-master-body tbody tr a', function () {
            $(this).closest('tr').trigger('click');
            $(this).closest('tr').trigger('dblclick');
        });
        //event cho dialog
        $(document).on('click', '#dialog-main .object-detail .info-code .arrow-down', { scope: this }, this.showSubtableChooseObject);
        $(document).on('click', '#dialog-main .staff-detail .info-code .arrow-down', { scope: this }, this.showSubtableChooseStaff);
        $(document).on('click', '#dialog-main .icon-recycle', { scope: this }, this.deleteRowDetail);
        $(document).on('focusout', '#dialog-main input[field="Money"]', { scope: this }, this.insertNewRow);
        $(document).on('keyup', '#dialog-main input[field="RefNo"]', { scope: this, type: 'keyup' }, this.validateCode);
        $(document).on('focusin', '#dialog-main input[field="RefNo"]', { scope: this, type: 'keyup' }, function () {
            if ($(this).val() != '') {
                $(this).data('value', $(this).val());
            }
        });
        $(document).on('focusout', '#dialog-main input[field="RefNo"]', { scope: this, type: 'focusout' }, this.validateCode);
        $(document).on('keyup focusout', '#dialog-main input[field="Money"]', { scope: this }, this.validateMoney);
        $(document).on('keyup', '#dialog-main input[field="RefDate"]', { scope: this, type: 'keyup' }, this.valiateDate);
        $(document).on('focusout', '#dialog-main input[field="RefDate"]', { scope: this, type: 'focusout' }, this.valiateDate);
        $(document).on('focusout keyup', 'input[fielddata="money"]', { scope: this, type: 'focusout' }, this.validateMoney);
        $(document).on('keyup keydown', '#dialog-main input[field="ObjectCode"]', { scope: this }, this.autocompleteObject);
        $(document).on('keyup keydown', '#dialog-main input[field="StaffCode"]', { scope: this }, this.autocompleteStaff);
        $(document).on('click', '#dialog-main,body', this.hideTable);
        $(document).on('focus keyup', '#dialog-main input[field="BudgetName"]', { scope: this }, this.autocompleteBudget);
        $(document).on('focus', '#dialog-main .grid-dialog-body input', this.setBorderInput);
        $(document).on('focus', '#dialog-main .grid-dialog-body .icon-recycle', this.setBorderDiv);
        $(document).on('focus', '#dialog-main .form-information input', this.setBorderInput);
        $(document).on('focusout', 'input', function () {
            $(this).parent().removeClass('border-focus');
            $(this).parent().removeClass('border-div');
        });
        $(document).on('keydown', 'input[field="pageNumber"],input[field="Money"],input[fielddata="money"]', this.checkNumberFormat);



        //event cho toolbar dialog
        $(document).on('click', '#dialog-main .item-save', { scope: this }, this.saveData);
        $(document).on('click', '#dialog-main .item-prev', this.showRefPreNextInDialog);
        $(document).on('click', '#dialog-main .item-next', this.showRefPreNextInDialog);
        $(document).on('click', '#dialog-main .item-add', { scope: this, action: "add" }, this.showDialog);
        //event cho subtable
        $(document).on('click', '.subtable-object-body tbody tr', { scope: this }, this.bindObjectData);
        $(document).on('click', '.subtable-staff-body tbody tr', { scope: this }, this.bindStaffData);
        // event checkbox
        $(document).on('click', '.icon-checkbox', this.StatusCheckbox);
        $(document).on('click', '.item-header-check', this.checkAll);
        //tabindex
        $(document).on('focus', '.start-tab', function () {
            $('.grid-dialog-body tbody tr:last-child td:first-child input').focus();
        });
        $(document).on('focus', '.end-tab', function () {
            $('.grid-dialog-body tbody tr:first-child td:first-child input').focus();
        });
        //dialog ask delete
        $(document).on('click', '.btn-close-canel', this.canelCloseDialog);
        $(document).on('click', '.dialog-delete .btn-delete', { scope: this }, this.deleteRef);
        //dialog close
        $(document).on('click', '.dialog-close .btn-close-save', { scope: this }, this.saveData);
        $(document).on('click', '.dialog-close .btn-close-nosave', this.closeDialogAskClose);


    }
    /**
     * hàm xử lí các phím tắt
     * CreatedBy TDLam(30/08/2019)
     */
    setHotKey() {
        $(window).keydown(function () {

            //Nhấn ctrl+Del để xóa dòng
            if (event.ctrlKey && event.keyCode === 46) {
                if ($("#dialog-main").dialog("isOpen")) {
                    var row = $('.grid-dialog-body .choose-select');
                    if ($(row).prev().length > 0) {
                        $(row).prev().find('input[field="JournalMemo"]').focus();

                        $('.grid-dialog-body .choose-select').next().find('.icon-recycle').trigger('click');
                    }
                    else {
                        $(row).next().find('input[field="JournalMemo"]').focus();

                        $('.grid-dialog-body .choose-select').prev().find('.icon-recycle').trigger('click');
                    }


                }
                event.preventDefault();
            }
            //Nhấn Ctrl + Insert để thêm dòng mới
            if (event.ctrlKey && event.keyCode === 45) {
                if ($("#dialog-main").dialog("isOpen")) {
                    Common.renderNewRowDialogDetail($('.grid-dialog-body .choose-select'));
                }
                event.preventDefault();
            }
            //  Bấm mũi tên xuống thì chuyển load dữ liệu các sản phẩm của hóa đơn
            if (event.keyCode === 40) {

                var isOpen = $("#dialog-main").dialog("isOpen");
                if (!isOpen && ($('input[name="RefTypeName"]')[0].isEqualNode(event.target) == false)) {
                    let rowFocus = $(".row-selected");
                    mainJS.loadPreviousOrNext(rowFocus, "next");
                }
                event.preventDefault();
            }

            //  Bấm mũi tên lên thì chuyển load dữ liệu các sản phẩm của hóa đơn
            if (event.keyCode === 38) {
                var isOpen = $("#dialog-main").dialog("isOpen");
                if (!isOpen && $('input[name="RefTypeName"]')[0].isEqualNode(event.target) == false) {
                    let rowFocus = $(".row-selected");
                    mainJS.loadPreviousOrNext(rowFocus, "previous");
                }
                event.preventDefault();
            }
            if (event.ctrlKey && event.keyCode === 83) {
                if ($("#dialog-main").dialog("isOpen")) {
                    $('.dialog-main .item-save').trigger('click');
                }
                event.preventDefault();
            }
            // F7 xem bản ghi phía trước
            if (event.keyCode === 118) {
                if ($("#dialog-main").dialog("isOpen")) {
                    $('.dialog-main .item-prev').trigger('click');
                }
                event.preventDefault();
            }

            // F9 xem bản ghi phía sau
            if (event.keyCode === 120) {
                if ($("#dialog-main").dialog("isOpen")) {
                    $('.dialog-main .item-next').trigger('click');
                }
                event.preventDefault();
            }
        });
    }
    /**
     * hàm không cho nhập chữ chỉ cho nhập số
     * @param {any} event
     */
    checkNumberFormat(event) {
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode == 8) || (event.keyCode == 9) || (event.keyCode == 46)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * hàm kiểm tra dữ liệu khi ấn vào nút lưu ở dialog
     * @param {*} action 
     * CreatedBy TDLam(30/08/2019)
     */
    checkSave(action) {
        var flag = 1;
        $(".text-error").hide();
        //kiểm tra số dòng ở detail
        if ($('.grid-dialog-body tbody tr').length < 2) {
            $(".dialog-error").dialog('open');
            $('.text-error-detail').show();
            return 0;
        }
        //kiểm tra tổng tiền ở phần detail
        if ($('#dialog-main th[field="TotalMoney"]').text() == '0') {
            $(".dialog-error").dialog('open');
            $('.text-error-money').show();
            return 0;
        }
        var RefNo = $('#dialog-main [field="RefNo"]');
        if (action == 'edit' && $(RefNo).val() == $(RefNo).data('val')) {
            return 1;

        }
        //gọi service kiểm tra mã trùng
        serviceAjax.get('/refs/existedcode/' + $(RefNo).val(), {}, false, function (res) {
            console.log(res.Data);
            if (res.Data == '0') {
                $(".dialog-error").dialog('open');
                $('.text-error-code').show();
                flag = res.Data;
                return 0;
            }
            else {
                flag = res.Data;
                return 1;
            }
        });

        return flag;
    }
    /**
     * hàm huỷ bỏ khi ở dialog hỏi đóng
     * CreatedBy TDLam(30/08/2019)
     */
    canelCloseDialog() {
        $('.dialog-delete').dialog('close');
        $('.dialog-close').dialog('close');
    }
    /**
     * hàm xử lí khi đóng cả dialog
     * CreatedBy TDLam(30/08/2019)
     */
    closeDialogAskClose() {
        $('.dialog-close').dialog("close");
        $('#dialog-main').dialog("close");
    }
    /**
     * hàm kiểm tra cho phép ấn button trước hoặc sau xong form xem
     * CreatedBy TDLam(30/08/2019)
     */
    setStatusNextandPre() {

        if ($(".grid-master-body tbody tr:first").hasClass("row-selected")) {
            $(".item-prev").addClass("button-disable");
        } else {

            $(".item-prev").removeClass("button-disable");
        }
        if ($(".grid-master-body tbody tr:last").hasClass("row-selected")) {
            $(".item-next").addClass("button-disable");
        } else {
            $(".item-next").removeClass("button-disable");
        }
    }

    /**
     * hàm show ref lên dialog khi ấn trước sau
     * CreatedBy TDLam(30/08/2019)
     */
    showRefPreNextInDialog() {
        let rowFocus = $(".row-selected");
        if ($(this).hasClass('item-next')) {
            mainJS.loadPreviousOrNext(rowFocus, "next");
            $('.item-view').trigger('click');
            mainJS.setStatusNextandPre();
        }
        if ($(this).hasClass('item-prev')) {
            mainJS.loadPreviousOrNext(rowFocus, "previous");
            $('.item-view').trigger('click');
            mainJS.setStatusNextandPre();
        }
    }
    /**
     * hàm show phiếu khi ấn nút lên xuống
     * @param {*} rowCurrent 
     * @param {*} goal 
     * CreatedBy TDLam(30/08/2019)
     */
    loadPreviousOrNext(rowCurrent, goal) {

        let Id;
        let rowFocus;
        if (goal === "previous") {
            rowFocus = $(rowCurrent).prev();
            Id = $(rowFocus).data("RefID");
            Common.scrollCombobox('.grid-master', $(rowFocus));
        }
        if (goal === "next") {
            rowFocus = $(rowCurrent).next();
            Id = $(rowFocus).data("RefID");
            Common.scrollCombobox('.grid-master', $(rowFocus));
        }

        if (rowFocus && Id) {
            $(".row-selected").removeClass("row-selected");
            $(".content-grid-body .row-selected").removeClass("row-selected");
            $(rowFocus).addClass("row-selected");
            $(rowFocus).trigger('click');

        }
        this.setStatusNextandPre();
    }

    /**
     * hàm chọn dòng trong bảng dialog detail 
     * CreatedBy TDLam(28/08/2019)
     */
    selectRowTableDialog() {
        $('.grid-dialog-body .choose-select').removeClass('choose-select');
        $(this).parents('tr').addClass('choose-select');
        $(this).parents('tr').find('input').not(this).addClass('not-choose');
        $(this).parents('tr').find('input').not(this).attr('placeholder', '');
        $(this).removeClass('not-choose');
        var fieldname = $(this).attr('field');
        if (fieldname === 'JournalMemo') {
            $(this).attr('placeholder', 'nhập diễn giải');
        } else if (fieldname === 'Money') {
            $(this).attr('placeholder', 'nhập số tiền');
        } else {
            $(this).attr('placeholder', 'nhập mục thu chi');
        }

    }

    /**
     * hàm kiểm tra các checkbox
     * @param {*} event 
     * CreatedBy TDLam(30/08/2019)
     */
    StatusCheckbox(event) {
        // nếu ô đầu tiên đang đc check mà các ở phía dưới k check đủ thì bỏ check
        if (($(this).hasClass('icon-checkedbox')) && ($(".item-header-check").hasClass('checked'))) {
            $(".item-header-check").removeClass('checked');
        }
        if ($(this).hasClass('icon-checkedbox')) {

            $(this).removeClass("icon-checkedbox");
            $(this).addClass("icon-uncheckbox");
            $(this).parent().parent().removeClass("row-selected");
        } else {
            $(this).addClass("icon-checkedbox");
            $(this).removeClass("icon-uncheckbox");
            $(this).parent().parent().addClass("row-selected");
        }
        // check đủ các ô thì ô đầu tiên đc check
        if ($('.row-selected').length == $('.grid-master-body tbody tr').length) {
            $(".item-header-check").addClass('checked');
        }
        Common.actionToolbarGrid();
        event.stopPropagation();

    }
    /**
     * hàm xử lí khi click nút chọn tất cả checkbox
     * CreatedBy TDLam(29/08/2019)
     */
    checkAll() {
        $(this).toggleClass("checked");
        if ($(this).hasClass('checked')) {
            $('.icon-checkbox').removeClass('icon-uncheckbox');
            $('.icon-checkbox').addClass('icon-checkedbox');
            $('.grid-master-body tbody tr').addClass('row-selected');
        } else {
            $('.icon-checkbox').removeClass('icon-checkedbox');
            $('.icon-checkbox').addClass('icon-uncheckbox');
            $('.grid-master-body tbody tr').removeClass('row-selected');
        }
        Common.actionToolbarGrid();
    }
    /********start:JS toolbar*/
    showComboboxRefType() {
        $(this).children('.combobox-item').show();
    }
    /**
     * hàm thực hiện xóa nhiều bản ghi hoặc 1 bản ghi
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    showDialogDelete() {
        $('.dialog-delete').dialog('open');
        var rows = $('.grid-master-body tbody tr td .icon-checkedbox');
        if (rows.length == 0) {
            var rows = $('.grid-master-body tbody tr.row-selected');
        }
        if ($(rows).length > 1) {
            $('.message-delete-single').hide();
            $('span[fieldName="RecordNumber"]').text(rows.length);
            $('.message-delete-multi').show();
        }
        if (rows.length == 1) {
            $('.message-delete-multi').hide();
            var refNo = $(".grid-master-body tr.row-selected").find('a').text();
            var importNumber = rows.find('a').text();
            $('span[fieldName="ImportNumber"]').text(importNumber);
            $('.message-delete-single').show();

        }
    }
    /**
     * hàm xoá ref theo một hay nhiều bản ghi
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    deleteRef(sender) {
        var me = sender.data["scope"];
        var rows = $('.grid-master-body tbody tr td .icon-checkedbox');
        if (rows.length == 0) {
            rows = $('.grid-master-body tbody tr.row-selected');
        }
        var listID = '';
        $.each(rows, function (index, row) {
            var id = $(row).closest('tr').data("RefID");
            listID = listID + id + ',';
        });
        listID = listID.slice(0, -1);
        $('.loading').show();
        serviceAjax.delete('/refs', listID, true, function (res) {
            if (res.Success == true) {
                $('.dialog-delete').dialog('close');
                $('#dialog-main').dialog('close');
                me.filterData();
            }


        });



    }
    /****end:Js toolbar*/
    /******************Start: JS GridMaster */
    /**
     * hàm hiển thị danh sách refdetail
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    showRefDetail(sender) {

        var me = sender.data["scope"];
        $($(this).siblings().find('.icon-uncheckbox')).closest('tr').removeClass('row-selected');
        $(this).addClass('row-selected');
        var RefID = $(this).data('RefID');
        var uri = '/refs/' + RefID;
        Common.actionToolbarGrid();
        serviceAjax.get(uri, {}, true, function (res) {
            mainJS.listRefDetails = res.Data;
            Common.renderDataGridDetail(res.Data["listRefDetails"]);
            $('.grid-detail-footer th[field="TotalMoney"]').text(res.Data.TotalMoney.toString().FormatMoney());
        });

    }
    /***End Js GridMaster */
    /**Start:JS dialog
     * */
    /**
     * hàm hiển thị dialog 
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    showDialog(sender) {
        var me = sender.data["scope"];
        sender.stopPropagation();
        $('.combobox-item').hide();
        var rowselected = $('.grid-master-body tbody tr.row-selected');
        var me = sender.data["scope"];
        var action = sender.data["action"];
        var RefID = $(rowselected).data("RefID");
        //gọi ajax để load danh sách nhân viên, đối tượng và buget
        serviceAjax.get('/staffs', {}, true, function (res) {
            me.listStaffs = res.Data;
        });
        serviceAjax.get('/objects', {}, true, function (res) {
            me.listObjects = res.Data;
        });
        serviceAjax.get('/budgets', {}, true, function (res) {
            me.listBudgets = res.Data.map(function (item) {
                return {
                    id: item.BudgetID,
                    value: item.BudgetName
                }
            });
        });
        //loại hành động
        if (action == "add") {
            var refType = parseInt(sender.data["RefTypeID"]) ? parseInt(sender.data["RefTypeID"]) : parseInt($('#dialog-main').attr('RefTypeID'));
            $('#dialog-main').attr('RefTypeID', refType);
            Common.changeTypeDialog(refType, "add");
            Common.actionDialog("add");
            Common.actionToolbarDialog("add");
        } else {
            serviceAjax.get('/refs/' + RefID, {}, true, function (res) {
                Common.loadDataDialog(res.Data);
                var RefTypeID = parseInt(res.Data["RefTypeID"]);
                $('#dialog-main').attr('RefTypeID', RefTypeID);
                //luu ref tra ve vao refContainer
                me.refContainer = res.Data;
                if (action == "edit") {
                    Common.changeTypeDialog(RefTypeID, "edit");
                    Common.actionDialog("edit");
                    Common.actionToolbarDialog("edit");
                }
                if (action == "duplicate") {
                    Common.changeTypeDialog(RefTypeID, "duplicate");
                    Common.actionDialog("duplicate");
                    Common.actionToolbarDialog("duplicate");
                }
                if (action == "view") {
                    Common.changeTypeDialog(RefTypeID, "view");
                    Common.actionDialog("view");
                    Common.actionToolbarDialog("view");
                    mainJS.setStatusNextandPre();

                }
            });


        }
        $('#dialog-main').dialog("open");
        if (action != "view") $('#dialog-main input').first().focus();
    }
    /**
     * hàm lưu dữ liệu vào dabatase
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    saveData(sender) {
        var me = sender.data["scope"];
        var action = $('#dialog-main').data('action');
        var RefNo = me.checkSave(action);
        if (RefNo != 0) {
            if (action == 'add') {
                var result = Common.getDataDialog('add');
                if (RefNo != 1)
                    result["RefNo"] = RefNo;
                serviceAjax.post('/refs', result, true, function (res) {
                    //khi false
                    if (res.Data == 0) {
                        Common.showDialogWarn('error', res.Data.length)
                    }
                    else {
                        $('#dialog-main').dialog("close");

                        $('.dialog-close').dialog("close");
                        me.init();
                    }
                });
            } else {
                var result = Common.getDataDialog('edit');
                if (RefNo != 1)
                    result["RefNo"] = RefNo;
                serviceAjax.put('/refs', result, true, function (res) {
                    if (res.Data == 0) {
                        Common.showDialogWarn('error', res.Data.length);
                    }
                    else {
                        $('#dialog-main').dialog("close");
                        $('.dialog-close').dialog("close");

                        me.filterData();
                    }
                })
            }
        }

    }
    /**
     * hàm hoãn sửa dialog và chuyển về trạng thái view
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    stopEditDialog(sender) {
        var me = sender.data["scope"];
        Common.loadDataDialog(me.refContainer);
        var refType = parseInt($('#dialog-main').attr('RefTypeID'));
        Common.changeTypeDialog(refType, "view");
        Common.actionDialog("view");
        Common.actionToolbarDialog("view");
    }
    /**
     * hàm đóng dialog khi người dùng click nút đóng trên toolbar dialog
     * check xem có sửa hay thay đổi chưa để đóng
     * @param {*} sender 
     * CreateBy TDLam(31/08/2019)
     */
    checkCloseDialogAdd() {

        var close = 1;
        var inputs = $('#dialog-main input[field]').not($('input[field="RefNo"],input[field="RefDate"]'));

        $.each(inputs, function (index, input) {

            if ($(input).val().trim() != '') {
                close = 0;
                return false;

            }
        });
        return close;
    }
    /**
     * hàm xử lí khi đóng dialog
     * @param {*} sender 
     * CreatedBy TDLam(01/09/2019)
     */
    closeDialog(sender) {
        if ($('.dialog-error').dialog('isOpen')) {
            $('.dialog-error').dialog('close');
            return 1;
        }
        var me = sender.data["scope"];
        var action = $('#dialog-main').data('action');
        if (action == "add") {

            if (mainJS.checkCloseDialogAdd()) {
                $('#dialog-main').dialog("close");

            }
            else {
                Common.showDialogAsk();
            }
        }
        else {
            if (action == "view") {
                $('#dialog-main').dialog("close");
            }
            else {
                if (Common.checkDialogChange(me.refContainer["listRefDetails"]) == false) {
                    //TODO
                    Common.showDialogAsk();
                }
                else {
                    $('#dialog-main').dialog("close");
                }
            }
        }
        ;
    }
    /**
     * xoá dòng ở phần chi tiết dialog detail
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    deleteRowDetail(sender) {
        var me = sender.data["scope"];
        var rowCurrent = $(this).closest('tr');
        var row = $('.grid-dialog-body tbody tr:last-child');
        //if (rows.length > 1 && $(rowCurrent).find('input[field="Money"]').val() != '') {
        //    $(rowCurrent).remove();
        //}
        if (!$(rowCurrent).is($(row))) {
            $(rowCurrent).remove();
        }
        Common.calcTotalMoney();
    }
    //TODO
    /**
     * hàm chèn dòng mới khi outfocus khỏi ô nhập tiền
     * @param {any} sender
     */
    insertNewRow(sender) {
        var me = sender.data["scope"];
        var val = $(this).val().ParseIntegerFromMoney();
        if (val > 0) {
            Common.renderNewRowDialogDetail();
            if (val < 1000) {
                $(this).val((val + '000').FormatMoney());
            }
        }
    }
    //TODO
    validateMoney(sender) {
        var val = $(this).val().MoneyToString();
        $(this).val(val.FormatMoney());
        if ($('.dialog-main').dialog('isOpen'))
            Common.calcTotalMoney();
    }
    /**
     * hàm validate mã phiếu,không cho phép trống hoặc sai định dạng
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    validateCode(sender) {
        var type = sender.data["type"];
        var val = $(this).val();
        if (val == '') {
            if (type == "keyup") {
                $(this).parent().siblings('.icon-validate').show();
                $(this).parent().addClass('parent-validate');
                return false;
            }
            else {
                $(this).parent().siblings('.icon-validate').hide();
                $(this).parent().removeClass('parent-validate');
                $(this).val($(this).data('value'));
            }


        }
        else {
            $(this).parent().siblings('.icon-validate').hide();
            $(this).parent().removeClass('parent-validate');
            return true;
        }
    }
    /**
     * hàm validate ngày tháng, đúng định dạng
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    valiateDate(sender) {
        var type = sender.data["type"];
        var val = $(this).val();
        if (moment(val, 'DD/MM/YYYY', true).isValid() == false) {
            if (type == "focusout") {
                $(this).val($(this).data('val'));
                $(this).parent().siblings('.icon-validate').hide();
                $(this).parent().removeClass('parent-validate');

            }
            else {
                $(this).parent().siblings('.icon-validate').show();
                $(this).parent().addClass('parent-validate');
                return false;
            }


        }
        else {

            $(this).parent().siblings('.icon-validate').hide();
            $(this).parent().removeClass('parent-validate');

            return true;

        }
    }
    /**
     * hàm hiển thị bảng chọn đối tượng
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    showSubtableChooseObject(sender) {
        //$('.subtable-choose-object .selected').removeClass("selected");
        var me = sender.data["scope"];
        $('#dialog-main .border-focus').removeClass('border-focus');
        $('#dialog-man .border-div').removeClass('border-div');
        $(this).parent().addClass('border-focus');
        var pos = $(this).parents('.info-code').offset();
        $('.subtable-choose-object').show();
        $('.subtable-choose-object').css('top', pos.top + 33);
        $('.subtable-choose-object').css('left', pos.left);
        serviceAjax.get('/objects', {}, true, function (res) {
            Common.renderData('.subtable-object-header', '.subtable-object-body', res.Data, "ObjectID");
        });
    }
    eventKeyCode(table) {
        var rowSelected = $(table + ' tbody tr.selected');
        if (rowSelected.length == 0) $(table + 'tbody tr:first-child').addClass('selected');
            if (event.keyCode === 40) {
                var rownext = $(rowSelected).next();
                if (rownext.length) {
                    rowSelected.removeClass("selected");
                    rownext.addClass("selected");
                    rowSelected = rownext;
                    Common.scrollCombobox(table, rownext);
                }
            }
            if (event.keyCode === 38) {
                var rowprev = rowSelected.prev();
                if (rowprev.length) {
                    rowSelected.removeClass("selected");
                    rowprev.addClass("selected");
                    rowSelected = rowprev;
                    Common.scrollCombobox(table, rowprev);
                }
            }
            if (event.keyCode === 13) {
                rowSelected.trigger('click');
                $(table).hide();
            }

        
    }
    /**
     * hàm bind dữ liệu từ bản chọn đói tượng vào dialog
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    bindObjectData(sender) {
        var me = sender.data["scope"];
        var ObjectID = $(this).data("ObjectID");
        var ObjectName = $($(this).children()[1]).text();
        var ObjectCode = $($(this).children()[0]).text();
        //$('.object-detail input[field="ObjectID"]').val(ObjectID);
        $('.object-detail input[field="ObjectNameEdit"]').val(ObjectName);
        $('.object-detail input[field="ObjectCode"]').val(ObjectCode);
        $('.object-detail input[field="ObjectCode"]').data("ObjectID", ObjectID);
        $('.subtable').hide();


    }
    /**
     * hàm hiển thị danh sách đối tượng theo input nhập vào
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    autocompleteObject(sender) {
        var me = sender.data["scope"];

        var val = $(this).val().toLowerCase();
        if (sender.type == "keyup" && sender.keyCode != 9 && val != '' && sender.keyCode != 38 && event.keyCode != 40 && event.keyCode!=13) {
            var result = me.listObjects.filter(function (item) {
                return item.ObjectCode.toLowerCase().includes(val) || item.ObjectName.toLowerCase().includes(val);
            });
            var pos = $(this).parents('.info-code').offset();
            $('.subtable-choose-object').show();
            $('.subtable-choose-object').css('top', pos.top + 33);
            $('.subtable-choose-object').css('left', pos.left);
            Common.renderData('.subtable-object-header', '.subtable-object-body', result, "ObjectID");
        }
        if (sender.type == "keydown" && (sender.keyCode == 38 || event.keyCode == 40 || event.keyCode==13)) {
            me.eventKeyCode('.subtable-choose-object');
        }
    }
    /**
     * hàm hiển thị bảng chọn nhân viên
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    showSubtableChooseStaff(sender) {
        var me = sender.data["scope"];
        $('#dialog-main .border-focus').removeClass('border-focus');
        $('#dialog-man .border-div').removeClass('border-div');
        $(this).parent().addClass('border-focus');
        var pos = $(this).parents('.info-code').offset();
        $('.subtable-choose-staff').show();
        $('.subtable-choose-staff').css('top', pos.top + 33);
        $('.subtable-choose-staff').css('left', pos.left);
        serviceAjax.get('/staffs', {}, true, function (res) {
            Common.renderData('.subtable-staff-header', '.subtable-staff-body', res.Data, "StaffID");
        });
    }
    /**
     * hàm lọc danh sách nhân viên theo input nhập vào 
     * @param {*} sender 
     * CreatedBy TDLam(31/08/2019)
     */
    autocompleteStaff(sender) {
        var me = sender.data["scope"];
        var val = $(this).val().toLowerCase();

        if (sender.type == "keyup" && sender.keyCode != 9 && val != '' && sender.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
            var result = me.listStaffs.filter(function (item) {
                return item.StaffCode.toLowerCase().includes(val) || item.StaffName.toLowerCase().includes(val);
            });
            var pos = $(this).parents('.info-code').offset();
            $('.subtable-choose-staff').show();
            $('.subtable-choose-staff').css('top', pos.top + 33);
            $('.subtable-choose-staff').css('left', pos.left);
            Common.renderData('.subtable-staff-header', '.subtable-staff-body', result, "StaffID");
        }
        if (sender.type == "keydown" && (sender.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13)) {
            me.eventKeyCode('.subtable-choose-staff');
        }
    }
    /**
     * hàm bind dữ liệu từ bảng chọn nhân viên vào input dialog
     * @param {any} sender
     * CreatedBy TDLam(30/08/2019)
     */
    bindStaffData(sender) {
        var me = sender.data["scope"];
        var StaffID = $(this).data("StaffID");
        var StaffName = $($(this).children()[1]).text();
        var StaffCode = $($(this).children()[0]).text();
        //$('.object-detail input[field="ObjectID"]').val(ObjectID);
        $('.staff-detail input[field="StaffName"]').val(StaffName);
        $('.staff-detail input[field="StaffCode"]').val(StaffCode);
        $('.staff-detail input[field="StaffCode"]').data("StaffID", StaffID);
        $('.subtable').hide();

    }
    /**
     * ẩn đi các table chọn đối tượng và nhân viên khi click ra ngoài bảng
     * created by TDLam(31/8/2019)
     * @param {any} sender
     */
    hideTable(sender) {
        if (sender.target.className != 'arrow-down' && sender.target.className != 'icon-compare') {
            $('.subtable-choose-object').css('display', 'none');
            $('.subtable-choose-staff').css('display', 'none');
            // $('.filter-option-col2').css('display', 'none');

        }
    }
    /**
     * hàm set autocomplete cho phần mục thu chi
     * @param {*} sender 
     * CreatedBy TDLam(29/08/2019)
     */
    autocompleteBudget(sender) {
        var pos = $(this).parent().offset();
        var me = sender.data["scope"];
        $(this).autocomplete({
            minLength: 0,
            source: me.listBudgets,
            position: {
                top: pos.top + 32,
                left: pos.left,
            },
            select: function (event, ui) {
                $(this).data('BudgetID', ui.item.id);
                $(this).data('val', ui.item.value);


            }
        })
    }
    /**
     * hàm set border cho input khi focus
     * */
    setBorderInput() {
        $('.border-focus').removeClass('border-focus');
        $('.border-div').removeClass('border-div');
        $(this).parent().addClass('border-focus');
    }
    setBorderDiv() {
        $('#dialog-main .border-div').removeClass('border-div');
        $('#dialog-main .border-focus').removeClass('border-focus');
        $(this).addClass('border-div');
    }
    /**end:JS dialog
     * */

    /*************************************JS xu li dung chung */
    /**
     * hàm lọc dữ liệu 
     * @param {any} sender
     * CreatedBy TDLam(28/08/2019)
     */
    pagingFilter(sender) {
        var me = sender.data["scope"];
        var value = sender.data["value"];
        if (value == "reloadAll") {
            $('.item-header input').val('');
            $('input[field="pageNumber"]').val(1);
        }
        else {
            var pageNumVal = $('input[field="pageNumber"]').val();
            var pageNumber;
            if (pageNumVal == '') pageNumber = 1;
            else pageNumber = parseInt(pageNumVal);
            var totalPage = parseInt($('.total-page').text());
            switch (value) {
                case "start":
                    $('input[field="pageNumber"]').val(1);
                    break;
                case "previous":
                    $('input[field="pageNumber"]').val(pageNumber > 1 ? (pageNumber - 1) : 1);
                    break;
                case "next":
                    $('input[field="pageNumber"]').val((pageNumber + 1) < totalPage ? (pageNumber + 1) : totalPage);
                    break;
                case "end":
                    $('input[field="pageNumber"]').val(totalPage);
                    break;
                default:
                    break;
            }
        }

        me.filterData();

    }
    /**
     * hàm xử lí show comparecondition
     * CreatedBy TDLam(28/8/2019)
     * */
    showCompareCondition(event) {
        event.stopPropagation();
        $(".anotation-compare").hide();
        $(this).children(".anotation-compare").show();
    }
    /**
     * ẩn các compare-menu
     * CreatedBy TDLam(28/08/2019)
     * */
    hideElement() {
        $(".anotation-compare").hide();
    }
    /**
     * hàm bind dữ liệu từ item-menu-conditon
     * @param {any} event
     * CreatedBy TDLam(28/08/2019)
     */
    bindCompareCondition(event) {
        event.stopPropagation();
        var me = event.data["scope"];
        var val = $(this).attr('filter-type');
        var text = $(this).text().split(":")[0].trim();
        $(this).closest('.item-header').attr('dataType', val);
        $(this).closest('.anotation-compare').siblings('span').text(text);
        $('.anotation-compare').hide();
        var val = $(this).parents('.filter-header').find('input').val();
        if (val != '' && val != '__/__/____') {
            me.filterData();
        }
    }
    /**
     * hàm xử lí khi click vào header của grid-master-header,để sắp xếp lại dữ liệu
     * @param {any} sender
     * 
     */
    bindOrderBy(sender) {
        var me = sender.data["scope"];
        var orderBy = $(this).parents('.item-header').attr('orderBy');
        if (orderBy == '' || orderBy == 'asc') {

            $(this).parents('.item-header').attr('orderBy', 'desc');
            $(this).parents('.item-header').siblings().attr('orderBy', '');
        }
        else {
            $(this).parents('.item-header').attr('orderBy', 'asc');
            $(this).parents('.item-header').siblings().attr('orderBy', '');
        }
        me.filterData();
    }
    /**
     * hàm filter dữ liệu
     * @param {any} sender
     * CreatedBy TDLam(29/08/2019)
     */
    filterData() {
        $('.loading').show();
        var filterPaging = Common.getFilterObjectCondition();
        var uri = '/refs/filter';
        serviceAjax.post(uri, filterPaging, true, function (res) {
            mainJS.listRefs = res.Data;
            if (res.Data.length == 0) {
                $('.grid-master-body tbody').empty();
                $('.loading').hide();
            }
            Common.renderDataGridMaster(mainJS.listRefs);
            Common.setPageNumAndPageSize(filterPaging.pageNumber, filterPaging.pageSize, mainJS.listRefs);
        });
    }
}