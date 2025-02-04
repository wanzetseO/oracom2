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


    function editlabeldatefield(obj, value) {
        obj._editTemplate_label = $("<label>");
        obj._editTemplate_check = $('<input />', {type: 'checkbox', checked: value});
        obj._editTemplate_check.appendTo(obj._editTemplate_label);
        obj._editTemplate_check.checkboxradio();
        //return $("<label>").append($('<input />', { type: 'checkbox', checked: value}).checkboxradio());
        return obj._editTemplate_label;///=editlabeldatefield(value);
    }

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

  /* counties.unshift({id: "0", Name: ""});
    services.unshift({id: "0", Name: ""});
    company_categories.unshift({id: "0", Name: ""});
    company_subcategories.unshift({id: "0", Name: ""});
*/

    jsGrid.loadStrategies.PageLoadingStrategy.prototype.sort = function () {
        this._grid._sortData();
        this._grid.refresh();
        return $.Deferred().resolve().promise();
    };

    var email = $('#comment').val();

    ////MULTISELECT////////
    var MultiselectField = function (config) {
        jsGrid.Field.call(this, config);
    };

    MultiselectField.prototype = new jsGrid.Field({

        items: [],

        textField: "",

        itemTemplate: function (value) {
            return $.makeArray(value).join(", ");
        },

        _createSelect: function (selected) {
            var textField = this.textField;
            var $result = $("<select>").prop("multiple", true);

            $.each(this.items, function (_, item) {
                var value = item[textField];
                var $opt = $("<option>").text(value);

                if ($.inArray(value, selected) > -1) {
                    $opt.attr("selected", "selected");
                }

                $result.append($opt);
            });

            return $result;
        },

        insertTemplate: function () {
            var insertControl = this._insertControl = this._createSelect();

            setTimeout(function () {
                insertControl.multiselect({
                    minWidth: 140
                });
            });

            return insertControl;
        },

        editTemplate: function (value) {
            var editControl = this._editControl = this._createSelect(value);

            setTimeout(function () {
                editControl.multiselect({
                    minWidth: 140
                });
            });

            return editControl;
        },

        insertValue: function () {
            return this._insertControl.find("option:selected").map(function () {
                return this.selected ? $(this).text() : null;
            });
        },

        editValue: function () {
            return this._editControl.find("option:selected").map(function () {
                return this.selected ? $(this).text() : null;
            });
        }

    });

    jsGrid.fields.multiselect = MultiselectField;


    /////MULTISELECT////////


        $("#jsGrid").jsGrid({
            height: "auto",
            width: "100%",
            updateOnResize: true,
            filtering: true,
            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
            pageLoading: true,
            pageSize: 50,
            loadShading: true,
            searching: true,
            autosearch: true,
            autoload: true,
            pageButtonCount: 5,
            insertedRowLocation: "top",
            insertRowLocation: "top",
            deleteConfirm: "Do you really want to delete Person ?",
            headerRowClass: 'table-green-header',
            fields: [
                {type: "control", width: 0.01},

                {name: "selected", title: "Select", type: "_checkboxDateField", width: 5, align: "center"},

                {
                    name: "Company",
                    title: "Company",
                    type: "text",
                    width: 5,
                    filtering: true,
                    // validate: "required"
                },
                {
                    name: "Full_Names",
                    title: "Full Names",
                    type: "text",
                    width: 20,
                    // validate: "required"
                    filtering: true
                },

                {
                    name: "Email_1", title: "Email_1", type: "text", filtering: true,
                    width: 7
                    /*
                      validate: {
                          message: "Email Must be Specified", validator: function (value) {
                              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                              return re.test(String(value).toLowerCase());
                          }
                      }*/
                },
                {
                    name: "Email_2",
                    title: "Email_2",
                    type: "text",
                    width: 5,
                    // validate: "required"
                    filtering: true
                },
                {
                    name: "Phone_1",
                    title: "Phone_1",
                    type: "text",
                    width: 5,
                    filtering: true,
                    // validate: "required"
                },
                {
                    name: "Phone_2",
                    title: "Phone_2",
                    type: "text",
                    width: 5,
                    // validate: "required"
                    filtering: true
                }, {
                    name: "Position",
                    title: "Position",
                    type: "text",
                    width: 5,
                    // validate: "required"
                    filtering: true
                }, {
                    name: "SideHustle",
                    title: "SideHustle",
                    type: "text",
                    width: 5,
                    // validate: "required"
                    filtering: true
                },

                {
                    name: "Sex",
                    title: "Gender",
                    type: "text",
                    width: 5,
                    filtering:true
                  

                }, {
                    name: "Status",
                    title: "Status",
                    type: "text",
                    width: 20


                }, {
                    name: "Comments",
                    title: "Comments",
                    type: "text",
                    width: 20
                },
                //////Updates/////
                {
                    name: "CreatedBy", title: "CreatedBy", readOnly: "true",
                    width: 5
                },
                {name: "dateCreated", title: "DateCreated", readOnly: "true", width: 5},

                //  {name: "selected", title: "Select", type: "_checkboxDateField", width: 90, align: "center"},

                //////Updates/////
                {type: "control", width: 5}
            ],
            controller: {
                             loadData: function(filter){
                var deferred = $.Deferred();
                $.ajax({

                    url: "/oracom/loadPersons",
                    data:filter,
                    cache:true,
                    dataType: "json"


                }).done(function(response){
                    response.data=response.data;
                    response.itemsCount =response.len;

                  
                    deferred.resolve(response);


                });

                return deferred.promise();

            },
                insertItem: function (item) {
                    return $.ajax({
                        type: "POST",
                        url: "/oracom/savePerson",
                        data: item,
                        success: function (data) {
                            $("#jsGrid").jsGrid("refresh");
                        }
                    });
                },
                updateItem: function (item) {
                    return $.ajax({
                        type: "PUT",
                        url: "/oracom/editPerson",
                        data: item
                    });
                },

                deleteItem: function (item) {
                    return $.ajax({
                        type: "DELETE",
                        url: "/oracom/postDelete",
                        data: item
                    });
                }
            }

        });
    });


