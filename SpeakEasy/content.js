/**
 * SpeakEasy Web Reader Content Script
 * 
 * 这个脚本处理页面文本的朗读功能
 */

console.log('SpeakEasy content script 正在启动...');

// 测试语音API
function testSpeechAPI() {
  if (!('speechSynthesis' in window)) {
    console.error('浏览器不支持 Web Speech API');
    return false;
  }
  
  console.log('Web Speech API 可用');
  
  try {
    // 尝试获取语音
    const voices = window.speechSynthesis.getVoices();
    console.log(`立即可用的语音数量: ${voices.length}`);
    
    if (voices.length === 0) {
      // 等待onvoiceschanged事件
      window.speechSynthesis.onvoiceschanged = function() {
        const updatedVoices = window.speechSynthesis.getVoices();
        console.log(`通过事件获取到语音数量: ${updatedVoices.length}`);
        console.log('可用语音列表:', updatedVoices.map(v => `${v.name} (${v.lang})`));
      };
      
      // 手动触发语音加载
      window.speechSynthesis.cancel();
    } else {
      console.log('可用语音列表:', voices.map(v => `${v.name} (${v.lang})`));
    }
    
    // 尝试一个简单的发声测试
    const testUtterance = new SpeechSynthesisUtterance('测试语音合成功能');
    testUtterance.onstart = () => console.log('测试语音开始');
    testUtterance.onend = () => console.log('测试语音结束');
    testUtterance.onerror = (e) => console.error('测试语音错误:', e);
    window.speechSynthesis.speak(testUtterance);
    
    return true;
  } catch (e) {
    console.error('语音API测试失败:', e);
    return false;
  }
}

// 在页面加载完成后运行测试
window.addEventListener('load', () => {
  console.log('页面加载完成，测试语音API');
  setTimeout(testSpeechAPI, 1000); // 延迟1秒测试
});

// 全局变量
let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let isReading = false;
let paragraphs = [];
let currentParagraphIndex = 0;
let settings = {
  voiceName: '',
  speed: 1.0,
  volume: 1.0
};
let currentPlayerStyle = 'default';

// 创建并插入样式
function applyPlayerStyle(style) {
  currentPlayerStyle = style;
  
  // 移除旧样式
  const oldStyle = document.getElementById('speakeasy-styles');
  if (oldStyle) {
    oldStyle.remove();
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'speakeasy-styles';
  
  // 根据不同样式设置CSS
  switch (style) {
    case 'minimal':
      styleElement.textContent = `
        .speakeasy-player {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid #ddd !important;
          padding: 5px !important;
          border-radius: 4px !important;
        }
        .speakeasy-player button {
          min-width: 30px !important;
          padding: 3px !important;
        }
      `;
      break;
    case 'transparent':
      styleElement.textContent = `
        .speakeasy-player {
          background: rgba(255, 255, 255, 0.5) !important;
          backdrop-filter: blur(5px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          padding: 8px !important;
          border-radius: 8px !important;
        }
        .speakeasy-player button {
          background: rgba(255, 255, 255, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
        }
      `;
      break;
    default: // default style
      styleElement.textContent = `
        .speakeasy-player {
          background: #ffffff !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
          padding: 10px !important;
          border-radius: 6px !important;
        }
        .speakeasy-player button {
          background: #1a73e8 !important;
          color: white !important;
          border: none !important;
          padding: 5px 10px !important;
          border-radius: 4px !important;
        }
      `;
  }
  
  document.head.appendChild(styleElement);
}

// 添加错误处理包装器
function handleError(func) {
  try {
    return func();
  } catch (error) {
    console.error('操作错误:', error);
    return null;
  }
}

// 改进消息监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleError(() => {
    console.log("收到消息:", message);
    
    if (message.action === "ping") {
      sendResponse({status: "pong"});
      return;
    }
    
    switch(message.action) {
      case "readPage":
      case "readSelection":
        if (message.text) {
          readSpecificText(message.text, message.voiceSettings);
        } else {
          readSelectedText();
        }
        break;
      case "stopReading":
        stopReading();
        break;
      case "pauseReading":
        togglePlayPause();
        break;
    }
    
    sendResponse({status: "success"});
  });
  
  return true;
});

// 改进语音合成错误处理
async function createUtterance(text, voiceSettings) {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (voiceSettings) {
        utterance.voice = voiceSettings.voice;
        utterance.rate = voiceSettings.speed || 1.0;
        utterance.volume = voiceSettings.volume || 1.0;
      }
      
      utterance.onerror = (event) => {
        console.error('语音合成错误:', event);
        reject(event);
      };
      
      resolve(utterance);
    } catch (error) {
      reject(error);
    }
  });
}

// 改进朗读功能
async function readSpecificText(text, voiceSettings) {
  try {
    stopReading();
    
    // 如果没有提供 voiceSettings，从存储中获取
    if (!voiceSettings) {
      const result = await new Promise(resolve => {
        chrome.storage.sync.get(['voiceSettings'], resolve);
      });
      voiceSettings = result.voiceSettings;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音参数
    if (voiceSettings) {
      const voices = await getVoices();
      const selectedVoice = voices.find(v => v.name === voiceSettings.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = voiceSettings.speed || 1.0;
      utterance.volume = voiceSettings.volume || 1.0;
    }
    
    // 添加事件处理
    utterance.onstart = () => {
      console.log('开始朗读');
      isReading = true;
    };
    
    utterance.onend = () => {
      console.log('朗读完成');
      isReading = false;
      currentUtterance = null;
    };
    
    utterance.onerror = (event) => {
      console.error('朗读错误:', event);
      isReading = false;
      currentUtterance = null;
    };
    
    currentUtterance = utterance;
    speechSynth.speak(utterance);
    
  } catch (error) {
    console.error('朗读失败:', error);
  }
}

// 加载保存的设置
function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['voiceSettings'], (result) => {
      if (result.voiceSettings) {
        settings = {...settings, ...result.voiceSettings};
        console.log('已加载设置:', settings);
      } else {
        console.log('未找到已保存的设置，使用默认设置');
      }
      resolve(settings);
    });
  });
}

// 获取所有可用语音
function getVoices() {
  return new Promise((resolve) => {
    let voices = speechSynth.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // 某些浏览器需要通过事件来获取语音列表
      speechSynth.onvoiceschanged = function() {
        voices = speechSynth.getVoices();
        resolve(voices);
      };
      
      // 手动触发语音加载
      speechSynth.cancel();
    }
  });
}

// 获取页面上的段落
function getPageParagraphs() {
  // 选择所有可能包含文本的元素
  const textElements = document.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li, article, section, .article-content, .post-content'
  );
  
  // 提取文本
  return Array.from(textElements)
    .map(el => el.textContent.trim())
    .filter(text => text.length > 10) // 只保留有意义的文本
    .filter((text, index, self) => self.indexOf(text) === index); // 去重
}

// 读取页面内容
async function readPage() {
  console.log("开始读取页面内容");
  
  // 停止任何正在进行的朗读
  stopReading();
  
  // 重新加载设置
  await loadSettings();
  
  // 获取所有段落
  paragraphs = getPageParagraphs();
  
  if (paragraphs.length === 0) {
    console.log("未找到可读取的内容");
    return;
  }
  
  console.log(`找到 ${paragraphs.length} 个段落`);
  currentParagraphIndex = 0;
  
  // 开始朗读
  startReading();
}

// 开始朗读
async function startReading(voiceSettings) {
  if (currentParagraphIndex >= paragraphs.length) {
    console.log("已到达内容末尾");
    isReading = false;
    return;
  }
  
  // 如果提供了设置，则使用传入的设置
  if (voiceSettings) {
    settings = {...settings, ...voiceSettings};
  }
  
  isReading = true;
  
  // 获取当前段落文本
  const text = paragraphs[currentParagraphIndex];
  
  // 创建语音合成实例
  currentUtterance = await createUtterance(text, voiceSettings);
  
  // 设置回调
  currentUtterance.onend = function() {
    console.log(`段落 ${currentParagraphIndex + 1}/${paragraphs.length} 朗读完成`);
    currentParagraphIndex++;
    
    // 自动继续下一段
    if (isReading && currentParagraphIndex < paragraphs.length) {
      setTimeout(() => {
        startReading();
      }, 500); // 段落之间短暂暂停
    } else if (currentParagraphIndex >= paragraphs.length) {
      console.log('所有内容朗读完成');
      isReading = false;
    }
  };
  
  currentUtterance.onerror = function(event) {
    console.error('语音合成错误:', event);
    isReading = false;
  };
  
  // 开始朗读
  console.log(`开始朗读第 ${currentParagraphIndex + 1}/${paragraphs.length} 段`);
  speechSynth.speak(currentUtterance);
}

// 停止朗读
function stopReading() {
  console.log("停止朗读");
  speechSynth.cancel();
  isReading = false;
  currentUtterance = null;
}

// 暂停/继续朗读
function togglePlayPause() {
  if (isReading) {
    if (speechSynth.paused) {
      console.log("继续朗读");
      speechSynth.resume();
    } else {
      console.log("暂停朗读");
      speechSynth.pause();
    }
  } else if (paragraphs.length > 0) {
    // 如果已停止但有内容，则重新开始
    chrome.storage.sync.get(['voiceSettings'], (result) => {
      startReading(result.voiceSettings);
    });
  }
}

// 读下一段
function readNextParagraph() {
  if (isReading) {
    speechSynth.cancel();
    currentParagraphIndex++;
    chrome.storage.sync.get(['voiceSettings'], (result) => {
      startReading(result.voiceSettings);
    });
  }
}

// 朗读选定的文本
function readSelectedText() {
  // 获取用户选择的文本
  const selectedText = window.getSelection().toString().trim();
  
  if (!selectedText) {
    console.log('没有选中文本');
    return;
  }
  
  console.log('读取选中的文本:', selectedText.substring(0, 50) + '...');
  
  // 停止当前朗读
  stopReading();
  
  // 设置选中的文本作为段落
  paragraphs = [selectedText];
  currentParagraphIndex = 0;
  
  // 开始朗读
  chrome.storage.sync.get(['voiceSettings'], (result) => {
    startReading(result.voiceSettings);
  });
}

// 添加右键菜单上下文
document.addEventListener('contextmenu', function(e) {
  const selection = window.getSelection().toString().trim();
  
  if (selection) {
    // 设置选择的文本到上下文，供背景脚本读取
    chrome.runtime.sendMessage({
      action: 'setSelectedText',
      text: selection
    });
  }
});

// 添加浮动控制面板的HTML和样式
const floatingPlayerHTML = `
<div id="speakeasy-floating-player" style="display:none;">
  <button id="speakeasy-float-play" title="播放/暂停">
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path d="M8 5v14l11-7z" fill="currentColor"/>
    </svg>
  </button>
  <button id="speakeasy-float-stop" title="停止">
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path d="M6 6h12v12H6z" fill="currentColor"/>
    </svg>
  </button>
</div>
`;

// 修改浮动播放器的样式，确保它总是显示在最上层
const floatingPlayerStyle = `
<style>
  #speakeasy-floating-player {
    position: fixed;  /* 改为 fixed 定位 */
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 6px;
    display: flex;
    gap: 4px;
    z-index: 2147483647;  /* 最大 z-index 值 */
  }
  
  #speakeasy-floating-player button {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    background: #1a73e8;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background-color 0.2s;
  }
  
  #speakeasy-floating-player button:hover {
    background: #1557b0;
  }
</style>
`;

// 修改初始化函数，确保只初始化一次
let floatingPlayerInitialized = false;

function initFloatingPlayer() {
  if (floatingPlayerInitialized) return;
  
  // 插入样式
  document.head.insertAdjacentHTML('beforeend', floatingPlayerStyle);
  
  // 创建播放器容器
  const container = document.createElement('div');
  container.innerHTML = floatingPlayerHTML;
  document.body.appendChild(container);
  
  const floatingPlayer = document.getElementById('speakeasy-floating-player');
  const playButton = document.getElementById('speakeasy-float-play');
  const stopButton = document.getElementById('speakeasy-float-stop');
  
  let isPlaying = false;
  
  // 监听选中文本事件
  document.addEventListener('mouseup', (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // 计算位置，确保在视口内
      const top = Math.min(
        rect.bottom + window.scrollY + 8,
        window.innerHeight - 50
      );
      
      const left = Math.min(
        rect.left + window.scrollX,
        window.innerWidth - 100
      );
      
      floatingPlayer.style.left = `${left}px`;
      floatingPlayer.style.top = `${top}px`;
      floatingPlayer.style.display = 'flex';
      
      // 更新播放按钮状态
      updatePlayButton();
    } else if (!floatingPlayer.contains(e.target)) {
      floatingPlayer.style.display = 'none';
    }
  });
  
  // 播放按钮点击事件
  playButton.addEventListener('click', () => {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;
    
    if (!isPlaying) {
      // 开始朗读
      readSpecificText(selectedText);
      isPlaying = true;
    } else {
      // 暂停朗读
      togglePlayPause();
      isPlaying = false;
    }
    updatePlayButton();
  });
  
  // 停止按钮点击事件
  stopButton.addEventListener('click', () => {
    stopReading();
    isPlaying = false;
    updatePlayButton();
    floatingPlayer.style.display = 'none';
  });
  
  function updatePlayButton() {
    playButton.innerHTML = isPlaying ? 
      '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>' :
      '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  }
  
  floatingPlayerInitialized = true;
  console.log('浮动播放器初始化完成');
}

// 确保在页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingPlayer);
} else {
  initFloatingPlayer();
}

// 初始化
console.log("SpeakEasy content script 初始化完成"); 