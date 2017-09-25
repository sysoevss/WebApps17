
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
        user_name = $("#new_user_name").val();
        user_email = $("#new_user_email").val();
        if (!user_name || user_name == "") {
            alert("Имя пользователя не может быть пустым!");
            return;
        }
        $.post("/object_add/", {object_type: "user", username: user_name, email: user_email}, function (data) {
            var $newTr = $("#users_table").find(".user_template").clone(true, true);
            $newTr.find("td.user_key").text(data);
            $newTr.find("td.user_name").text(user_name);
            $newTr.find("td.user_email").text(user_email);
            $newTr.removeAttr("style").removeAttr("class");
            $newTr.prependTo("#users_table tbody");
            
            $("#new_user_name").val("");
            $("#new_user_email").val("");
        }).fail(function () {alert("Пользователь уже зарегистрирован.")});
        
    });

    //
    // edit user
    $("#users_table").find(".edit_user").click(function (e) {
        e.preventDefault();
        $(".edit_user").hide();
        var $thisTr = $(this).parent().parent();
        
        // get the values
        var key = $thisTr.find("td.user_key").text();
        var username = $thisTr.find("td.user_name").text();
        var email = $thisTr.find("td.user_email").text();
        var active = $thisTr.find("td.user_active").text();
        
        // prepare the input form
        var $form = $("#users_table").find(".user_edit").clone(true,true);
        $form.find("td.user_key").text(key);
		$form.find("td.user_name").text(username);
		$form.find("input.user_email").val(email);
		var $cb = $form.find("input.user_active");
        if (active == "да") {
            $cb.prop('checked', true);
        } else {
            $cb.prop('checked', false);
        }
		$form.removeAttr("style").removeClass("client_edit");
        
        // insert the form instead of the object
        $form.insertAfter($thisTr);
        $thisTr.remove();
        // save old values for "cancel" action
        $("#old_email").html(email);
        $("#old_active").html(active);
    });

    //
    // Cancel edit (USER)
    $(".user_edit").find(".cancel_user_changes").click(function (e) {
        e.preventDefault();
        $(".edit_user").show();
        var $thisTr = $(this).parent().parent();
        
        // get the values
        var key = $thisTr.find("td.user_key").text();
        var username = $thisTr.find("td.user_name").text();
        var email = $("#old_email").html();
        var active = $("#old_active").html();
        
        // set the old values back
        var $newTr = $("#users_table").find(".user_template").clone(true, true);
        $newTr.find("td.user_key").text(key);
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
            email: email,
            active: active
        }, function () {
            // update the table
            var $newTr = $("#users_table").find(".user_template").clone(true, true);
            $newTr.find("td.user_key").text(key);
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

    // after everything is loaded, display the page
    $("#all_content").show();
});

//
//
//      Functions
//
//

function loadGame(link){
	$("#game").load(link);
}