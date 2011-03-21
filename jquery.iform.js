(function ($) {
    
  // Element factory.
  var createElement = function (context, name, atributes) {
  
    // Create element.
    var element = context.createElement(name);
  
    // Add atributes.
    $.each(atributes, function (i, d) {
      element[d.key] = d.value;
    });
    return element;
  };
  
  $.fn.iForm = function (op) {
    
    // Defaults.
    var defaults = {
      start: function () { },
      sucess: function () { },
      buttonSelector: '.button',
      disabledButtonClass: 'disabled'
    };
  
    $.extend(defaults, op);
  
    return this.each(function () {
  
      // Local vars.
      var form = $(this),
          postUrl = form.attr('action'),
          postMethod = form.attr('method'),
          submitButton = $(defaults.buttonSelector, form);
  
      // Submit button click.
      submitButton.click(function () {
        
        // 'On start'
        defaults.start(submitButton);
  
        // Do nothing if button is disabled.
        if(submitButton.hasClass(defaults.disabledButtonClass) || submitButton.attr('disabled') === 'disabled'){
          return false;
        }
  
        // Disable button.
        submitButton.addClass(defaults.disabledButtonClass).attr('disabled', 'disabled'); 
  
        // Create iframe.
        var iframe = $('<iframe style="display:none;"></iframe>');
  
        form.after(iframe);
  
        // Serilize form.
        var formData = form.serializeArray();
  
        // Local shortcuts.
        var iF = iframe[0],
            iWindow = iF.contentWindow,
            iDoc = iWindow.document,
            iBody = iDoc.body;
  
        // Create form.
        var iForm = createElement(iDoc, 'form',
          [
            { key: 'action', value: postUrl },
            { key: 'method', value: postMethod }
          ]);
  
        // Create form fields.
        $.each(formData, function (i, d) {
          var input = createElement(iDoc, 'input',
            [
              { key: 'name', value: d.name },
              { key: 'value', value: d.value }
            ]);
          iForm.appendChild(input);
        });
  
        // IE needs delay.
        var t = setTimeout(function () {
          // Put form into iframe page.
          iDoc.body.appendChild(iForm);
        }, 5);
  
        // IE needs delay.
        var t2 = setTimeout(function () {
  
          // Submit form.
          iForm.submit();
  
          // Callback.
          iF.onload = function () {
  
            submitButton.removeClass(defaults.disabledButtonClass).removeAttr('disabled');
  
            // FF needs delay.
            var t = setTimeout(function () {
              iframe.remove();
            }, 10);
  
            // Run callback.
            defaults.sucess(submitButton);
          };
        }, 10);
        return false;
      });
    });
  };
} (jQuery));