globalThis.stand = {
    code         : 'local',

    // Закоментировать для проверки как на стенде
    isDevelop    : false, // влияет на вывод отладочной информации
    isLocal      : true, // разблокирует весь функционал
    // -------------------------



    standTest    : false,

    useWebsocket : false, 

    testStend   : "stage.o2.elasticcloud.ru",

    url         : function(postfix='', noApiInUrl = false)  { return this.standTest ? this.stand(postfix, noApiInUrl) : this.mock(postfix, noApiInUrl)  },

    mock        : function(postfix, noApiInUrl)  { return `https://b7684b70-8c48-44ae-bd1d-0fb9a2e15222.mock.pstmn.io${ noApiInUrl ? '' : '/api'}/${postfix}`; },

    stand       : function(postfix, noApiInUrl)  { return `https://${this.testStend}${ noApiInUrl ? '' : '/api'}/${postfix}`;  },

    websocket   : function(postfix)  { return `wss://${this.testStend}/api/${postfix}`;  },
}