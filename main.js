const languages = [
    { language: "English",  bcp47: "en-US", flag: "🇺🇸" },
    { language: "Spanish",  bcp47: "es-ES", flag: "🇪🇸" },
    { language: "German",   bcp47: "de-DE", flag: "🇩🇪" },
    { language: "French",   bcp47: "fr-FR", flag: "🇫🇷" },
    { language: "Italian",  bcp47: "it-IT", flag: "🇮🇹" },
    { language: "Japanese", bcp47: "ja-JP", flag: "🇯🇵" },
    { language: "Korean",   bcp47: "ko-KR", flag: "🇰🇷" },
    { language: "Chinese",  bcp47: "zh-CN", flag: "🇨🇳" },
    { language: "Chinese",  bcp47: "zh-TW", flag: "🇹🇼" },
    { language: "Russian",  bcp47: "ru-RU", flag: "🇷🇺" }
  ];


languages.map(item => {
    document.getElementById("lang").innerHTML +=  `
        <div>
            <p>${item.language}</p>
        </div>
    `
    console.log(item.language)
}); 