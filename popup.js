// 初始化界面
document.addEventListener('DOMContentLoaded', async function() {
  // 获取存储的设置
  const settings = await chrome.storage.local.get(null);
  
  // 显示IP信息
  document.getElementById('current-ip').textContent = settings.userIP || '未知';
  document.getElementById('current-country').textContent = settings.userCountry || '未知';
  
  // 设置复选框状态
  document.getElementById('baidu').checked = settings.baidu !== false;
  document.getElementById('sogou').checked = settings.sogou !== false;
  document.getElementById('360').checked = settings['360'] !== false;
  document.getElementById('sm').checked = settings.sm !== false;
  
  // 设置下拉框状态
  document.getElementById('target-engine').value = settings.targetEngine || 'region';
  
  // 添加事件监听器
  addEventListeners();
});

function addEventListeners() {
  // 复选框变化监听
  document.getElementById('baidu').addEventListener('change', saveSettings);
  document.getElementById('sogou').addEventListener('change', saveSettings);
  document.getElementById('360').addEventListener('change', saveSettings);
  document.getElementById('sm').addEventListener('change', saveSettings);
  
  // 下拉框变化监听
  document.getElementById('target-engine').addEventListener('change', saveSettings);
}

async function saveSettings() {
  const settings = {
    baidu: document.getElementById('baidu').checked,
    sogou: document.getElementById('sogou').checked,
    '360': document.getElementById('360').checked,
    sm: document.getElementById('sm').checked,
    targetEngine: document.getElementById('target-engine').value
  };
  
  await chrome.storage.local.set(settings);
} 