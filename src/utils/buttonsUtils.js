var imgs = require("./imgs.js"),
    yutils = require("yasgui-utils"),
    utils = require("./baseUtils.js"),
    $ = require("jquery"),
    Codemirror = require('codemirror');

var drawButtons = function(yashe){

    yashe.buttons = $("<div class='yashe_buttons'></div>").appendTo($(yashe.getWrapperElement()));
 

    /**
     * upload button
     */
    var uploadButton = $("<div>", {
      class: "downloadBtns"
    }).append($('<input type="file" accept=".shex" name="file-1[]" id="file-1" class="inputfileBtn" data-multiple-caption="{count}'
    +'files selected" multiple /><label id="uploadBntLabel" for="file-1">'+imgs.upload+'</label>')
    .addClass("yashe_uploadBtn")
    .attr("title", "Upload your ShEx file")
    .on('change',()=>{utils.readFile(yashe)}));
   
    /**
     * download button
     */
  
    var downloadButton = $("<div>", {
      class: "downloadBtns"
    })
      .append(
        $(yutils.svg.getElement(imgs.download))
          .addClass("yashe_downloadBtn")
          .attr("title", "Download File")
          .attr("id", "downloadBtn")
          .click(function() {          
            var textFileAsBlob = new Blob([ yashe.getValue() ], { type: 'text/shex' });
            var fileNameToSaveAs = "document.shex";
  
            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.URL != null) {
              // Chrome allows the link to be clicked without actually adding it to the DOM.
              downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            } else {
              // Firefox requires the link to be added to the DOM before it can be clicked.
              downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
              downloadLink.onclick = destroyClickedElement;
              downloadLink.style.display = "none";
              document.body.appendChild(downloadLink);
            }
            downloadLink.click();
            Codemirror.signal(yashe,'download');
          })
      );
    
    /**
     * copy button
     */
  
    var copyButton = $("<div>", {
      class: "downloadBtns"
    })
      .append(
        $(yutils.svg.getElement(imgs.copy))
          .addClass("yashe_downloadBtn")
          .attr("id", "copyBtn")
          .attr("title", "Copy to the clipboard")
          .click(function() { 
              Codemirror.signal(yashe,'copy');
          }))

   
    /**
     * delete button
     */
    var deleteButton = $("<div>", {
      class: "downloadBtns"
    }).append($(yutils.svg.getElement(imgs.delete))
    .addClass("yashe_deletedBtn")
    .attr('id','deleteBtn')
    .attr("title", "Delete content")
    .click(function() { 
              yashe.setValue("")
              Codemirror.signal(yashe,'delete');
          }));


    /**
     * theme button
     */
    var themeButton = $("<div>", {
      class: "downloadBtns"
    }).append($(yutils.svg.getElement(imgs.theme))
    .addClass("yashe_themeBtn")
    .attr('id','themeBtn')
    .attr("title", 'Change the theme')
    .click(function() { 
      
      var themeValue = 'wiki'
      var color = 'black'
      if(yashe.getOption('theme') == 'wiki'){
        themeValue='dark'
        color = 'white'
      }
      

      yashe.setOption("theme",themeValue)

      //Change fill of buttons
      $('#uploadBntLabel').css('fill', color)
      $('#downloadBtn').css('fill', color)
      $('#copyBtn').css('fill', color)
      $('#deleteBtn').css('fill', color)
      $('#themeBtn').css('fill', color)
      $('#fullBtn').css('fill', color)
      $('#smallBtn').css('fill', color)
 
      Codemirror.signal(yashe,'themeChange');
    }))




    /**
       * fullscreen button   
    */
    var toggleFullscreen = $("<div>", {
      class: "fullscreenToggleBtns"
    })
      .append(
        $(yutils.svg.getElement(imgs.fullscreen))
          .addClass("yashe_fullscreenBtn")
          .attr("title", "Set editor full screen")
          .attr("id", "fullBtn")
          .click(function() {
            yashe.setOption("fullScreen", true);
            Codemirror.signal(yashe,'expandScreen');
          })
      )
      .append(
        $(yutils.svg.getElement(imgs.smallscreen))
          .addClass("yashe_smallscreenBtn")
          .attr("title", "Set editor to normal size")
          .attr("id", "smallBtn")
          .click(function() {
            yashe.setOption("fullScreen", false);
            Codemirror.signal(yashe,'colapseScreen');
          })
      );
 
  

    //Draw buttons
    if(yashe.options.uploadButton){
      yashe.buttons.append(uploadButton);
    }

    if(yashe.options.downloadButton){
      yashe.buttons.append(downloadButton);
    }

    if(yashe.options.copyButton){
      yashe.buttons.append(copyButton);
    }

    if(yashe.options.deleteButton){
      yashe.buttons.append(deleteButton);
    }

    if(yashe.options.themeButton){
      yashe.buttons.append(themeButton);
    }

    if(yashe.options.toggleFullscreen){
      yashe.buttons.append(toggleFullscreen);
    }
    

  }



module.exports = {
    drawButtons:drawButtons
}