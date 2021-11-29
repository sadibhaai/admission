function ValidatePhoto(fileInputId, maximumKB, requiredHeight, requiredWidth){
        
    // debugger;
    var fileName = $("#"+ fileInputId +"").val();

    var title = $("#"+ fileInputId +"").attr("title");

    if(fileName =='')
    {
        alert( title + " required.");
        return false;
    }

    var fileInput = $("#"+ fileInputId + "")[0];
    var selectedFile = fileInput.files[0];
    
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpeg|.jpg)$/;

    var arrFileName = fileName.split("\\");

    var fileNameee = arrFileName[arrFileName.length-1]; 
    //fileNameSpan.html(arrFileName[arrFileName.length-1]);

    //check whether it is .jpeg or .jpg ---->
    if (!regex.test(fileName.toLowerCase())) {
        alert( title + " invalid. Please select a .jpg file.");
        return false;
    }
    //<---- check whether it is .jpeg or .jpg

    var fileSizeInByte = selectedFile.size;
    var Units = new Array('Bytes', 'KB', 'MB', 'GB');
    var unitPosition = 0;
    while (fileSizeInByte > 900) {
        fileSizeInByte /= 1024; unitPosition++;
    }

    var finalSize = (Math.round(fileSizeInByte * 100) / 100);
    var finalUnitName = Units[unitPosition];

    var fileSizeAndUnit = finalSize + ' ' + finalUnitName;

    //Check file size ----->
    if (finalUnitName != 'KB') {
        alert( title + " size is too large. Maximum size is 100 kilobytes.");
        return false;
    }
    else{
        if(finalSize > maximumKB){ 
            alert( title + " size is too large. Maximum size is 100 kilobytes.");
            return false;
        }
    }

    /*Checks whether the browser supports HTML5*/
    if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();
        //Read the contents of Image File.
        reader.readAsDataURL(fileInput.files[0]);

        reader.onload = function (e) {
            //Initiate the JavaScript Image object.
            var image = new Image();
            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
           
            image.onload = function () {  
                if (this.width != requiredWidth) {
                    alert( title + " width invalid. Width must be " + requiredWidth + " pixel.");
                   return false;
                }                 
                if (this.height != requiredHeight) {
                    alert( title + " height invalid. Height must be "+ requiredHeight  + " pixel.");
                    return false;
                }
            };
        }
    }

    return true;
}

function doConvert (numberInput){
    // let numberInput = document.querySelector('#numberInput').value ;
    // let myDiv = document.querySelector('#result');

    let oneToTwenty = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ',
    'eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    let tenth = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    if(numberInput.toString().length > 7) return myDiv.innerHTML = 'overlimit' ;
    console.log(numberInput);
    //let num = ('0000000000'+ numberInput).slice(-10).match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  let num = ('0000000'+ numberInput).slice(-7).match(/^(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
    console.log(num);
    if(!num) return;

    let outputText = num[1] != 0 ? (oneToTwenty[Number(num[1])] || `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}` )+' million ' : ''; 
  
    outputText +=num[2] != 0 ? (oneToTwenty[Number(num[2])] || `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}` )+'hundred ' : ''; 
    outputText +=num[3] != 0 ? (oneToTwenty[Number(num[3])] || `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`)+' thousand ' : ''; 
    outputText +=num[4] != 0 ? (oneToTwenty[Number(num[4])] || `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) +'hundred ': ''; 
    outputText +=num[5] != 0 ? (oneToTwenty[Number(num[5])] || `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `) : ''; 

    return outputText;
}

$( document ).ready(function() {

    $('.overlayButton').click(function(){
        $(this).hide();
        $(this).closest('.overlay').css("display", "none");
    });

    $('select[name="class"]').change(function(){
        let selectedClassId = $(this).val();
        if(selectedClassId == 9){
            $('select[name="group"]').closest('.field').show();
        }
        else{
            $('select[name="group"]').closest('.field').hide();
        }

        //prevSchoolDetails
        if(selectedClassId == 1 || selectedClassId == 101){
            $('#prevSchoolDetails').hide();
        }
        else{
            $('#prevSchoolDetails').show();
        }

        let classSixCheckbox = $('input.quotas[type="checkbox"][value="GOV"]');
        if(selectedClassId == 6){
            classSixCheckbox.removeAttr("disabled", "disabled").prop('checked', false);
            classSixCheckbox.closest("label").css("text-decoration", "none");
        }
        else{
            classSixCheckbox.attr("disabled", "disabled").prop('checked', false);
            classSixCheckbox.closest("label").css("text-decoration", "line-through");
        }
    });

    SwiftNumeric.prepare('.integer');


    $("select[name='division']").change(function(e){
        let selectedValue = e.target.value;
        let comboBox = $(this);
        comboBox.attr("disabled","disabled");
        let formData = new FormData();
        formData.append('code', selectedValue);

        let distCombo = $('select[name="district"]');
        $(distCombo).empty().change().append('<option>loading...</option>');

      
        $.ajax({
            url:baseUrl + '/school/profile/div-dist-thana.php?require=dist',
            method: 'POST',
            data: formData,
            contentType : false,
            processData : false,
            beforeSend: function(){
            },
            success: function(response){
                comboBox.removeAttr("disabled");
                let districts =  JSON.parse(response.data);
                distCombo.empty().append('<option value="" selected>select</option>');
                $.each(districts, function(){
                    distCombo.append('<option value="' + this.code + '">' + this.name + '</option>');
                })
            },
            error: function(xhr, textStatus, errorThrown){
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });

    $("select[name='district']").change(function(e){
        let selectedValue = e.target.value;
        let comboBox = $(this);
        comboBox.attr("disabled","disabled");

        let catchmentAreaCheckbox = $('input.quotas[type="checkbox"][value="CA"]');

        if(selectedValue == 318){
            if(instType == 1){
                $("#clusterRow").show();
            }

            catchmentAreaCheckbox.removeAttr("disabled", "disabled").prop('checked', false);
            catchmentAreaCheckbox.closest("label").css("text-decoration", "none");
        }
        else{
            $("#clusterRow").hide();
            catchmentAreaCheckbox.attr("disabled", "disabled").prop('checked', false);
            catchmentAreaCheckbox.closest("label").css("text-decoration", "line-through");
        }

        let formData = new FormData();
        formData.append('code', selectedValue);
        let thanaCombo = $('select[name="thana"]');
        thanaCombo.empty();
        $(thanaCombo).empty().append('<option>loading...</option>');

        $.ajax({
            url:baseUrl + '/school/profile/div-dist-thana.php?require=thana',
            method: 'POST',
            data: formData,
            contentType : false,
            processData : false,
            beforeSend: function(){
            },
            success: function(response){
                comboBox.removeAttr("disabled");

                let thanas =  JSON.parse(response.data);
                thanaCombo.empty().append('<option value="" selected>select</option>');
                $.each(thanas, function(){
                    thanaCombo.append('<option value="' + this.code + '">' + this.name + '</option>');
                })
            },
            error: function(xhr, textStatus, errorThrown){
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });

    // $("select[name='cluster']").change(){
    //     resetSchoo
    // }

    // $('input.quotas[type="checkbox"][value="TS"]').change(function(){
    //     // selected-school-container
        
    //     let selectedSchools = $(".selected-school-container>.school");

    //     let combo = $('select[name="tsSelectedSchool"]');
    //     combo.empty();

    //     let isChecked = $(this).is(":checked");
       
    //     if(isChecked){
    //         let existingEiins = [];
    //         combo.append(`<option value=""></option>`);
    //         $.each(selectedSchools, function(){

    //             let eiin = $(this).find(".selectedSchoolEiin").val();
                
    //             let isExist = existingEiins.indexOf(eiin);
                
    //             if(isExist < 0){
    //                 existingEiins.push(eiin);
    //                 let schoolName = $(this).find(".selectedSchoolName").val();
    //                 $option = `<option value="${eiin}">${schoolName}</option>`;
    //                 combo.append($option);
    //             }
    //         })
    //     }
    // });

    $("select[name='presentDivCode']").change(function(e){
        let selectedValue = e.target.value;
        let formData = new FormData();
        formData.append('code', selectedValue);
        
        let comboBox = $(this);
        comboBox.attr("disabled","disabled");
        
        let distCombo = $('select[name="presentDistCode"]');
        
        let selectedText = $(this).find("option:selected").text();
        // console.log(selectedText);
        $('input[name="presentDivName"]').val(selectedText);

        distCombo.empty().change().append('<option>loading...</option>');
       
        $.ajax({
            url:baseUrl + '/school/profile/div-dist-thana.php?require=dist',
            method: 'POST',
            data: formData,
            contentType : false,
            processData : false,
            beforeSend: function(){
            },
            success: function(response){
                comboBox.removeAttr("disabled");

                let districts =  JSON.parse(response.data);
                distCombo.empty().append('<option value="" selected>select</option>');
                $.each(districts, function(){
                    distCombo.append('<option value="' + this.code + '">' + this.name + '</option>');
                })
            },
            error: function(xhr, textStatus, errorThrown){
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });

    $("select[name='presentDistCode']").change(function(e){
        let selectedValue = e.target.value;
        let formData = new FormData();
        let comboBox = $(this);
        comboBox.attr("disabled","disabled");

        formData.append('code', selectedValue);
        let thanaCombo = $('select[name="presentThanaCode"]');
        thanaCombo.empty().append('<option>loading...</option>');

        let selectedText = $(this).find("option:selected").text();
        $('input[name="presentDistName"]').val(selectedText);


        $.ajax({
            url:baseUrl + '/school/profile/div-dist-thana.php?require=thana',
            method: 'POST',
            data: formData,
            contentType : false,
            processData : false,
            beforeSend: function(){
            },
            success: function(response){
                comboBox.removeAttr("disabled");
        
                let thanas =  JSON.parse(response.data);
                thanaCombo.empty().append('<option value="" selected>select</option>');
                $.each(thanas, function(){
                    thanaCombo.append('<option value="' + this.code + '">' + this.name + '</option>');
                })
            },
            error: function(xhr, textStatus, errorThrown){
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });


    $('select[name="presentThanaCode"]').change(function(e){
        let selectedText = $(this).find("option:selected").text();
        $('input[type="hidden"][name="presentThanaName"]').val(selectedText);
    });

    $("select[name='permanentDivCode']").change(function(e){
        let selectedValue = e.target.value;
        let comboBox = $(this);
        comboBox.attr("disabled","disabled");

        let formData = new FormData();
        formData.append('code', selectedValue);

        let distCombo = $('select[name="permanentDistCode"]');

        distCombo.empty().change().append('<option>loading...</option>');

        let selectedText = $(this).find("option:selected").text();
        $('input[name="permanentDivName"]').val(selectedText);


        $.ajax({
            url:baseUrl + '/school/profile/div-dist-thana.php?require=dist',
            method: 'POST',
            data: formData,
            contentType : false,
            processData : false,
            beforeSend: function(){
            },
            success: function(response){
                comboBox.removeAttr("disabled");
        
                let districts =  JSON.parse(response.data);
                distCombo.empty().append('<option value="" selected>select</option>');
                $.each(districts, function(){
                    distCombo.append('<option value="' + this.code + '">' + this.name + '</option>');
                })
            },
            error: function(xhr, textStatus, errorThrown){
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });

    $("select[name='permanentDistCode']").change(function(e){
        let selectedValue = e.target.value;
        let comboBox = $(this);
        comboBox.attr("disabled","disabled");
        let formData = new FormData();
        formData.append('code', selectedValue);
        let thanaCombo = $('select[name="permanentThanaCode"]');
        thanaCombo.empty().append('<option>loading...</option>');

        let selectedText = $(this).find("option:selected").text();
        $('input[name="permanentDistName"]').val(selectedText);

        $.ajax({
            url:baseUrl + '/school/profile/div-dist-thana.php?require=thana',
            method: 'POST',
            data: formData,
            contentType : false,
            processData : false,
            beforeSend: function(){
            },
            success: function(response){
                comboBox.removeAttr("disabled");
        
                let thanas =  JSON.parse(response.data);
                thanaCombo.empty().append('<option value="" selected>select</option>');
                $.each(thanas, function(){
                    thanaCombo.append('<option value="' + this.code + '">' + this.name + '</option>');
                })
            },
            error: function(xhr, textStatus, errorThrown){
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });

    $('select[name="permanentThanaCode"]').change(function(e){
        let selectedText = $(this).find("option:selected").text();
        $('input[type="hidden"][name="permanentThanaName"]').val(selectedText);
    });

    $("select.school").change(function(e){
        var strQuotas = $('option:selected', this).attr('data-quotas');
        let tr = $(this).closest("tr");
        tr.find('input[type="checkbox"]:not(.GEN)').prop("checked", false).hide();
        if(strQuotas === undefined){

        }
        else{
            let arrQuotas =  strQuotas.split(/\s*,\s*/);
            $.each(arrQuotas, function(){
                let quotaCode = this;
                console.log(quotaCode);
                tr.find("." + quotaCode).show();
            });
        }
    });

    $('button#showSchools').click(function(e){
        e.preventDefault();
      
        let submitButton = $(this);
        let prevText = submitButton.text();
        // var formData = new FormData(document.getElementById("main-form"));

        let formData = new FormData();

        formData.append("instType", instType);

        let studentGender = $('select[name="gender"]').val();
        if(studentGender == ''){
            alert("Select Gender");
            return;
        }
        formData.append("gender", studentGender);

        let selectedClass = $('select[name="class"]').val();
        if(selectedClass == ''){
            alert("Select Class");
            return;
        }
        formData.append("class", selectedClass);

        if(selectedClass == 9){
            let selectedGroup = $('select[name="group"]').val();
            if(selectedGroup == ''){
                alert("Select group");
                return;
            }
            formData.append("group", selectedGroup);
        }

        let selectedVersion = $('select[name="version"]').val();
        if(selectedVersion == ''){
            alert("Select version");
            return;
        }
        formData.append("version", selectedVersion);

        let schoolDivision = $('select[name="division"]').val();
        if(schoolDivision == ''){
            alert("Select division");
            return;
        }
        formData.append("division", schoolDivision);

        let schoolDistrict = $('select[name="district"]').val();
        if(schoolDistrict == ''){
            alert("Select district");
            return;
        }
        formData.append("district", schoolDistrict);

        if(schoolDistrict == 318 && instType == 1){
            let schoolCluster = $('select[name="cluster"]').val();
            if(schoolCluster == ''){
                alert("Select cluster");
                return;
            }
            formData.append("cluster", schoolCluster);
        }


        let schoolThana = $('select[name="thana"]').val();
        if(schoolThana == ''){
            alert("Select thana");
            return;
        }
        formData.append("thana", schoolThana);
        

        let overlay =  $(".overlay");
        overlay.css("display", "flex");
        let overlayMessagebox = $(".overlay").find('.message');
        let spinner = $(".overlay").find('.spinner');
        let overlayButton = $(".overlay").find('.overlayButton');
        
        spinner.show();
        overlayButton.hide();

        $.ajax({
            url: 'school-list.php',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function(){
                submitButton.text('WORKING ....');
                submitButton.attr('disabled', 'disabled');
                overlayMessagebox.text("Please wait ...");
            },
            success: function(response){
                let schoolCombo = $("select.school");
                schoolCombo.empty();
                if(response.issuccess == true){
                    if (response.list !== undefined) {

                        console.log(response.list);

                        $("#choiceTable").show();
                        $("#choiceSelectionRow").show();

                        let schoolCountMsg = " টি বিদ্যালয় পাওয়া গিয়েছে।";
                        let schools = response.list;
                       
                        let foundSchoolCount = 0;
                        $.each(schools, function () {
                            foundSchoolCount++;
                        });

                        let numberToWord = doConvert(foundSchoolCount);
                        $("#resultCount").text(foundSchoolCount + ' ('+ numberToWord +') ' + schoolCountMsg );

                       

                        if(foundSchoolCount < 5){
                            for (var i = 5; i > foundSchoolCount; i--) {
                                $('.choiceTr' + i.toString()).hide();
                            }
                        }
                        else{
                            $(".choiceTr").show();
                        }

                        $(".quotaChk").show().prop('checked', false);

                        for (let index = 1; index < 6; index++) {
                           $('select[name="school'+ index +'"]').append(`<option value="">Select choice ${index} ...</option>`);
                        }
                       
                        $.each(schools, function () {
                            let requisitionId = this.requisitionId;
                            let eiin = this.eiin;
                            let instName = this.instName;
                            let quotas = this.quotas;
                            let caCodes = this.caCodes;
                            let shift = this.shift;
                            let version = this.version;
                            let group = this.group;
                            let gender = this.gender;

                            let groupText = (group == null ? "" : ", " + group);
                            
                            $otherInfo = `(${shift}, ${version}, ${gender} ${groupText})`;
                            let school = `
                                            <option value="${requisitionId}" data-eiin="${eiin}" data-quotas="${quotas}"  data-cacodes="${caCodes}">${instName} ${$otherInfo} </option>
                                        `;
                            schoolCombo.append(school);
                        });

                        submitButton.text(prevText);
                        submitButton.removeAttr("disabled");
                        overlay.css("display", "none");
                    }
                    else{
                        submitButton.text(prevText);
                        submitButton.removeAttr("disabled");
                        overlayMessagebox.html(response.message);
                        overlayButton.show();
                        spinner.hide();
                    }
                }
                else{
                    overlay.css("display", "none");
                    alert(response.message);
                    submitButton.text("TRY AGAIN");
                    submitButton.removeAttr("disabled");
                }
            },
            error: function(xhr, textStatus, errorThrown){
                submitButton.text("TRY AGAIN");
                submitButton.removeAttr("disabled");
                overlayMessagebox.html(xhr.responseText);
                overlayButton.show();
                spinner.hide();
    
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });

    $(document).on('click', '.up', function(){
        let currentSchool = $(this).closest('.school');
        let currentIndex = currentSchool.index();
        let prevSchool = $("div.school:eq("+ (+currentIndex-1) +")");
        currentSchool.insertBefore(prevSchool);    
    });

    $(document).on('click', '.down', function(){
        let currentSchool = $(this).closest('.school');
        let currentIndex = currentSchool.index();
        let nextSchool = $("div.school:eq("+ (+currentIndex+1) +")");
        currentSchool.insertAfter(nextSchool);
    });


    $('.resetSchool').change(function(){
        $("#choiceTable").hide();
        $("#choiceSelectionRow").hide();
        $('select.school').empty();
        $("#resultCount").text("");
    });

    $('input.hasTS[type="checkbox"]').change(function(){
        let isChecked = $(this).is(":checked");
        let value = $(this).val();
        if(isChecked){
            $('div#TSDetails').show();
        }
        else{
            $('div#TSDetails').hide();
        }
    });

    $('input.hasFF[type="checkbox"]').change(function(){
        let isChecked = $(this).is(":checked");
        let value = $(this).val();
        if(isChecked){
            $('div#FFDetails').show();
        }
        else{
            let otherChecked = false;
            $('.hasFF').not(this).each(function(){
               if($(this).is(":checked")){
                otherChecked = true;
               }  
            });

            if(!otherChecked){
                $('div#FFDetails').hide();
            }
            
        }
    });

  


    $("#ApplicantPhoto").change(function(){
        var isValid = ValidatePhoto("ApplicantPhoto", 100, 300,300);
        if(isValid){
            var fileInput = this;
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    //$('#photo-preview').attr('src', e.target.result);
                   $('#ApplicantPhotoImage').attr('src', e.target.result);
                }
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
    });


    // agreement
    $('input[name="agreement"]').change(function(e){

    });

    $('#submit').click(function(e){
        e.preventDefault();
        if(!$('input[name="agreement"]').is(":checked")){
            alert("অঙ্গীকারনামায় সম্মতি প্রদান করুন");
            return;
        }
        let submitButton = $(this);
        var formData = new FormData(document.getElementById("main-form"));
        
        let overlay =  $(".overlay");
        overlay.css("display", "flex");
        let overlayMessagebox = $(".overlay").find('.message');
        let spinner = $(".overlay").find('.spinner');
        let overlayButton = $(".overlay").find('.overlayButton');
        
        spinner.show();
        overlayButton.hide();

        $.ajax({
            url: 'student-application-save.php',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function(){
                submitButton.text('WORKING ....');
                submitButton.attr('disabled', 'disabled');
                overlayMessagebox.text("অনুগ্রহ করে অপেক্ষা করুন ... ");
            },
            success: function(response){
                console.log(response);
                if(response.issuccess === undefined){
                    overlay.css("display", "none");
                    alert('Problem in getting response from server.');
                    return;
                }

                if(response.issuccess === true){
                    submitButton.text("SUCCESS");
                    // submitButton.removeAttr("disabled");
                    overlayMessagebox.html("Successfully saved. <br> Showing preview. Please wait ....");
                    setTimeout(function(){
                        window.location = response.redirecturl;
                    }, 2000);
                }
                else{
                    if(response.redirecturl !== undefined){
                        overlayMessagebox.html("Something is wrong. <br>Redirecting ....");
                        overlayButton.show();
                        spinner.hide();
                        
                        setTimeout(function(){
                            // window.location =  response.redirecturl;
                        }, 2000);
                    }
                    else{
                        submitButton.text("TRY AGAIN");
                        submitButton.removeAttr("disabled");
                        overlayMessagebox.html(response.message);
                         overlayButton.show();
                         spinner.hide();
                    }
                }
            },
            error: function(xhr, textStatus, errorThrown){
                submitButton.text("TRY AGAIN");
                submitButton.removeAttr("disabled");
                overlayMessagebox.html(xhr.responseText);
                overlayButton.show();
                spinner.hide();
    
                console.log(xhr.responseText);
                console.log(xhr);
                console.log(textStatus + ' || ' + errorThrown);
            }
        });
    });
});





