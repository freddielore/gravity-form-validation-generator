jQuery(document).ready(function($){
	$('.add-another').live('click', function(){
		var count = ( $('.gform_fields .last').attr('rel') * 1 + 1);
		var html = '<div class="gform_field highlight last" id="gform_field_' + count + '" rel="' + count + '"> \
						<div class="form-group"> \
							<label class="sr-only" for="field-id-' + count + '">Input field ID (e.g. input_3_1),</label> \
							<input type="text" class="form-control" id="field-id-' + count + '" placeholder="Input field ID (e.g. input_3_1),"> \
						</div> \
						<div class="form-group"> \
							<label class="sr-only" for="field-name-' + count + '">Input field name (e.g. Email)</label> \
							<input type="text" class="form-control" id="field-name-' + count + '" placeholder="Input field name (e.g. Email)"> \
						</div> \
						<button type="submit" class="btn btn-default add-another pull-right" id="field-add-' + count + '">Add Another</button> \
					</div>';
		$('.gform_fields .last').after(html);
		
		$('.gform_fields .gform_field').removeClass('highlight');
		$('.gform_fields .gform_field').removeClass('last');
		$('.gform_fields .gform_field:last').addClass('highlight last');
		$(this).remove();
		
		mouseoverReset();
		
		return false;
	});
	
	$('.generate-script').click(function(){
		var cont = true;
		$('form input[type="text"]').each(function(){
			if( $(this).val() == '' ){  
				$(this).addClass('error');
				$(this).val('This is required');
				cont = false;
			}
		});
		
		if( cont ){ generate(); } 
		return false;
	});
	
	mouseoverReset();
	function mouseoverReset(){
		$('form input[type="text"]').each(function(){
			$(this).mouseover(function(){
				if( $(this).hasClass('error') ){
					$(this).removeClass('error');
					$(this).val('');
				}
			});
		});
	}
	
	function generate(){
		
		var output = '&lt;script type="text\/javascript"&gt; \n\n';
		
		output += 'jQuery(document).ready(function($){';
		
		var form_id = $('.gform_metas #form-id').val();
		var form_name = $('.gform_metas #form-name').val();
		var total = $('.gform_fields .gform_field').length;
		var f_ids = [];
		var f_names = [];
		var condition = '';
		var hovers = '';
		
		for ( var i=1;i<=total;i++ ){ 
			f_ids.push( $( '#field-id-' + i ).val() );	
			f_names.push( $( '#field-name-' + i ).val().toLowerCase() );	
		}
		
		output += $('.defaults').html();
		output += '\n\n';
		output += '/** START: ' + form_name + ' Form Validation */ \n\n $("#' + form_id + ' .gform_button, #' + form_id + ' .gform_image_button").on("click", function(){ \n\n'
		
		for( var c=0; c<total; c++){
			output += 'var ' + f_names[c] + ' = $("#' + f_ids[c] + '").val();\n';
			
			if( f_names[c] != 'email' ){
				condition += 'if ( (' + f_names[c] + ' == "") || (' + f_names[c] + ' == $("#' + f_ids[c] + '").attr("placeholder") ) ){  \n $("#' + f_ids[c] + '").addClass("error"); \n $("#' + f_ids[c] + '").val("This field is required"); \n proceed = false; \n }';
				hovers += '$("#' + f_ids[c] + '").mouseover(function(){ \n \
								if( $(this).hasClass("error") ){ \n \
									$(this).removeClass("error"); \n \
									if (ieversion<=9){ \n \
										$(this).val( $(this).attr("placeholder") ); \n \
									} \n \
									else{ \n \
						                $(this).val(""); \n \
						            } \n \
								} \n \
							});';	

			}
			else{
				condition += 'if ( (' + f_names[c] + '=="") || !isValidEmailAddress(' + f_names[c] + ') ){ \n od_email = $("#' + f_ids[c] + '").val(); \n ';
				condition += '$("#' + f_ids[c] + '").addClass("error"); \n $("#' + f_ids[c] + '").val("Invalid email"); \n proceed = false; \n }';
				
				hovers += '$("#' + f_ids[c] + '").mouseover(function(){ \n \
								if( $(this).hasClass("error") ){ \n \
									$(this).removeClass("error"); \n \
									if (ieversion<=9){ \n \
										$(this).val( $(this).attr("placeholder") ); \n \
									} \n \
									else{ \n \
						                $(this).val(""); \n \
						            } \n \
								} \n \
							});';
			}
		}
		
		output += 'var od_email = "";\n';
		output += 'var proceed = true;\n\n';
		
		output += condition + '\n\n';
		
		output += 'return proceed; \n';
		
		
		output += '\n\n});\n\n';
		
		output += hovers + '\n\n';
		
		output += '/** END: ' + form_name + ' form validation */ \n\n';
		output += '\n\n});';
		output += '&lt;\/script&gt;';
		
		$('.output pre').html( output );
		$.SyntaxHighlighter.init({ 'wrapLines':false });
	}
	
	
});