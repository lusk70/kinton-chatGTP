const { Configuration, OpenAIApi } = require('openai');

// FieldCode一覧
// 質問： quetion
// 答え： answer

// const apiKey = 'YOUR_API_KEY';

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

//ChatGPTの返信を取得する
async function getReponseData(prompt) {
  let headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: 'Bearer ' + apiKey,
  };
  let body = {
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 4000,
    temperature: 0,
  };

  return kintone
    .proxy('https://api.openai.com/v1/completions', 'POST', headers, body)
    .then(
      function (json) {
        let obj = JSON.parse(json[0]);
        const rec = kintone.app.record.get();
        rec.record.answer.value = '';
        rec.record.answer.value = obj.choices[0].text.trim();
        console.log(obj.choices[0].text);
        kintone.app.record.set(rec);
      },
      function (error) {
        console.log(error); //proxy APIのレスポンスボディ(文字列)を表示
        return {};
      }
    );
}

(() => {
  'use strict';

  var showEvents = [
    'app.record.edit.show',
    'app.record.index.edit.show',
    'app.record.create.show',
    'mobile.app.record.create.show',
    'mobile.app.record.edit.show',
  ];
  kintone.events.on(showEvents, function (event) {
    const exeButton = document.createElement('button');
    exeButton.id = 'exe_button';
    exeButton.innerText = '相談してみる';

    // chatGPTからの返信を取得
    exeButton.onclick = function () {
      const rec = kintone.app.record.get();
      rec.record.answer.value = '回答待ちです。少々お待ちください。';
      kintone.app.record.set(rec);

      getReponseData(event.record.quetion.value);
    };

    kintone.app.record.getSpaceElement('btn').appendChild(exeButton);

    return event;
  });
})();
