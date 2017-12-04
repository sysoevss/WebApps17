function is_empty(obj) {
    if (!obj || obj == "" || obj == "None")
        return true;
    return false;
}

$(document).ready(function () {
    //
    // Main menu handlers
    //
    $(".nav#main_menu > li > a").click(function (e) {
        e.preventDefault();

        // Show specific container
        $(".nav#main_menu > li").removeClass("active");
        $(this).parent().addClass("active");
        $(".inner").hide();
        container_id = $(this).attr("id") + "_container";
        $("#" + container_id).show();

    });
    //
    // // add project
    //    $("#add_project").click(function (e) {
    //        e.preventDefault();
    //        var $thisTr = $(this).parent().parent();
    //        project_name = $("#new_project_name").val();
    //        $.post("/object_add/", {object_type: "project", project_name: project_name}, function (data) {
    //            // var $newTr = $("#users_table").find(".user_template").clone(true, true);
    //            // $newTr.find("td.user_key").text(data);
    //            // $newTr.find("td.user_name").text(user_name);
    //            // $newTr.find("td.user_email").text(user_email);
    //            // $newTr.removeAttr("style").removeAttr("class");
    //            // $newTr.prependTo("#users_table tbody");
    //
    //            // $("#new_user_name").val("");
    //            // $("#new_user_email").val("");
    //        }).fail(function () {alert("Пользователь уже зарегистрирован.")});
    //
    //    });


    //
    //
    // User's Projects Tab
    //
    //

    /*$("#projects_table").find(".delete_user_project").click(function (e) {
        e.preventDefault();
        $(".edit_project").hide();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.project_key").text();

        jQuery.ajax({
            url: '/delete_user_project/?project_key=' + key,
            success: function (data) {
                alert('Проект удалён!');
            },
            type: "get"
        });

        $thisTr.remove();
    });*/


    //
    //
    //
    // Users Tab
    //
    //
    //

    //
    // add user
    $("#add_user").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();
        user_full_name = $("#new_user_full_name").val();
        user_name = $("#new_user_name").val();
        user_email = $("#new_user_email").val();
        if (!user_name || user_name == "") {
            alert("Имя пользователя не может быть пустым!");
            return;
        }
        $.post("/object_add/", {object_type: "user", fullname: user_full_name, 
                                username: user_name, email: user_email}, function (data) {
            var $newTr = $("#users_table").find(".user_template").clone(true, true);
            $newTr.find("td.user_key").text(data);
            $newTr.find("td.user_full_name").text(user_full_name);
            $newTr.find("td.user_name").text(user_name);
            $newTr.find("td.user_email").text(user_email);
            $newTr.removeAttr("style").removeAttr("class");
            $newTr.prependTo("#users_table tbody#user_tbody");

            $("#new_user_full_name").val("");
            $("#new_user_name").val("");
            $("#new_user_email").val("");
        }).fail(function () {
            alert("Пользователь уже зарегистрирован.")
        });

    });

    //
    // edit user
    /*
    $("#users_table").find(".edit_user").click(function (e) {
        e.preventDefault();
        $(".edit_user").hide();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.user_key").text();
        var fullname = $thisTr.find("td.user_full_name").text();
        var username = $thisTr.find("td.user_name").text();
        var email = $thisTr.find("td.user_email").text();
        var active = $thisTr.find("td.user_active").text();
        

        // prepare the input form
        var $form = $("#users_table").find(".user_edit").clone(true, true);
        $form.find("td.user_key").text(key);
        $form.find("input.user_full_name").val(fullname);
        $form.find("td.user_name").text(username);
        $form.find("input.user_email").val(email);
        var $cb = $form.find("input.user_active");
        if (active == "да") {
            $cb.prop('checked', true);
        } else {
            $cb.prop('checked', false);
        }
        $form.removeAttr("style").removeClass("user_edit");

        // insert the form instead of the object
        $form.insertAfter($thisTr);
        $thisTr.remove();
        // save old values for "cancel" action
        $("#old_fullname").html(fullname);
        $("#old_email").html(email);
        $("#old_active").html(active);
    });
    */
    //
    // Cancel edit (USER)
    $(".user_edit").find(".cancel_user_changes").click(function (e) {
        e.preventDefault();
        $(".edit_user").show();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.user_key").text();
        var fullname = $("#old_fullname").html();
        var username = $thisTr.find("td.user_name").text();
        var email = $("#old_email").html();
        var active = $("#old_active").html();

        // set the old values back
        var $newTr = $("#users_table").find(".user_template").clone(true, true);
        $newTr.find("td.user_key").text(key);
        $newTr.find("td.user_full_name").text(fullname);
        $newTr.find("td.user_name").text(username);
        $newTr.find("td.user_email").text(email);
        $newTr.find("td.user_active").text(active);
        $newTr.removeAttr("style").removeAttr("class");
        $newTr.insertAfter($thisTr);
        $thisTr.remove();
    });

    //
    // Accept edit (USER)
    $(".user_edit").find(".accept_user_changes").click(function (e) {
        e.preventDefault();
        $(".edit_user").show();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.user_key").text();
        var fullname = $thisTr.find("input.user_full_name").val();
        var username = $thisTr.find("td.user_name").text();
        var email = $thisTr.find("input.user_email").val();
        var $cb = $thisTr.find("input.user_active");
        var active = "";
        if ($cb.prop('checked') == true) {
            active = "да";
        }

        // post the new values to the server
        $.post("/object_update/", {
            object_type: "user",
            key: key,
            fullname: fullname,
            email: email,
            active: active
        }, function () {
            // update the table
            var $newTr = $("#users_table").find(".user_template").clone(true, true);
            $newTr.find("td.user_key").text(key);
            $newTr.find("td.user_full_name").text(fullname);
            $newTr.find("td.user_name").text(username);
            $newTr.find("td.user_email").text(email);
            $newTr.find("td.user_active").text(active);    
            $newTr.removeAttr("style").removeAttr("class");
            $newTr.insertAfter($thisTr);
            $thisTr.remove();
        }).fail(function () {
            alert("Не удалось обновить объект.")
        })
    });

    //
    //
    //
    // Projects Tab
    //
    //
    //

    //
    // add project
    $("#add_project").click(function (e) {
        e.preventDefault();
        var $thisTr = $(this).parent().parent();
        project_name = $("#new_project_name").val();
        if (!project_name || project_name === "") {
            alert("Имя проекта не может быть пустым!");
            return;
        }
        $.post("/object_add/", {object_type: "project", name: project_name}, function (data) {
            var $newTr = $("#allprojects_table").find(".project_template").clone(true, true);
            $newTr.find("td.allproject_key").text(data);
            $newTr.find("td.allproject_name").text(project_name);
            $newTr.removeAttr("style").removeAttr("class");
            $newTr.prependTo("#allprojects_table tbody");
            
            var $newAccountTr = $("#account_container").find(".project_template").clone(true, true);
            $newAccountTr.find("td.project_key").text(data);
            $newAccountTr.find("td.project_name").text(project_name);
            $newAccountTr.removeAttr("style").attr("class", "project");
            $newAccountTr.prependTo("#projects_table tbody#account_projects");

            $("#new_project_name").val("");
        }).fail(function () {
            alert("Не удалось добавить проект.")
        });

    });

    //
    // edit project
    $("#allprojects_table").find(".edit_project").click(function (e) {
        e.preventDefault();
        $(".edit_project").hide();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.allproject_key").text();
        var name = $thisTr.find("td.allproject_name").text();

        // prepare the input form
        var $form = $("#allprojects_table").find(".project_edit").clone(true, true);
        $form.find("td.allproject_key").text(key);
        $form.find("input.allproject_name").val(name);
        $form.find("#assigned_user_name").val(name);
        $form.removeAttr("style").removeClass("project_edit");

        // insert the form instead of the object
        $form.insertAfter($thisTr);
        $thisTr.remove();
        // save old values for "cancel" action
        $("#old_projectname").html(name);
    });

    //assign project to user
    $('#assign_project_to_user').click(function (e) {
        e.preventDefault();
        var userName = $(this).siblings('input.assigned_user_name').val();
        var projectKey = $(this).parent().siblings("td.allproject_key").text();

        jQuery.ajax({
            url: '/add_user_project/?user_name=' + userName + '&project_key=' + projectKey,
            success: function (data) {
                if (data !== "True") {
                    alert("У пользователя уже есть этот проект.");
                }
                else {
                    alert('Успех!');
                }
            },
            async: false,
            type: "get"
        });
    });

    //
    // Cancel edit (PROJECT)
    $(".project_edit").find(".cancel_project_changes").click(function (e) {
        e.preventDefault();
        $(".edit_project").show();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.allproject_key").text();
        var name = $("#old_projectname").html();

        // set the old values back
        var $newTr = $("#allprojects_table").find(".project_template").clone(true, true);
        $newTr.find("td.allproject_key").text(key);
        $newTr.find("td.allproject_name").text(name);
        $newTr.removeAttr("style").removeAttr("class");
        $newTr.insertAfter($thisTr);
        $thisTr.remove();
    });

    //
    // Accept edit (PROJECT)
    $(".project_edit").find(".accept_project_changes").click(function (e) {
        e.preventDefault();
        $(".edit_project").show();
        var $thisTr = $(this).parent().parent();

        // get the values
        var key = $thisTr.find("td.allproject_key").text();
        var name = $thisTr.find("input.allproject_name").val();

        // post the new values to the server
        $.post("/object_update/", {
            object_type: "project",
            key: key,
            name: name
        }, function () {
            // update the table
            var $newTr = $("#allprojects_table").find(".project_template").clone(true, true);
            $newTr.find("td.allproject_key").text(key);
            $newTr.find("td.allproject_name").text(name);
            $newTr.removeAttr("style").removeAttr("class");
            $newTr.insertAfter($thisTr);
            $thisTr.remove();
        }).fail(function () {
            alert("Не удалось обновить объект.")
        })
    });

    // after everything is loaded, display the page
    $("#all_content").show();
});

//
//
//      Functions
//
//

function loadGame(link) {
    $("#game").load(link);
}

function saveNewPassword() {
    var oldPassword = $('#old_password_input').val();
    var newPassword = $('#new_password_input').val();
    var acceptPassword = $('#accept_password_input').val();
    var isOldPasswordCorrect;

    jQuery.ajax({
        url: '/check_user_password/?pass=' + oldPassword,
        success: function (data) {
            if (data != "True") {
                alert("Неверный старый пароль.");
                return;
            }
        },
        async: false,
        type: "get"
    });

    if (newPassword != acceptPassword) {
        alert("Новый пароль и подтверждение не совпадают.");
        return;
    }

    $.get("/update_curr_user_pass/", {pass: newPassword}, function (data) {
        $('#old_password_input').val("");
        $('#new_password_input').val("");
        $('#accept_password_input').val("");
    });
}

function cancelNewPassword() {
    $("#projects").trigger("click");
}

function displayAccount(elem) {
    $(".nav#main_menu > li").removeClass("active");
    $(".inner").hide();

    var thisTr = $(elem).parent();
    var key = thisTr.find("td.user_key").text();
    var email = thisTr.find("td.user_email").text();
    var active = thisTr.find("td.user_active").text();
    var name = thisTr.find("td.user_name").text();
    var fullname = thisTr.find("td.user_full_name").text();

    $("#account_container").show();

    $("#account_fullname_input").val(fullname);
    $("#account_name").text(name);
    $("#account_email_input").val(email);
    $("#account_active_input").prop('checked', active == "да");
    $.get("/get_user_password/", {"key": key}, function (data) {
        $("#account_password_input").val(data);
    });
    
    $("#account_container").find("tr.project").find("a.delete_user_project").attr("style", "display:none");
    $("#account_container").find("tr.project").find("a.assign_user_project").removeAttr("style");
    
    var userPr = $("#account_container").find("tr.project").filter(function(index, element) {
        var res = false;        
        var t = $(this).find("td.p_user_key").each(
            function() {
                var str = $(this).text();
                if (str.indexOf(key) !== -1) {
                    res = true;
                 }
                                               
            }); 
        return res;
    });
    userPr.find("a.delete_user_project").removeAttr("style");
    userPr.find("a.assign_user_project").attr("style", "display:none");

    $("#account_container").data("user_key", key);
    $("#account_container").data("user", thisTr);
}

function assignUserProject(elem) {
    var $projTr = $("#account_container");
    var username = $projTr.find("th#account_name").text();
    var project_key = $(elem).parent().find("td.project_key").text();
    var user_key = $("#account_container").data("user_key");
        
    jQuery.ajax({
        url: '/add_user_project/?user_name=' + username + '&project_key=' + project_key,
        success: function (data_) {
            if (data_ !== "True") {
                alert("У пользователя уже есть этот проект.");
            }
            else { 
                $(elem).parent().append('<td style="display:none" class="p_user_key">' + user_key + "</td>");
                $(elem).parent().find("a.assign_user_project").attr("style", "display:none");
                $(elem).parent().find("a.delete_user_project").removeAttr("style");
                $projTr.find("input.new_user_project_name").val("");
                //alert('Успех!');
            }
        },
        async: false,
        type: "get"
    });     
} 


function deleteUserProject(elem) {
    var $thisTr = $(elem).parent();

    // get the values
    var user_key = $("#account_container").data("user_key");
    var project_key = $thisTr.find("td.project_key").text();

    jQuery.ajax({
        url: '/delete_user_project/?user_key=' + user_key + '&project_key=' + project_key,
        success: function (data) {
            $thisTr.find("td.p_user_key").filter(function(index, elem) {
                var str = $(this).text();
                return str.indexOf(user_key) !== -1
            }).remove(); 
            $thisTr.find("a.delete_user_project").attr("style", "display:none");
            $thisTr.find("a.assign_user_project").removeAttr("style");
            //alert('Проект удалён!');
        },
        type: "get"
    });

}

function accountSave(elem) {
    var key = $("#account_container").data("user_key");
    var userTr = $("#account_container").data("user");
    var fullname = $("#account_fullname_input").val();
    var name = $("#account_name").text();
    var email = $('#account_email_input').val();
    var pass = $("#account_password_input").val();
    var active = "";
    if ($("#account_active_input").is(":checked")) {
        console.log("YES");
        active = "да";
    }

    $.post("/object_update/", {
        object_type: "user",
        key: key,
        fullname: fullname,
        email: email,
        active: active
    }, function () {
    }).fail(function () {
        alert("Не удалось обновить объект.")
    })

    $.post("/object_update/", {
        object_type: "password",
        key: key,
        pass: pass
    }).fail(function () {
        alert("Не удалось обновить пароль.")
    });

    userTr.find("td.user_full_name").text(fullname);
    userTr.find("td.user_email").text(email);
    userTr.find("td.user_active").text(active);
    alert("Изменения сохранены.");
    
    $("#account_container").hide();
    $("#users_container").show();
    $("#users").parent().addClass("active");
}