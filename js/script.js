// ---------- 第 1 步: 获取元素并初始化变量 ----------
const searchButton = document.getElementById('search-btn');
const statusText = document.getElementById('status-text');
const gridContainer = document.getElementById('item-grid-container');
const totalValueSpan = document.getElementById('total-value-span'); // 获取显示总价值的 span

// 自定义爆率功能元素
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
    green: 30,
    blue: 25,
    purple: 20,
    yellow: 14,
    red: 10,
    key: 1
};

let totalValue = 0; // 用于存储本局总价值

const sounds = {
    searching: new Audio("./assets/video/founding.mp3"),
    green: new Audio("./assets/video/green.mp3"),
    bluep: new Audio("./assets/video/bluep.mp3"),
    redy: new Audio("./assets/video/redy.mp3")
};

sounds.searching.loop = true;
Object.values(sounds).forEach(sound => sound.load());

const GRID_CONFIG = { width: 5, height: 9, cellWidth: 60, cellHeight: 60, gap: 0 };

// const itemPool = [ ... ]; // 物品池数据来自 object.js

const rarityConfig = {
    green: { duration: 1000 }, blue: { duration: 1500 }, purple: { duration: 1700 },
    yellow: { duration: 2500 }, red: { duration: 2500 }, key: { duration: 3500 }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ---------- 自定义爆率功能函数 ----------
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
        green: 30,
        blue: 25,
        purple: 20,
        yellow: 14,
        red: 10,
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

// 折叠/展开爆率设置
function toggleDropRates() {
    dropRateControls.classList.toggle('collapsed');
    toggleDropRatesButton.classList.toggle('collapsed');
    toggleDropRatesButton.textContent = dropRateControls.classList.contains('collapsed') ? '▶' : '▼';
}

// ---------- 第 2 步: 创建数字滚动动画函数 ----------
function animateValueUpdate(start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentAnimatedValue = Math.floor(progress * (end - start) + start);
        totalValueSpan.textContent = currentAnimatedValue.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function createBackgroundGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_CONFIG.width * GRID_CONFIG.height; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
    }
}

/**
 * 根据用户自定义的概率随机选择一个物品。
 */
function randomItemByRarity() {
    // 确保池子不为空
    if (itemPool.length === 0) {
        return { name: "NULL", w: 1, h: 1, rarity: "green", image: "path/to/default.png", price: 0 };
    }
    
    // 计算总概率
    const totalProbability = Object.values(customRates).reduce((sum, rate) => sum + rate, 0);
    
    // 生成一个 0 到总概率之间的随机数
    const rand = Math.random() * totalProbability;
    let cumulativeProbability = 0;
    let rarityToPick;
    
    // 确定选中的稀有度
    for (const [rarity, rate] of Object.entries(customRates)) {
        cumulativeProbability += rate;
        if (rand < cumulativeProbability) {
            rarityToPick = rarity;
            break;
        }
    }
    
    // 从总物品池中筛选出符合选定稀有度的所有物品
    const filteredPool = itemPool.filter(item => item.rarity === rarityToPick);
    // 如果筛选后的池子是空的，则发出警告并从整个池子中随机选择一个作为后备
    if (filteredPool.length === 0) {
        console.warn(`物品池中没有找到稀有度为 "${rarityToPick}" 的物品。将从所有物品中随机选取一个作为备用。`);
        return itemPool[Math.floor(Math.random() * itemPool.length)];
    }
    // 从筛选后的池子中随机返回一个物品
    return filteredPool[Math.floor(Math.random() * filteredPool.length)];
}

// 随机生成 1 到 6 之间的物品数量
function RandomObjectNumber() {
    let num = Math.floor(Math.random() * 12) + 1;
    return num;
}

function generateAndPlaceItemsSequentially() {
    let placedItems = [];
    let occupied = Array.from({ length: GRID_CONFIG.height }, () => Array(GRID_CONFIG.width).fill(false));
    let itemCount = RandomObjectNumber() + (Math.random() < 0.2 ? 1 : 0);
    let attempts = 0;
    while (placedItems.length < itemCount && attempts < 100) {
        const item = randomItemByRarity();
        if (!item) continue;
        let positionFound = null;
        search: for (let y = 0; y <= GRID_CONFIG.height - item.h; y++) {
            for (let x = 0; x <= GRID_CONFIG.width - item.w; x++) {
                let fits = true;
                for (let dy = 0; dy < item.h; dy++) {
                    for (let dx = 0; dx < item.w; dx++) {
                        if (occupied[y + dy][x + dx]) { fits = false; break; }
                    } if (!fits) break;
                }
                if (fits) { positionFound = { x, y }; break search; }
            }
        }
        if (positionFound) {
            for (let dy = 0; dy < item.h; dy++) {
                for (let dx = 0; dx < item.w; dx++) {
                    occupied[positionFound.y + dy][positionFound.x + dx] = true;
                }
            }
            placedItems.push({ ...item, ...positionFound });
        }
        attempts++;
    }
    placedItems.sort((a, b) => (a.y * GRID_CONFIG.width + a.x) - (b.y * GRID_CONFIG.width + b.x));
    return placedItems;
}

async function revealSingleItem(itemBlock, itemData) {
    const currentRarityConfig = rarityConfig[itemData.rarity];
    itemBlock.classList.add('searching');
    sounds.searching.currentTime = 0;
    sounds.searching.play().catch(e => console.error("搜索音效播放失败:", e));
    await delay(currentRarityConfig.duration);
    sounds.searching.pause();
    sounds.searching.currentTime = 0;

    let soundToPlay;
    if (['yellow', 'red', 'key'].includes(itemData.rarity)) { soundToPlay = sounds.redy; }
    else if (['blue', 'purple'].includes(itemData.rarity)) { soundToPlay = sounds.bluep; }
    else if (itemData.rarity === 'green') { soundToPlay = sounds.green; }

    if (soundToPlay) {
        soundToPlay.currentTime = 0;
        soundToPlay.play().catch(e => console.error("出货音效播放失败:", e));
    }

    if (itemData.rarity === 'yellow' || itemData.rarity === 'red') {
        itemBlock.classList.add(`rarity-${itemData.rarity}`);
    }

    itemBlock.classList.remove('searching');
    itemBlock.style.backgroundImage = `url('${itemData.image}')`;
    itemBlock.style.backgroundPosition = 'center';
    const nameTag = itemBlock.querySelector('.item-name-tag');
    if (nameTag) {
        nameTag.textContent = itemData.name;
        nameTag.classList.add('visible');
    }

    const price = itemData.price || 0;
    const startValue = totalValue;
    totalValue += price;
    animateValueUpdate(startValue, totalValue, 800);
    await delay(0); // 保留短延迟确保搜索过程自然
}

async function startSearch() {
    searchButton.disabled = true;
    statusText.textContent = '正在搜索物资...';

    totalValue = 0;
    totalValueSpan.textContent = '0';

    createBackgroundGrid();
    await delay(800);
    const itemsToReveal = generateAndPlaceItemsSequentially();
    const itemBlocks = [];
    itemsToReveal.forEach(item => {
        const block = document.createElement('div');
        block.className = 'item-block';
        const blockWidth = item.w * GRID_CONFIG.cellWidth + (item.w - 1) * GRID_CONFIG.gap;
        const blockHeight = item.h * GRID_CONFIG.cellHeight + (item.h - 1) * GRID_CONFIG.gap;
        const leftPos = item.x * (GRID_CONFIG.cellWidth + GRID_CONFIG.gap);
        const topPos = item.y * (GRID_CONFIG.cellHeight + GRID_CONFIG.gap);
        block.style.cssText = `width:${blockWidth}px; height:${blockHeight}px; left:${leftPos}px; top:${topPos}px;`;
        const imageName = `./assets/images/unsearch/${item.w}x${item.h}.svg`;
        block.style.backgroundImage = `url('${imageName}')`;
        block.style.backgroundPosition = 'center';
        block.style.backgroundRepeat = 'no-repeat';
        const nameTag = document.createElement('div');
        nameTag.className = 'item-name-tag';
        block.appendChild(nameTag);
        gridContainer.appendChild(block);
        itemBlocks.push(block);
    });
    await delay(1000);
    for (let i = 0; i < itemsToReveal.length; i++) {
        await revealSingleItem(itemBlocks[i], itemsToReveal[i]);
    }
    statusText.textContent = '重型登山包';
    searchButton.disabled = false;
}

function refreshPage() {
    location.reload();
}

searchButton.addEventListener('click', startSearch);
createBackgroundGrid();
initCustomRates(); // 初始化自定义爆率功能
