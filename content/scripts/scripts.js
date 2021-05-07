Handlebars.registerHelper('changeCheck', function(property) {
    if(parseFloat(property) < 0){
        string = "<div class=\"negative\">" + property + "</div>";
    }

    else if(parseFloat(property) > 0){
        string = "<div class=\"positive\">" + property + "</div>";
    }
    
    else{
        "<div>" + parseFloat(property) + "</div>";
    }

    return new Handlebars.SafeString(string); // mark as already escaped
});