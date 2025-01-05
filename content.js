// 监听URL变化
let lastUrl = window.location.href;
setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    checkAndRedirect(currentUrl);
  }
}, 100);

// 监听表单提交
document.addEventListener('submit', function(e) {
  const form = e.target;
  if (isSearchForm(form)) {
    e.preventDefault();
    const query = getSearchQuery(form);
    if (query) {
      requestRedirect(query);
    }
  }
});

// 检查是否需要重定向
function checkAndRedirect(url) {
  if (isSearchPage(url)) {
    const query = getQueryFromUrl(url);
    if (query) {
      requestRedirect(query);
    }
  }
}

// 请求重定向
function requestRedirect(query) {
  chrome.runtime.sendMessage({
    type: 'GET_REDIRECT_URL',
    query: query
  });
}

// 判断是否是搜索页面
function isSearchPage(url) {
  const searchPatterns = [
    '/s?',      // 百度、360
    '/web?',    // 搜狗
    '/search?', // 通用
    '/s/q?'     // 360搜索的另一种格式
  ];
  return searchPatterns.some(pattern => url.includes(pattern));
}

// 判断是否是搜索表单
function isSearchForm(form) {
  const searchInputs = ['wd', 'query', 'q', 'word', 'keyword', 'w'];
  return searchInputs.some(name => form.querySelector(`input[name="${name}"]`));
}

// 从表单获取搜索词
function getSearchQuery(form) {
  const searchInputs = ['wd', 'query', 'q', 'word', 'keyword', 'w'];
  for (const name of searchInputs) {
    const input = form.querySelector(`input[name="${name}"]`);
    if (input && input.value) {
      return input.value;
    }
  }
  return null;
}

// 从URL获取搜索词
function getQueryFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    // 检查所有可能的参数名
    const possibleParams = ['wd', 'query', 'q', 'word', 'keyword', 'w'];
    for (const param of possibleParams) {
      const value = params.get(param);
      if (value) {
        return value;
      }
    }

    // 特殊处理360搜索
    if (url.includes('so.com')) {
      // 尝试从路径中获取查询词
      const matches = url.match(/\/s\/(.*?)(?:\?|$)/);
      if (matches && matches[1]) {
        return decodeURIComponent(matches[1]);
      }
    }

    return null;
  } catch (e) {
    console.error('URL解析错误:', e);
    return null;
  }
}

// 监听来自background script的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'PERFORM_REDIRECT') {
    window.location.replace(message.url);
  }
});

// 立即检查当前页面
checkAndRedirect(window.location.href); 