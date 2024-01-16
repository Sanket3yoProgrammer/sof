(function ($) {


  // Add zeroes to if no present
  function checkDigits(element, dNum) {
    dCount = element.val().length;
    if (dCount > 0) {
        if (dCount < dNum) {
            curVal = element.val();
            for (var i=0; i<dNum-dCount; i++) {
                curVal = '0'+curVal;
            }
            element.val(curVal);
        }
    }
  }

    // Add zeroes to if no present
  function checkLetters(element, dNum) {
    var letter = element.val();
    element.val(letter.toUpperCase());
  }

  // Add Prepare letters
  function digitCount(element, dCount) {
    if($('#'+element).val().length > dCount)
    $('#'+element).val($('#'+element).val().substr(0, dCount));
  }

  // Check if letter
  function isLetter(str) {
    return str.match(/[a-zA-Z]/i);
  }

  // Action, hide or show section block
  function rs_display_selected_olympiad_section_trigger(op){
    
    // 1 - show
    // 0 - hide


    if (op == 1) {
      $("#edit-rollid3, #rollspan4").show().addClass('showed').removeClass('hidden');
    } 
    else {
      $("#edit-rollid3, #rollspan4").hide().addClass('hidden').removeClass('showed');
    }
  }


  // Action, Check last digits.
  function rs_display_selected_olympiad_check_digits(olympiad){
    var digits = rs_proccess_olympiad_last_digits(olympiad);

    var placeholder = '';

    for (var i = digits - 1; i >= 0; i--) {
      placeholder = placeholder + '-';
    }

    $("#edit-rollid4").attr('maxlength', digits).attr('size', digits).attr('placeholder', placeholder);
  }

  // 
  // Logic to show or hide section input block
  function rs_proccess_olympiad_section_input_block(olympiad){
      var display = Drupal.settings.result_cards.rs_section_marks[olympiad];

       rs_display_selected_olympiad_section_trigger(display);
       rs_display_selected_olympiad_check_digits(olympiad);
  }

  // Logic to show or hide section input block
  function rs_proccess_olympiad_last_digits(olympiad){
      var digits = Drupal.settings.rollno_form.last_digits[olympiad];

      return digits;
  }

  // 
  // Hide rollno fields if needed
  function rs_proccess_olympiad_hide_rollno_blocks(olympiad){

      var message = Drupal.settings.rollno_form.block_messages[olympiad];

      if (message != null && message.length > 0){
        $("#rollno_section_block").hide();
        $("#rollno_section_block_message").text(message);
      } else {
        $("#rollno_section_block").show();
        $("#rollno_section_block_message").text('');
      }
  }


 // Auto open on Results card pdf link
  Drupal.behaviors.ResultsCardsPopUp = {
    attach: function (context, settings) {

      // Get default selected olympiad.
      var olympiad = $("#edit-olympiad-selected");

      $("#edit-rollid2").blur(function() {
        checkDigits($(this), 2);
      });

      $("#edit-rollid3").blur(function() {
        checkLetters($(this), 1);
      });

      $("#edit-rollid4").blur(function() {

        // if (olympiad.length > 0) {
        //   var digits = rs_proccess_olympiad_last_digits(olympiad.val());
        //   checkDigits($(this), digits);
        // } else {
        //   checkDigits($(this), 3);
        // }
        
      });

      
      // Set state of the section block.
      if (olympiad.length > 0) {
        rs_proccess_olympiad_section_input_block(olympiad.val());
      }

      $("#edit-rollid2, #edit-rollid4").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
       });

      $("#edit-rollid3").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }

        // Ensure that it is a number and stop the keypress
        if (isLetter(e.key) == null) {
            e.preventDefault();
        }
       });


      // Check if we need to show section box on newly selected olympiad.
      // --------------------------
      $("#ac-result-cards-enter-rollid-form").delegate( "#edit-olympiad-selected", "change", function(event) {
        rs_proccess_olympiad_section_input_block($("#edit-olympiad-selected").val());
      });


      // Process main button action
      // --------------------------
      $("#ac-result-cards-enter-rollid-form").delegate( "#edit-submit-download-pdf,#edit-submit-view-results", "click", function(event) {
	
        var go = true;

        $("#edit-rollid1, #edit-rollid2, #edit-rollid3.showed, #edit-rollid4").each(function(){
          if($(this).val() === ''){
            go = false;
          }
        });
        if(!go){
          alert('Please enter full Roll Number');
          event.preventDefault();
        }else{
	
          var roll_no_generated = $("#edit-rollid1").val() + '-' + $("#edit-submit-download-pdf,#edit-submit-view-results").val() + '-' + $("#edit-rollid4").val();
          var olympiad_selected = $("#edit-olympiad-selected").val();

          ga('send', 'event', 'ResultsCards-' + olympiad_selected, 'download', roll_no_generated + '.pdf', '1');
          $("#edit-description h2").text('Enter Your Roll No');
        }
      });

    }
  };

  // Check Olympaids for Blocking
  Drupal.behaviors.ResultsCardsRollnoBlock = {
    attach: function (context, settings) {

      // Default run.
      rs_proccess_olympiad_hide_rollno_blocks($("#edit-olympiad-selected").val());

      // Check show or not olympiad block.
      // --------------------------
      $("#ac-result-cards-enter-rollid-form").delegate( "#edit-olympiad-selected", "change", function(event) {
        rs_proccess_olympiad_hide_rollno_blocks($("#edit-olympiad-selected").val());
      });

    }
  };


  // Confirm box on bulkdelete
  Drupal.behaviors.ResultsCards = {
    attach: function (context, settings) {

    	var result = false;

    	$("#result-cards-bulkdelete-form, #result-cards-bulkupdate-form" ).delegate( ".custom_action", "click", function(event) {
    		if(!result){
    		event.preventDefault();
  			result = confirm("Please, Confirm the action of Result cards");

  			if(result){
  				$(this).trigger('click');
  			}

  		  }
		});
    }
  };

})(jQuery);

