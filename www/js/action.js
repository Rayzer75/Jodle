$("document").ready(function () {

    var socket = null;
  
    var user;
    
$('#list_contact').click(function() {
    $.ajax({
        
    url :'api/user/contacts/' + telephone,
    type : 'GET',
    dataType : 'json',
    success : function(data,status){
        
    }
    
    });
});    



})