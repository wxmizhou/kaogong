document.addEventListener('DOMContentLoaded', () => {
    // 加载筛选条件
    const filterData = JSON.parse(localStorage.getItem('customizeFilters') || '{}');
    if (filterData.examType) {
        console.log('加载筛选条件:', filterData);
        // 这里可以根据筛选条件加载对应的数据
        // 例如：调用后端 API 获取符合条件的职位和公告
    }

    // 初始化月份切换
    const timelineMonths = document.querySelectorAll('.timeline-month');
    timelineMonths.forEach(month => {
        month.addEventListener('click', () => {
            // 移除其他月份的active类
            timelineMonths.forEach(m => m.classList.remove('active'));
            // 添加当前月份的active类
            month.classList.add('active');
            // 加载该月份的数据
            loadMonthData(month.textContent.trim(), filterData);
        });
    });

    // 初始化收藏按钮
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            // 更新收藏状态
            updateFavoriteStatus(btn);
        });
    });

    // 初始化搜索功能
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');

    const handleSearch = () => {
        const searchText = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const info = card.querySelector('.card-info').textContent.toLowerCase();
            const tags = card.querySelector('.card-tags').textContent.toLowerCase();
            
            const isMatch = title.includes(searchText) || 
                           info.includes(searchText) || 
                           tags.includes(searchText);
            
            card.style.display = isMatch ? 'block' : 'none';
        });
    };

    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);

    // 激活第一个月份
    if (timelineMonths.length > 0) {
        timelineMonths[0].click();
    }
});

// 加载月份数据的函数
function loadMonthData(monthText, filters = {}) {
    console.log(`加载 ${monthText} 的数据，筛选条件:`, filters);
    // 这里可以添加加载对应月份数据的逻辑
    // 例如：调用后端 API 获取该月份的职位和公告
}

// 更新收藏状态的函数
function updateFavoriteStatus(button) {
    const card = button.closest('.card');
    const cardId = card.dataset.id;
    const isFavorite = button.classList.contains('active');
    
    console.log(`更新卡片 ${cardId} 的收藏状态为: ${isFavorite}`);
    // 这里可以添加更新收藏状态的逻辑
    // 例如：调用后端 API 保存收藏状态
} 