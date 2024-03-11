//content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 尋找頁面上的所有form元素
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
        var actionUrl = form.getAttribute('action');
        // 檢查action URL是否包含要替換的舊URL
        if (actionUrl.includes(request.oldUrl)) {
            // 替換URL
            var newActionUrl = actionUrl.replace(request.oldUrl, request.newUrl);
            form.setAttribute('action', newActionUrl);
        }
    });

    sendResponse({success: true}); // 即使不需要回傳具體結果，也調用此函數
    return true; // 持續聽取消息
});

chrome.storage.local.get(['switched', 'oldUrl', 'newUrl'], function(result) {
    if(result.switched) {
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
            var actionUrl = form.getAttribute('action');
            if(actionUrl.includes(result.oldUrl)) {
                var newActionUrl = actionUrl.replace(result.oldUrl, result.newUrl);
                form.setAttribute('action', newActionUrl);
            }
        });
    }
});
