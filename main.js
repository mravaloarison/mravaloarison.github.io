const languages = [
  { 
      language: "English",  
      bcp47: "en-US", 
      flag: "🇺🇸" 
  },
  { 
      language: "Spanish",  
      bcp47: "es-ES", 
      flag: "🇪🇸" 
  },
  { 
      language: "German",   
      bcp47: "de-DE", 
      flag: "🇩🇪" 
  },
  { 
      language: "French",   
      bcp47: "fr-FR", 
      flag: "🇫🇷" 
  },
  { 
      language: "Italian",  
      bcp47: "it-IT", 
      flag: "🇮🇹" 
  },
  { 
      language: "Japanese", 
      bcp47: "ja-JP", 
      flag: "🇯🇵" 
  },
  { 
      language: "Korean",   
      bcp47: "ko-KR", 
      flag: "🇰🇷" 
  },
  { 
      language: "Chinese",  
      bcp47: "zh-CN", 
      flag: "🇨🇳" 
  },
  { 
      language: "Russian",  
      bcp47: "ru-RU", 
      flag: "🇷🇺" 
  }
];

// call filling for each languages
languages.map(lang => {
  filling(
      document.getElementById("listOfLang1"),
      "lang1",
      lang
  );
  
  filling(
      document.getElementById("listOfLang2"),
      "lang2",
      lang
  );

});



// List all the languages and display
function filling(list, name, lang) {
  list.innerHTML += `

      <div class="flex items-center">
        <input 
          data-lang="${lang.language}"
          data-flag="${lang.flag}" 
          id="push-${lang.language}${name}"
          name="${name}" 
          onchange="langChecked(this)" 
          type="radio" 
          value="${lang.bcp47}"
          class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500">
        <label for="push-${lang.language}${name}" class="ml-2 block text-sm font-medium text-gray-700">${lang.flag} ${lang.language}</label>
      </div>

  `;
}


function langChecked(el) {
  let mirrorChecked = 0;

  if (el.name == "lang1") {
      mirrorChecked = $("input[name='lang2']:checked");

      // update the languge selected value
      $("#flagChoice_1").html(el.dataset.flag);
      $("#langChoice_1").html(el.dataset.lang);
      $("#codeChoice_1").val(el.value);
  }  
  
  else {
      mirrorChecked = $("input[name='lang1']:checked");

      // update the language selected value
      $("#flagChoice_2").html(el.dataset.flag);
      $("#langChoice_2").html(el.dataset.lang);
      $("#codeChoice_2").val(el.value);
  }
  
  // make sure the value checked is not duplicated
  if (mirrorChecked.val() == el.value) {
      mirrorChecked.prop("checked", false);
  } 
}

function changeLang(el) {
  let fieldSet  = 0;
  let mirrorSet = 0;
  if(el.id == "lang1") {
    fieldSet  = document.getElementById("listOfLang1");
    mirrorSet = document.getElementById("listOfLang2");
  }
  else if(el.id == "lang2") {
    fieldSet  = document.getElementById("listOfLang2");
    mirrorSet = document.getElementById("listOfLang1");
  }

  if (fieldSet != 0) {
    replaceGrid(fieldSet);

    if (mirrorSet.classList.contains("grid")) {
      replaceGrid(mirrorSet);
    }
  }
}

function replaceGrid(el) {
  el.classList.toggle("grid");
  el.classList.toggle("hidden");
}