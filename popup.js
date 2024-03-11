document.getElementById('switchUrl').addEventListener('click', function () {
    var oldUrl = document.getElementById('oldUrl').value;
    var newUrl = document.getElementById('newUrl').value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            oldUrl: oldUrl,
            newUrl: newUrl
        }, function (response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending message: ", chrome.runtime.lastError.message);
                // 在這裡處理錯誤，例如通過更新UI來通知用戶
                return;
            }
            // 在切換成功的回調中加入以下代碼
            if (response && response.success) {
                alert("URL已成功切換！");
                document.getElementById('switchStatus').textContent = "已切換";
                // 儲存切換狀態
                chrome.storage.local.set({
                    'switched': true,
                    'oldUrl': oldUrl,
                    'newUrl': newUrl
                }, function () {
                    console.log('切換狀態已儲存。');
                    chrome.action.setIcon({path: "images/icons8-link-64.png"});
                });
            }

        });
    });
});

document.getElementById('undoSwitch').addEventListener('click', function () {
    chrome.storage.local.get(['switched', 'oldUrl', 'newUrl'], function (result) {
        if (result.switched) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    oldUrl: result.newUrl,
                    newUrl: result.oldUrl
                }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message: ", chrome.runtime.lastError.message);
                        // 在這裡處理錯誤，例如通過更新UI來通知用戶
                        return;
                    }
                    // 在切換成功的回調中加入以下代碼
                    if (response && response.success) {
                        alert("URL已成功復原！");
                        document.getElementById('switchStatus').textContent = "未切換";
                        // 儲存切換狀態
                        chrome.storage.local.set({
                            'switched': false,
                            'oldUrl': oldUrl,
                            'newUrl': newUrl
                        }, function () {
                            console.log('切換狀態已儲存。');
                            chrome.action.setIcon({path: "images/icons8-broken-link-64.png"});
                        });
                    }

                });
            });
            // alert("復原。");
            //         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //             chrome.tabs.sendMessage(tabs[0].id, {oldUrl: result.newUrl, newUrl: result.oldUrl}, function(response) {
            //                 if (chrome.runtime.lastError) {
            //                     console.error("Error sending message: ", chrome.runtime.lastError.message);
            //                     return;
            //                 }
            //                 alert("URL已成功復原！");
            //                 document.getElementById('switchStatus').textContent = "尚未切換";
            //                 // 清除儲存的切換狀態
            //                 chrome.storage.local.remove(['switched', 'oldUrl', 'newUrl'], function() {
            //                     console.log('切換狀態已清除。');
            //                 });
            //             });
            //         });
        } else {
            alert("尚未執行切換操作，無法復原。");
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['switched', 'oldUrl', 'newUrl'], function (result) {
        if (result.switched) {
            document.getElementById('switchStatus').textContent = "已切換";
            document.getElementById('oldUrl').value = result.oldUrl;
            document.getElementById('newUrl').value = result.newUrl;
        } else {
            document.getElementById('switchStatus').textContent = "尚未切換";
        }
    });
});