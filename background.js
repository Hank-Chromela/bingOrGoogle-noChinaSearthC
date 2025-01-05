let userIP = '';
let userCountry = '';

// 获取IP信息
async function fetchIPInfo() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP = data.ip;
    
    // 获取国家信息
    const geoResponse = await fetch(`http://ip-api.com/json/${userIP}`);
    const geoData = await geoResponse.json();
    userCountry = geoData.country;
    
    // 保存到存储
    chrome.storage.local.set({
      userIP: userIP,
      userCountry: userCountry
    });
  } catch (error) {
    console.error('获取IP信息失败:', error);
  }
}

// 监听来自content script的消息
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  if (message.type === 'GET_REDIRECT_URL') {
    const settings = await chrome.storage.local.get(null);
    const targetEngine = settings.targetEngine || 'region';
    const redirectUrl = buildRedirectUrl(targetEngine, message.query);
    
    // 发送重定向URL回content script
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'PERFORM_REDIRECT',
      url: redirectUrl
    });
  }
});

// 构建重定向URL
function buildRedirectUrl(engine, query) {
  switch(engine) {
    case 'google':
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    case 'bing':
      return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    case 'duckduckgo':
      return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    case 'region':
      return userCountry === 'China' 
        ? `https://www.bing.com/search?q=${encodeURIComponent(query)}`
        : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    default:
      return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  }
}

// 初始化
fetchIPInfo(); 