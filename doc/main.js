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
    var rdfShape,wikiShape,japanShape
    
    var btnRDF = document.getElementById('btnRDF')
    var btnWiki = document.getElementById('btnWiki')
    var btnJapan = document.getElementById('btnJapan')


    var themeSlider = document.getElementById('themeSlider')


    //Parse Shapes
    $.get('./doc/shapes/rdfBookShape.txt', function(data) {
        rdfShape = data
    }, 'text');

    $.get('./doc/shapes/wikidataShape.txt', function(data) {
        wikiShape = data
    }, 'text');

    $.get('./doc/shapes/jps.txt', function(data) {
        japanShape = data
    }, 'text');


    //Examples Listeners
    btnRDF.addEventListener('click', function(e) { yashe.setValue(rdfShape)})
    btnWiki.addEventListener('click', function(e) { yashe.setValue(wikiShape)})
    btnJapan.addEventListener('click', function(e) { yashe.setValue(japanShape)})


    //Theme Listener
    themeSlider.addEventListener('change', function(e) {
        
        if(this.checked) {
            yashe.setOption("theme","dark")
        } else {
            yashe.setOption("theme","wiki")
        }
        yashe.drawButtons()
    })


});

