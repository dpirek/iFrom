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

      var isIe = ($.browser.msie || false),
          isFf = ($.browser.mozilla || false);

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

          // Put form into iframe page.
          var appendForm = function(){
            iDoc.body.appendChild(iForm);
          };

          var removeIframe = function(){
            iframe.remove();
          };

          // Submit Form.
          var submitForm = function () {

            // Submit form.
            iForm.submit();

            // Callback.
            iF.onload = function () {
              
              // Remove disabled state.
              submitButton.removeClass(defaults.disabledButtonClass).removeAttr('disabled');

              // FF needs delay.
              if(isFf) {
                var t3 = setTimeout(removeIframe, 10);
              }

              // Run callback.
              defaults.sucess(submitButton);
            };
          };

          // IE needs delay.
          if(isIe){
            var t = setTimeout(appendForm, 5);
            var t2 = setTimeout(submitForm, 10);
          } else {
            appendForm();
            submitForm();
          }

          return false;
        });
      });
    };
  } (jQuery));