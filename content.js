//content.js

function addCustomButton() {
    // 定位到要插入新元素的父元素
    const targetContainer = document.querySelector('body > div.container.body-content > div.container.text-center > div:nth-child(2) > div:nth-child(3)');

    if (targetContainer) {
        targetContainer.classList.add("p-4")
        // 創建一個新的 form 元素
        const newForm = document.createElement('form');
        newForm.id = 'customFormButton'; // 給表單添加一個唯一的ID
        newForm.method = 'get';
        newForm.action = 'http://127.0.0.1:8000/auth/token/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWEzNTIwIiwicGFnZSI6InBlcm1pc3Npb24iLCJuYmYiOjE3MTAxMzQxNTYsImV4cCI6MTgxMDE1MjE1NiwiaWF0IjoxNzEwMTM0MTU2fQ.ZvyjHENc1Qo3qXI8hdrgG2dMrwm8ab1HdZt7R60R-CI'; // 替換成你的 token
        newForm.target = '_blank';

        // 創建一個新的 button 元素
        const newButton = document.createElement('button');
        newButton.type = 'submit';
        newButton.textContent = '權限管理系統';
        newButton.className = 'text-nowrap btn btn-lg btn-secondary btn-block';
        newButton.style.width = '300px';

        // 將按鈕加入到表單中
        newForm.appendChild(newButton);

        // 將表單加入到頁面中
        targetContainer.appendChild(newForm);
    }
}

function removeCustomFormButton() {
    const formToRemove = document.getElementById('customFormButton');
    if (formToRemove) {
        formToRemove.remove();
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 假設沒有任何匹配的操作
    let actionTaken = false;

    // 尋找頁面上的所有form元素並執行替換
    if (request.oldUrl && request.newUrl) {
        var forms = document.querySelectorAll('form');
        forms.forEach(function (form) {
            var actionUrl = form.getAttribute('action');
            // 檢查action URL是否包含要替換的舊URL
            if (actionUrl && actionUrl.includes(request.oldUrl)) {
                // 替換URL
                var newActionUrl = actionUrl.replace(request.oldUrl, request.newUrl);
                form.setAttribute('action', newActionUrl);
                actionTaken = true;
            }
        });
    }

    // 根據發送的指令執行相應的添加或刪除按鈕操作
    if (request.action === "addButton") {
        addCustomButton();
        actionTaken = true;
    } else if (request.action === "removeButton") {
        removeCustomFormButton();
        actionTaken = true;
    }

    // 如果執行了某些操作，則發送成功響應
    if (actionTaken) {
        sendResponse({ success: true });
    }

    // 返回 true 表示您將異步地使用 sendResponse
    return true;
});


chrome.storage.local.get(['switched', 'oldUrl', 'newUrl'], function(result) {
    if(result.switched) {
        addCustomButton();
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

