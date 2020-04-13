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
    var gistContainer = $("#gistContainer");
    if (gistContainer.length > 0) {
      $.get("https://api.github.com/users/mistermboy/gists", function(data) {
        var processLabel = function(origLabel) {
          var label = origLabel.replace("#YASHE", "YASHE");
          var splitted = label.split(" ");
          if (splitted.length > 0) {
            if ((splitted[0].indexOf("YASHE") == 0 || splitted[0].indexOf("YASR") == 0) && splitted[0].slice(-1) == ":") {
              //we want to change "#YASQE: some gist" into "some gist". So, remove the first item
              return splitted.splice(1).join(" ");
            } else {
              return splitted.join(" ");
            }
          } else {
            return label;
          }
        };
        data.forEach(function(gist) {
          if (gist.description.indexOf("#YASHE") >= 0) {
            var gistDiv = $("<div>").addClass("gist").addClass("well").appendTo(gistContainer);
            $("<h4>").text(processLabel(gist.description)).appendTo(gistDiv);
            var description = $("<p>").appendTo(gistDiv);
            $.get(gist.url, function(gistFile) {
              description.text(gistFile.files["YASHE.md"].content);
            });
            var buttonContainer = $("<p>").appendTo(gistDiv);
            $(
              "<a style='margin-left: 4px;' target='_blank' class='btn btn-default btn-sm' href='#' role='button'>Code <img class='pull-right gistIcon' src='imgs/blacktocat_black.png'></a>"
            )
              .attr("href", gist["html_url"])
              .appendTo(buttonContainer);
          $(
              "<a style='margin-left: 4px;' target='_blank' class='btn btn-default btn-sm' href='#' role='button'>CodePen Example <img class='pull-right gistIcon' src='imgs/codepen.png'></a>"
            )
              .attr("href", 'https://codepen.io/mistermboy/pen/XWJpqdY')
              .appendTo(buttonContainer);
          }
        });
      });
    }

    //Add all the RDF Book examples to the selector   
    var url = "https://api.github.com/repos/weso/YASHE/contents/doc/examples/validatingRdfData";
    var rdfBookSelector = $('#rdfBookSelector');
    $.ajax({
      dataType: "json",
      url: url,
      success: function (data) {
        data.forEach(function(element){
          if(element.name != 'wiki' && element.name != 'rdf' && element.name != 'japan'){
                rdfBookSelector.append(
                  $( '<option>' ).text( element.name.replace(/-/g,' ') ).attr( 'value', element.name));
              }
        })
      }
    });
       
    //RDF BOOK Selector Listener
    rdfBookSelector.change(function(e) {
        var selected =  $('#rdfBookSelector option:selected').val();
        setExample('validatingRdfData',selected);
        $('#othersSelector').val('');
        $('#wikiSelector').val('');
    });


    //Add all the Wikidata examples to the selector  
     var schemas = [];
    var wikiSelector = $('#wikiSelector');
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://www.wikidata.org/w/api.php?action=query&list=allpages&apnamespace=640&aplimit=max&format=json",
      "method": "GET",
      "dataType":"jsonp"
      }

    $.ajax(settings).done(function (response) {
      var pages = response.query.allpages;
      Object.keys(pages).forEach(function(page){
        var schema={};
        schema.pageid = pages[page].pageid;
        settings.url="https://www.wikidata.org/w/api.php?action=query&pageids="+schema.pageid+"&prop=pageprops&format=json",

        $.ajax(settings).done(function (response) {
          var data = response.query.pages[schema.pageid].pageprops.displaytitle;
          var idSplit=data.split('entityschema-title-id">')[1].split('</span>')[0];
          var nameSplit=data.split('entityschema-title-label">');

          schema.id=idSplit.substring(1,idSplit.length-1);
          if(nameSplit.length>1){
            schema.name=nameSplit[1].split('</span>')[0];
          }

          schema.conceptUri = 'https://www.wikidata.org/wiki/Special:EntitySchemaText/'+schema.id;
          $.get(schema.conceptUri, function(data) {
              schema.value=data;
              schemas.push(schema);
              wikiSelector.append(
                $( '<option>' ).text( schema.id+" "+schema.name ).attr( 'value', schema.id));
          }, 'text');
        
        });
      })
    });


    //Wikidata Selector Listener
    wikiSelector.change(function(e) {
        var selected =  $('#wikiSelector option:selected').val();
        var schema = schemas.filter(function(s){
          return s.id === selected
        })
        if(schema)yashe.setValue(schema[0].value);
    });


    //Others Examples Selector Listener
    var othersSelector = $('#othersSelector');
    othersSelector.change(function(e) {
        var selected =  $('#othersSelector option:selected').val();
        setExample('others',selected);
        $('#rdfBookSelector').val('');
        $('#wikiSelector').val('');
    });



    function setExample(folder,selected){
      $.get('./doc/examples/'+folder+'/'+selected, function(data) {
            yashe.setValue(data);
        }, 'text');
    }




});
