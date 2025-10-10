const searchButton = document.getElementById('search-btn');
const statusText = document.getElementById('status-text');
const gridContainer = document.getElementById('item-grid-container');

const sounds = {
    searching: new Audio("./assets/video/founding.mp3"), // 'founding.mp3' in your folder
    green: new Audio("./assets/video/green.mp3"),
    bluep: new Audio("./assets/video/bluep.mp3"),
    redy: new Audio("./assets/video/redy.mp3")
};

// V3.1 修改：循环播放搜索音效
sounds.searching.loop = true;

Object.values(sounds).forEach(sound => sound.load());

const GRID_CONFIG = { width: 5, height: 9, cellWidth: 60, cellHeight: 60, gap: 0 };

// const itemPool = [
    
// ];

const rarityConfig = {
    green: { duration: 0 }, blue: { duration: 1000 }, purple: { duration: 2000 },
    yellow: { duration: 2500 }, red: { duration: 2500 },key:{ duration: 4000 }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function createBackgroundGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_CONFIG.width * GRID_CONFIG.height; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
    }
}

function randomItemByRarity() {
    let poolWithDefaults = [...itemPool,
        // { name: "打火机", w: 1, h: 1, rarity: "green", image: "打火机.png", price: 100},
        // { name: "U盘", w: 1, h: 1, rarity: "blue", image: "望远镜.png", price: 2000}
    ];
    const rand = Math.random();
    let filteredPool;
    if (rand < 0.05) filteredPool = poolWithDefaults.filter(item => item.rarity === "red");
    else if (rand < 0.15) filteredPool = poolWithDefaults.filter(item => item.rarity === "yellow");
    else if (rand < 0.35) filteredPool = poolWithDefaults.filter(item => item.rarity === "purple");
    else if (rand < 0.65) filteredPool = poolWithDefaults.filter(item => item.rarity === "blue");
    else filteredPool = poolWithDefaults.filter(item => item.rarity === "green");
    if (filteredPool.length === 0) {
        return poolWithDefaults[Math.floor(Math.random() * poolWithDefaults.length)];
    }
    return filteredPool[Math.floor(Math.random() * filteredPool.length)];
}

function generateAndPlaceItemsSequentially() {
    let placedItems = []; let occupied = Array.from({ length: GRID_CONFIG.height }, () => Array(GRID_CONFIG.width).fill(false));
    let itemCount = 5 + (Math.random() < 0.2 ? 1 : 0); let attempts = 0;
    while (placedItems.length < itemCount && attempts < 100) {
        const item = randomItemByRarity(); let positionFound = null;
        search: for (let y = 0; y <= GRID_CONFIG.height - item.h; y++) {
            for (let x = 0; x <= GRID_CONFIG.width - item.w; x++) {
                let fits = true;
                for (let dy = 0; dy < item.h; dy++) { for (let dx = 0; dx < item.w; dx++) { if (occupied[y + dy][x + dx]) { fits = false; break; } } if (!fits) break; }
                if (fits) { positionFound = { x, y }; break search; }
            }
        }
        if (positionFound) {
            for (let dy = 0; dy < item.h; dy++) { for (let dx = 0; dx < item.w; dx++) { occupied[positionFound.y + dy][positionFound.x + dx] = true; } }
            placedItems.push({ ...item, ...positionFound });
        }
        attempts++;
    }
    placedItems.sort((a, b) => (a.y * GRID_CONFIG.width + a.x) - (b.y * GRID_CONFIG.width + b.x)); return placedItems;
}

async function revealSingleItem(itemBlock, itemData) {
    const currentRarityConfig = rarityConfig[itemData.rarity];

    itemBlock.classList.add('searching');
    statusText.textContent = `正在搜索物资...`;
    sounds.searching.currentTime = 0; // 重置以防万一
    sounds.searching.play().catch(e => console.error("搜索音效播放失败:", e));

    await delay(currentRarityConfig.duration);

    // V3.1 修改：在播放新音效前，立刻停止并重置搜索音效
    sounds.searching.pause();
    sounds.searching.currentTime = 0;

    let soundToPlay;
    if (itemData.rarity === 'green') {
        soundToPlay = sounds.green;
    } else if (itemData.rarity === 'blue' || itemData.rarity === 'purple') {
        soundToPlay = sounds.bluep;
    } else if (itemData.rarity === 'yellow' || itemData.rarity === 'red' || itemData.rarity === 'key') {
        soundToPlay = sounds.redy;
    }
    if (soundToPlay) {
        soundToPlay.currentTime = 0;
        soundToPlay.play().catch(e => console.error("出货音效播放失败:", e));
    }

    if (itemData.rarity === 'yellow' || itemData.rarity === 'red') {
        itemBlock.classList.add(`rarity-${itemData.rarity}`);
    }

    itemBlock.classList.remove('searching');
    itemBlock.style.backgroundImage = `url('./${itemData.image}')`;
    itemBlock.style.backgroundPosition = 'center';
    const nameTag = itemBlock.querySelector('.item-name-tag');
    if (nameTag) {
        nameTag.textContent = itemData.name;
        nameTag.classList.add('visible');
    }

    await delay(1200);
}

async function startSearch() {
    searchButton.disabled = true;
    statusText.textContent = '正在搜索物资...';
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
        block.style.width = `${blockWidth}px`;
        block.style.height = `${blockHeight}px`;
        block.style.left = `${leftPos}px`;
        block.style.top = `${topPos}px`;
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
// 普通刷新（可能使用缓存）
function refreshPage() {
    location.reload();
}

searchButton.addEventListener('click', startSearch);
createBackgroundGrid();