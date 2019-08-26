var $ = jQuery = require("jquery");
require("../node_modules/bootstrap-sass/assets/javascripts/bootstrap/affix.js");
require("../node_modules/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js");


$(document).ready(function() {

    //get the latest hosted version
    if ($("#cdnDownload").length > 0) {
        var name = "yashe";
        //only draw when we've got some place to print this info (might not be on all pages where we include this js file)
        $.get("https://data.jsdelivr.com/v1/package/npm/" + name, function(data) {
        var version = data.tags.latest;
        if (version) {
            $("#" + name + "Css").text(
            "<link href='//cdn.jsdelivr.net/npm/" +
                name +
                "@" +
                version +
                "/dist/" +
                name +
                ".min.css' rel='stylesheet' type='text/css'/>"
            );
            $("#" + name + "JsBundled").text(
            "<script src='//cdn.jsdelivr.net/npm/" + name + "@" + version + "/dist/" + name + ".bundled.min.js'></script" + ">"
            );

        } else {
            console.log("failed accessing jsdelivr api");
            $("#cdnDownload").hide();
        }
        }).fail(function() {
        console.log("failed accessing jsdelivr api");
        $("#cdnDownload").hide();
        });
    }


    //get the ShEx examples
    var rdfBookEx,wikiEx,japanEx
    var exSelector = document.getElementById('exSelector')

    //Parse Shapes
    $.get('./doc/examples/rdfBookEx.txt', function(data) {
        rdfBookEx = data
    }, 'text');

    $.get('./doc/examples/wikidataEx.txt', function(data) {
        wikiEx = data
    }, 'text');

    $.get('./doc/examples/japanEx.txt', function(data) {
        japanEx = data
    }, 'text');


    //Examples Listener
    exSelector.addEventListener('change', function(e) {

        switch(exSelector.value){

            case "rdf":
                yashe.setValue(rdfBookEx)
                break

            case "wiki":
                yashe.setValue(wikiEx)
                break

            case "japan":
                yashe.setValue(japanEx)
                break

        }
        
    })


});
