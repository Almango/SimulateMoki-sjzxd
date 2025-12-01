// 版本号更新功能
function updateVersion() {
    const version = '4.1'; // 设置当前版本号
    const elements = document.querySelectorAll('title, .version-text');
    
    elements.forEach(element => {
        if (element.textContent.includes('{version}')) {
            element.textContent = element.textContent.replace(/\{version\}/g, version);
        }
    });
}
// 页面加载完成后更新版本号
document.addEventListener('DOMContentLoaded', updateVersion);

// ---------- 第 1 步: 获取元素并初始化变量 ----------
const searchButton = document.getElementById('search-btn');
const statusText = document.getElementById('status-text');
const gridContainer = document.getElementById('item-grid-container');
const totalValueSpan = document.getElementById('total-value-span'); // 获取显示总价值的 span

let totalValue = 0; // 用于存储本局总价值
let animationFrameId = null; // 用于存储当前正在运行的动画帧ID
let isSearching = false; // 用于跟踪搜索是否正在进行

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
    yellow: { duration: 2500 }, red: { duration: 2500 },
    //     green: { duration: 0 }, blue: { duration: 0 }, purple: { duration: 0 },
    // yellow: { duration: 0 }, red: { duration: 0 },

    'key-red': { duration: 4500 }, 'key-yellow': { duration: 3500 },     
    'key-purple': { duration: 3000 },'key-blue': { duration: 3000 }, 

};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));



// ---------- 第 2 步: 创建数字滚动动画函数 ----------
function animateValueUpdate(start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const currentAnimatedValue = Math.floor(progress * (end - start) + start);
        
        totalValueSpan.textContent = currentAnimatedValue.toLocaleString();
        
        if (progress < 1) {
            animationFrameId = window.requestAnimationFrame(step);
        }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
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
    
    // 使用自定义爆率（来自custom.js）
    const customRates = window.customRates;
    
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
    let filteredPool;
    if (rarityToPick === 'key') {
        // 如果选择的是钥匙稀有度，筛选出所有类型的钥匙
        filteredPool = itemPool.filter(item => 
            ['key-red', 'key-blue', 'key-purple', 'key-yellow', 'key'].includes(item.rarity)
        );
    } else {
        // 其他稀有度正常筛选
        filteredPool = itemPool.filter(item => item.rarity === rarityToPick);
    }
    
    // 如果筛选后的池子是空的，则发出警告并从整个池子中随机选择一个作为后备
    if (filteredPool.length === 0) {
        console.warn(`物品池中没有找到稀有度为 "${rarityToPick}" 的物品。将从所有物品中随机选取一个作为备用。`);
        return itemPool[Math.floor(Math.random() * itemPool.length)];
    }
    
    // 从筛选后的池子中随机返回一个物品
    return filteredPool[Math.floor(Math.random() * filteredPool.length)];
}

// 随机生成物品数量（使用自定义设置）
function RandomObjectNumber() {
    // 使用自定义的出货数量设置
    const { min, max } = window.itemCountSettings || { min: 3, max: 5 };
    // 生成min到max之间的随机整数（包含min和max）
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    // 检查搜索是否已经停止
    if (!isSearching) {
        totalValue = 0;
        totalValueSpan.textContent = '0';
        return;
    }
    
    const currentRarityConfig = rarityConfig[itemData.rarity];
    itemBlock.classList.add('searching');
    sounds.searching.currentTime = 0;
    sounds.searching.play().catch(e => console.error("搜索音效播放失败:", e));
    await delay(currentRarityConfig.duration);
    
    // 检查搜索是否已经停止
    if (!isSearching) {
        sounds.searching.pause();
        sounds.searching.currentTime = 0;
        totalValue = 0;
        totalValueSpan.textContent = '0';
        return;
    }
    
    sounds.searching.pause();
    sounds.searching.currentTime = 0;

    // 根据物品稀有度选择要播放的音效
    let soundToPlay;
    let rarityClass = null;
    
    // 处理普通物品稀有度
    if (['yellow', 'key-yellow'].includes(itemData.rarity)) {
        soundToPlay = sounds.redy;
        rarityClass = 'yellow';
    } else if (['red', 'key-red'].includes(itemData.rarity)) {
        soundToPlay = sounds.redy;
        rarityClass = 'red';
    } else if (['blue', 'key-blue'].includes(itemData.rarity)) {
        soundToPlay = sounds.bluep;
    } else if (['purple', 'key-purple'].includes(itemData.rarity)) {
        soundToPlay = sounds.bluep;
    } else if (itemData.rarity === 'green') {
        soundToPlay = sounds.green;
    } else if (itemData.rarity === 'key') {
        // 兼容旧的key类型
        soundToPlay = sounds.redy;
        rarityClass = 'red';
    }

    if (soundToPlay) {
        soundToPlay.currentTime = 0;
        soundToPlay.play().catch(e => console.error("出货音效播放失败:", e));
    }

    // 设置物品块样式
    if (rarityClass) {
        itemBlock.classList.add(`rarity-${rarityClass}`);
    }
    itemBlock.classList.remove('searching');
    itemBlock.style.backgroundImage = `url('${itemData.image}')`;
    itemBlock.style.backgroundPosition = 'center';
    
    // 更新物品名称标签
    const nameTag = itemBlock.querySelector('.item-name-tag');
    if (nameTag) {
        nameTag.textContent = itemData.name;
        nameTag.classList.add('visible');
    }

    // 更新总价值
    const price = itemData.price || 0;
    const startValue = totalValue;
    totalValue += price;
    animateValueUpdate(startValue, totalValue, 800);
}

async function startSearch() {
    isSearching = true;
    searchButton.disabled = true;
    statusText.textContent = '正在搜索物资...';
    totalValue = 0;
    totalValueSpan.textContent = '0';

    createBackgroundGrid();
    await delay(800);
    if (!isSearching) return;
    
    const itemsToReveal = generateAndPlaceItemsSequentially();
    const itemBlocks = [];
    
    // 创建所有物品块
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
    if (!isSearching) return;
    
    // 依次揭示所有物品
    for (let i = 0; i < itemsToReveal.length; i++) {
        if (!isSearching) break;
        await revealSingleItem(itemBlocks[i], itemsToReveal[i]);
    }
    
    // 如果搜索没有被中断，重置状态
    if (isSearching) {
        statusText.textContent = '重型登山包';
        searchButton.disabled = false;
        isSearching = false;
    }
}

function refreshPage() {
    // 停止搜索过程
    isSearching = false;
    
    // 停止所有正在播放的音效
    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    
    // 取消正在运行的动画帧
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // 重置游戏状态但保留自定义爆率
    totalValue = 0;
    totalValueSpan.textContent = '0';
    statusText.textContent = '重型登山包';
    createBackgroundGrid();
    searchButton.disabled = false;
    
    // 重新初始化游戏界面
    initCustomRates();
}

searchButton.addEventListener('click', startSearch);
createBackgroundGrid();
initCustomRates(); // 初始化自定义爆率功能
window.updateVersion = updateVersion;
