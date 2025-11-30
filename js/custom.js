// ---------- 自定义爆率功能 ----------
// 获取自定义爆率功能元素
const greenRateSlider = document.getElementById('green-rate');
const blueRateSlider = document.getElementById('blue-rate');
const purpleRateSlider = document.getElementById('purple-rate');
const yellowRateSlider = document.getElementById('yellow-rate');
const redRateSlider = document.getElementById('red-rate');
const keyRateSlider = document.getElementById('key-rate');
const resetRatesButton = document.getElementById('reset-rates-btn');
const toggleDropRatesButton = document.getElementById('toggle-drop-rates');
const dropRateControls = document.getElementById('drop-rate-controls');

// 爆率显示元素
const greenRateValue = document.getElementById('green-rate-value');
const blueRateValue = document.getElementById('blue-rate-value');
const purpleRateValue = document.getElementById('purple-rate-value');
const yellowRateValue = document.getElementById('yellow-rate-value');
const redRateValue = document.getElementById('red-rate-value');
const keyRateValue = document.getElementById('key-rate-value');
const totalRateValue = document.getElementById('total-rate-value');

// 存储当前爆率设置
let customRates = {
    green: 35,
    blue: 30,
    purple: 20,
    yellow: 10,
    red: 4,
    key: 1
};

// 更新单个爆率显示
function updateRateDisplay(rarity, value) {
    customRates[rarity] = value;
    const displayElement = document.getElementById(`${rarity}-rate-value`);
    if (displayElement) {
        displayElement.textContent = `${value}%`;
    }
    updateTotalRate();
}

// 更新总概率显示
function updateTotalRate() {
    const total = Object.values(customRates).reduce((sum, rate) => sum + rate, 0);
    totalRateValue.textContent = `${total}%`;
}

// 重置爆率为默认值
function resetRates() {
    customRates = {
        green: 35,
        blue: 30,
        purple: 20,
        yellow: 10,
        red: 4,
        key: 1
    };
    
    // 更新滑块和显示
    greenRateSlider.value = customRates.green;
    blueRateSlider.value = customRates.blue;
    purpleRateSlider.value = customRates.purple;
    yellowRateSlider.value = customRates.yellow;
    redRateSlider.value = customRates.red;
    keyRateSlider.value = customRates.key;
    
    updateRateDisplay('green', customRates.green);
    updateRateDisplay('blue', customRates.blue);
    updateRateDisplay('purple', customRates.purple);
    updateRateDisplay('yellow', customRates.yellow);
    updateRateDisplay('red', customRates.red);
    updateRateDisplay('key', customRates.key);
}

// 折叠/展开爆率设置
function toggleDropRates() {
    dropRateControls.classList.toggle('collapsed');
    toggleDropRatesButton.classList.toggle('collapsed');
    toggleDropRatesButton.textContent = dropRateControls.classList.contains('collapsed') ? '▶' : '▼';
}

// 初始化自定义爆率功能
function initCustomRates() {
    // 默认折叠爆率设置
    toggleDropRates();
    
    // 添加折叠/展开按钮事件监听器
    toggleDropRatesButton.addEventListener('click', toggleDropRates);
    
    // 添加滑块事件监听器
    greenRateSlider.addEventListener('input', () => updateRateDisplay('green', parseInt(greenRateSlider.value)));
    blueRateSlider.addEventListener('input', () => updateRateDisplay('blue', parseInt(blueRateSlider.value)));
    purpleRateSlider.addEventListener('input', () => updateRateDisplay('purple', parseInt(purpleRateSlider.value)));
    yellowRateSlider.addEventListener('input', () => updateRateDisplay('yellow', parseInt(yellowRateSlider.value)));
    redRateSlider.addEventListener('input', () => updateRateDisplay('red', parseInt(redRateSlider.value)));
    keyRateSlider.addEventListener('input', () => updateRateDisplay('key', parseInt(keyRateSlider.value)));
    
    // 添加重置按钮事件监听器
    resetRatesButton.addEventListener('click', resetRates);
    
    // 初始化显示
    updateTotalRate();
}

// 版本号更新功能
function updateVersion() {
    const version = '3.0'; // 设置当前版本号
    const elements = document.querySelectorAll('title, .version-text');
    
    elements.forEach(element => {
        if (element.textContent.includes('{version}')) {
            element.textContent = element.textContent.replace(/\{version\}/g, version);
        }
    });
}

// 页面加载完成后更新版本号
document.addEventListener('DOMContentLoaded', updateVersion);

// 导出变量和函数以便其他脚本使用
window.customRates = customRates;
window.updateRateDisplay = updateRateDisplay;
window.updateTotalRate = updateTotalRate;
window.resetRates = resetRates;
window.toggleDropRates = toggleDropRates;
window.initCustomRates = initCustomRates;
window.updateVersion = updateVersion;