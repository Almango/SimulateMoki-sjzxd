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

const itemPool = [
    // { name: "滤毒罐", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/滤毒罐.png" },
    // { name: "优秀雇员奖杯", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/优秀雇员奖杯.png" },
    // { name: "卫队金扳指", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/卫队金扳指.png" },
    // { name: "渡鸦项坠", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/渡鸦项坠.png" },
    // { name: "海鲜粥罐头", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/海鲜粥罐头.png" },
    // { name: "营养粥罐头", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/营养粥罐头.png" },
    // { name: "明日方舟OST-1", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/营养粥罐头.png" },
    // { name: "三角蚌小珍珠", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/三角蚌小珍珠.png" },
    // { name: "滤毒罐", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/滤毒罐.png" },
    // { name: "手机", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/手机.png" },
    // { name: "镜头", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/镜头.png" },
    // { name: "固体燃料", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/固体燃料.png" },
    // { name: "脑机控制端子", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/脑机控制端子.png" },
    // { name: "纯金打火机", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/纯金打火机.png" },
    // { name: "咖啡", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/咖啡.png" },
    // { name: "血氧仪", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/血氧仪.png" },
    // { name: "静脉定位器", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/静脉定位器.png" },
    // { name: "亮闪闪的海盗金币", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/亮闪闪的海盗金币.png" },
    // { name: "可编程处理器", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/可编程处理器.png" },
    // { name: "数码相机", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/数码相机.png" },
    // { name: "资料：设计图纸", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/资料：设计图纸.png" },
    // { name: "CPU", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/CPU.png" },
    // { name: "高速固态硬盘", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/高速固态硬盘.png" },
    // { name: "阿萨拉特色酒杯", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/阿萨拉特色酒杯.png" },
    // { name: "功绩勋章", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/功绩勋章.png" },
    // { name: "八音盒", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/八音盒.png" },
    // { name: "体内除颤仪", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/体内除颤仪.png" },
    // { name: "心灵感应.魔方", w: 1, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/心灵感应.魔方.png" },

    // { name: "卫星电话", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/卫星电话.png" },
    // { name: "克小圈", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/克小圈.png" },
    // { name: "心脏支架", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/心脏支架.png" },
    // { name: "紫外线灯", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/紫外线灯.png" },
    // { name: "哈夫克机密档案", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/哈夫克机密档案.png" },
    // { name: "“蓝宝石”龙舌兰", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/“蓝宝石”龙舌兰.png" },
    // { name: "盒装挂耳咖啡", w: 1, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/盒装挂耳咖啡.png" },

    // { name: "金枝桂冠", w: 2, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/金枝桂冠.png" },
    // { name: "赛伊德的手弩", w: 2, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/赛伊德的手弩.png" },
    // { name: "军用弹道计算机", w: 2, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/军用弹道计算机.png" },


    // { name: "座钟", w: 2, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/座钟.png" },
    // { name: "单反相机", w: 2, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/单反相机.png" },
    // { name: "军用炸药", w: 2, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/军用炸药.png" },
    // { name: "移动电缆", w: 2, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/移动电缆.png" },
    // { name: "军用望远镜", w: 2, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/军用望远镜.png" },
    // { name: "卫星信号通讯仪器", w: 2, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/卫星信号通讯仪器.png" },

    // { name: "燃料电池", w: 2, h: 3, rarity: "yellow", image: "/assets/images/obj-yellow/燃料电池.png" },


    // { name: "珠宝头冠", w: 3, h: 1, rarity: "yellow", image: "/assets/images/obj-yellow/珠宝头冠.png" },

    // { name: "大型电台", w: 3, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/大型电台.png" },
    // { name: "高级子弹生产零件", w: 3, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/高级子弹生产零件.png" },
    // { name: "本地特色首饰", w: 3, h: 2, rarity: "yellow", image: "/assets/images/obj-yellow/本地特色首饰.png" },

    // { name: "阵列服务器", w: 4, h: 3, rarity: "yellow", image: "/assets/images/obj-yellow/阵列服务器.png" },



    { name: "名贵机械表", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/mgjxb.png" },
    { name: "怀表", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/hb.png" },
    { name: "至纯源石", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/zcys.png" },
    { name: "实验数据", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/sysj.png" },
    { name: "量子存储", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/lzcc.png" },
    { name: "“钻石”鱼子酱", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/zsyzj.png" },
    { name: "万足金条", w: 1, h: 2, rarity: "red", image: "./assets/images/obj-red/wzjt.png" },
    { name: "奥莉薇娅香槟", w: 1, h: 2, rarity: "red", image: "./assets/images/obj-red/xb.png" },
    { name: "高级咖啡豆", w: 1, h: 2, rarity: "red", image: "./assets/images/obj-red/gjkfd.png" },
    { name: "棘龙爪化石", w: 2, h: 1, rarity: "red", image: "./assets/images/obj-red/hs.png" },
    { name: "显卡", w: 2, h: 1, rarity: "red", image: "./assets/images/obj-red/xk.png" },
    { name: "军用控制终端", w: 2, h: 1, rarity: "red", image: "./assets/images/obj-red/jykzzd.png" },
    { name: "“天圆地方”", w: 2, h: 2, rarity: "red", image: "./assets/images/obj-red/tydf.png" },
    { name: "黄金瞪羚", w: 2, h: 2, rarity: "red", image: "./assets/images/obj-red/hjdl.png" },
    { name: "摄影机", w: 2, h: 2, rarity: "red", image: "./assets/images/obj-red/syj.png" },
    { name: "呼吸机", w: 2, h: 2, rarity: "red", image: "./assets/images/obj-red/hxj.png" },
    { name: "强化碳纤维板", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/qhtxwb.png", price: "27847500" },
    { name: "ECMO", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/ECMO.png" },
    { name: "“纵横”", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/zh.png" },
    { name: "复苏呼吸机", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/fshxj.png" },
    { name: "便携军用雷达", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/bxjyld.png" },
    { name: "扫地一体机器人", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/sdjqr.png" },
    { name: "绝密服务器", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/jmfwq.png" },
    { name: "万金泪冠", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/wjlg.png" },
    { name: "主战坦克模型", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/zztkmx.png" },
    { name: "军用炮弹", w: 3, h: 2, rarity: "red", image: "./assets/images/obj-red/jypd.png" },
    { name: "装甲车电池", w: 3, h: 2, rarity: "red", image: "./assets/images/obj-red/zjcdc.png" },
    { name: "步战车模型", w: 3, h: 2, rarity: "red", image: "./assets/images/obj-red/bzcmx.png" },
    { name: "云存储阵列", w: 3, h: 2, rarity: "red", image: "./assets/images/obj-red/ycczl.png" },
    { name: "军用信息终端", w: 3, h: 2, rarity: "red", image: "./assets/images/obj-red/jyxxzd.png" },
    { name: "飞行记录仪", w: 3, h: 2, rarity: "red", image: "./assets/images/obj-red/fxjly.png" },

    { name: "微型反应炉", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/wxfyl.png" },
    { name: "曼德尔超算单元", w: 3, h: 3, rarity: "red", image: "./assets/images/obj-red/mdecsdy.png" },
    { name: "克劳迪乌斯半身像", w: 2, h: 3, rarity: "red", image: "./assets/images/obj-red/bsx.png" },
    { name: "雷斯的留声机", w: 2, h: 3, rarity: "red", image: "/assets/images/obj-red/lsdlsj.png" },
    { name: "医疗机械人", w: 2, h: 3, rarity: "red", image: "./assets/images/obj-red/yljxr.png" },
    { name: "滑膛枪", w: 4, h: 1, rarity: "red", image: "./assets/images/obj-red/htq.png" },
    { name: "高速磁盘阵列", w: 4, h: 3, rarity: "red", image: "./assets/images/obj-red/gscpzl.png" },
    { name: "动力电池组", w: 4, h: 3, rarity: "red", image: "./assets/images/obj-red/dldcz.png" },
    { name: "刀片服务器", w: 3, h: 4, rarity: "red", image: "./assets/images/obj-red/dpfwq.png" },
    { name: "浮力补偿设备", w: 3, h: 4, rarity: "red", image: "./assets/images/obj-red/flbcsb.png" },
    { name: "非洲之心", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/fzzx.png" },
    { name: "海洋之泪", w: 1, h: 1, rarity: "red", image: "./assets/images/obj-red/hyzl.png" },

    { name: "总裁会议室", w: 1, h: 1, rarity: "key", image: "./assets/images/obj-red/zchys.png" },
];

const rarityConfig = {
    green: { duration: 0 }, blue: { duration: 500 }, purple: { duration: 1100 },
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
    let itemCount = 10 + (Math.random() < 0.2 ? 1 : 0); let attempts = 0;
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