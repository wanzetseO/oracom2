$(function () {

    $.toast({
        text: "A moment please, Loading records...",
        showHideTransition: 'fade', // It can be plain, fade or slide
        bgColor: 'blue',              // Background color for toast
        textColor: '#eee',            // text color
        allowToastClose: false,       // Show the close button or not
        hideAfter: 5000, // `false` to make it sticky or time in miliseconds to hide after
        stack: 5,                     // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
        textAlign: 'left',            // Alignment of text i.e. left, right, center
        position: 'bottom-left',// bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
        loaderBg: '#000080'
    });


    //Search jsGrid while typing///
    originalFilterTemplate = jsGrid.fields.text.prototype.filterTemplate;
    jsGrid.fields.text.prototype.filterTemplate = function () {
        var grid = this._grid;
        var $result = originalFilterTemplate.call(this);
        $result.on("keyup", function (e) {
            grid.search();
        });
        return $result;
    };

    //************CUSTOM CHECKBOX*************
    var MyCheckboxDateField = function (config) {
        jsGrid.Field.call(this, config);
    };

    MyCheckboxDateField.prototype = new jsGrid.Field({
        itemTemplate: function (value) {
            //return $("<label>").append($('<input />', { type: 'checkbox', checked: value}).checkboxradio());
            this._label = $("<label>");
            this._datecheck = $('<input />', {type: 'checkbox', checked: value});
            this._datecheck.appendTo(this._label);
            this._datecheck.checkboxradio();
            console.log($(this._datecheck).prop('checked'));
            return this._label;
            /// return $('<input />', { type: 'checkbox', checked: value}).checkboxradio({label : ""});
        },
        editTemplate: function (value) {
            ///return this._editdatecheck=$("<label>").append($('<input />', { type: 'checkbox', checked: value}));

            return this._editTemplate_label = new editlabeldatefield(this, value);///=editlabeldatefield(value);
        },
        editValue: function () {
            console.log($(this._editTemplate_check).prop('checked'));
            return $(this._editTemplate_check).prop('checked');
        },
        insertTemplate: function (value) {
            this._insertTemplate_label = $("<label>");
            this._insertTemplate_check = $('<input />', {type: 'checkbox'});
            this._insertTemplate_check.appendTo(this._insertTemplate_label);
            this._insertTemplate_check.checkboxradio();
            //return $("<label>").append($('<input />', { type: 'checkbox', checked: value}).checkboxradio());
            //console.log(this._insertTemplate_check);
            return this._insertTemplate_label;///=editlabeldatefield(value);
        },
        insertValue: function () {
            return $(this._insertTemplate_check).prop('checked');
        }
    });

    jsGrid.fields._checkboxDateField = MyCheckboxDateField;

    //************CUSTOM CHECKBOX*************
    var sex = [
        {Name: "", Id: 0},
        {Name: "M", Id: 1},
        {Name: "F", Id: 2}


    ];

        $("#jsGrid").jsGrid({
            height: "auto",
            width: "auto",
            filtering: true,
            sorting: true,
            paging: true,
            autowidth: true,
            shrinkToFit: false,
            altRows: true,
            autoload: true,
            loadShading: true,
            pageLoading:true,
            pageSize: 50,
            
            rowClick: function (args) {
                var $row = this.rowByItem(args.item);
                $row.toggleClass("highlight");

                return false;
            },
            insertRowLocation: "top",
            singleSelectClickMode: "selectonly",
            pageSize: 10,
            pageButtonCount: 5,
            deleteConfirm: "Do you really want to delete Person?",
            fields: [
                {type: "control"},
/*
public String type;
public String SentBy;
public String SentTo;
public boolean received;
public String SentDate;
public String DateReceived;

*/
              
                {
                    name: "type",
                    title: "Email Category",
                    type: "text",
                    width: 150,
                    // validate: "required"
                    filtering: true
                },
                {
                    name: "message",
                    title: "Contents",
                    type: "text",
                    width: 250,
                    // validate: "required"
                    filtering: true
                },
                {
                    name: "SentBy",
                    title: "SENDER EMAIL",
                    type: "text",
                    width: 250,
                    // validate: "required"
                    filtering: true
                }, {
                    name: "SenderName",
                    title: "Sender USername",
                    type: "text",
                    width: 150,
                    // validate: "required"
                    filtering: true
                },
                {
                    name: "SentTo",
                    title: "RECIEVER Email",
                    type: "text",
                    width: 250,
                    filtering: true
                    // validate: "required"
                },
                {
                    name: "received", title: "Delivered", type: "_checkboxDateField", width: 90, align: "center"
                    
                    /*
                      validate: {
                          message: "Email Must be Specified", validator: function (value) {
                              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                              return re.test(String(value).toLowerCase());
                          }
                      }*/
                },
                {
                    name: "SentDate",
                    title: "Date Sent",
                    type: "text",
                    width: 150,
                    filtering: true
                    },
                {
                    name: "DateReceived",
                    title: "Date Received",
                    type: "text",
                    width: 150,
                    //validate: "required",
                    filtering: true
                    

                },
                //////Updates/////
                
               // {name: "selected", title: "Select", type: "_checkboxDateField", width: 90, align: "center"},

                //////Updates/////
                {type: "control"}
            ],

            controller: {

                loadData: function(filter){
                var deferred = $.Deferred();
                $.ajax({

                    url: "/oracom/loadEmailreports",
                    data:filter,
                    cache:true,
                    dataType: "json"


                }).done(function(response){
                    response.data=response.data;
                    response.itemsCount = response.len;

                  
                    deferred.resolve(response);


                });

                return deferred.promise();

            }

                
            }

        });
    });


