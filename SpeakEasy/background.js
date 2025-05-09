/**
 * SpeakEasy Web Reader Background Script
 */

console.log('SpeakEasy background script 正在启动...');

// 处理错误
function handleErrors(func) {
  try {
    return func();
  } catch (error) {
    console.error(`错误: ${error.message}`);
    return null;
  }
}

// 确保API正确初始化
handleErrors(() => {
  // 验证contextMenus API是否可用
  if (chrome.contextMenus) {
    console.log('contextMenus API 已可用');
  } else {
    console.error('contextMenus API 不可用，这将影响右键菜单功能');
  }
  
  // 验证其他关键API
  if (chrome.scripting) {
    console.log('scripting API 已可用');
  } else {
    console.error('scripting API 不可用，这将影响内容脚本注入');
  }
  
  // 验证标签API
  if (chrome.tabs) {
    console.log('tabs API 已可用');
  } else {
    console.error('tabs API 不可用，这将影响标签页通信');
  }
  
  console.log('SpeakEasy background script 已成功加载');
});

// 检查URL是否是浏览器内部页面
function isRestrictedUrl(url) {
  return url.startsWith('chrome://') || 
         url.startsWith('chrome-extension://') || 
         url.startsWith('about:') || 
         url.startsWith('edge://') || 
         url.startsWith('brave://') || 
         url.startsWith('opera://');
}

// 错误处理包装器
function handleError(func) {
  try {
    return func();
  } catch (error) {
    console.error('操作错误:', error);
    return null;
  }
}

// 修改消息处理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleError(() => {
    console.log('收到消息:', message);
    
    switch (message.action) {
      case 'readSelection':
        if (!message.text) {
          console.error('没有要朗读的文本');
          return;
        }
        
        // 确保停止之前的朗读
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message.text);
        
        // 设置语音参数
        if (message.voiceSettings) {
          const voices = window.speechSynthesis.getVoices();
          const selectedVoice = voices.find(v => v.name === message.voiceSettings.voiceName);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          utterance.rate = message.voiceSettings.speed || 1.0;
          utterance.volume = message.voiceSettings.volume || 1.0;
        }
        
        utterance.onend = () => {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'readingComplete'
          }).catch(err => console.error('发送完成消息失败:', err));
        };
        
        utterance.onerror = (event) => {
          console.error('语音合成错误:', event);
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'readingError',
            error: event
          }).catch(err => console.error('发送错误消息失败:', err));
        };
        
        window.speechSynthesis.speak(utterance);
        sendResponse({status: 'started'});
        break;
        
      case 'pauseReading':
        if (window.speechSynthesis.speaking) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            sendResponse({status: 'resumed'});
          } else {
            window.speechSynthesis.pause();
            sendResponse({status: 'paused'});
          }
        }
        break;
        
      case 'stopReading':
        window.speechSynthesis.cancel();
        sendResponse({status: 'stopped'});
        break;
    }
  });
  
  return true;
});

// 初始化右键菜单
chrome.runtime.onInstalled.addListener(() => {
  handleError(() => {
    chrome.contextMenus.create({
      id: "speakSelection",
      title: "朗读选中文本",
      contexts: ["selection"]
    });
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleError(() => {
    if (info.menuItemId === "speakSelection" && info.selectionText) {
      chrome.tabs.sendMessage(tab.id, {
        action: "readSelection",
        text: info.selectionText
      }).catch(() => {});
    }
  });
});

console.log('SpeakEasy background script 安装完成'); 