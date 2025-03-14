document.addEventListener('DOMContentLoaded', function() {
    // 选项卡切换
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            // 移除其他选项卡的激活状态
            tabItems.forEach(item => item.classList.remove('active'));
            // 激活当前选项卡
            this.classList.add('active');
        });
    });

    const filterBtn = document.querySelector('.filter-btn');
    const filterPanel = document.querySelector('.filter-panel');
    const closeFilterBtn = document.querySelector('.close-filter');
    const resetBtn = document.querySelector('.reset-btn');
    const confirmBtn = document.querySelector('.confirm-btn');

    // 展开/收起功能
    const filterSections = document.querySelectorAll('.filter-section');
    filterSections.forEach(section => {
        const header = section.querySelector('h3');
        if (header.querySelector('.arrow')) {
            header.addEventListener('click', function() {
                section.classList.toggle('collapsed');
            });
        }
    });

    // 更新已选择数量
    function updateSelectedCount() {
        const sections = filterPanel.querySelectorAll('.filter-section');
        sections.forEach(section => {
            const checkedCount = section.querySelectorAll('input[type="checkbox"]:checked').length;
            const h3 = section.querySelector('h3');
            h3.setAttribute('data-selected', `${checkedCount}/3`);
        });
    }

    // 地区选择限制
    const MAX_LOCATION_SELECTIONS = 3;
    const locationCheckboxes = filterPanel.querySelectorAll('.filter-section:first-child input[type="checkbox"]');
    
    locationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedLocations = filterPanel.querySelectorAll('.filter-section:first-child input[type="checkbox"]:checked');
            if (checkedLocations.length > MAX_LOCATION_SELECTIONS) {
                this.checked = false;
                alert('最多只能选择3个地区');
            }
            updateSelectedCount();
        });
    });

    // 其他复选框的change事件
    const otherCheckboxes = filterPanel.querySelectorAll('.filter-section:not(:first-child) input[type="checkbox"]');
    otherCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });

    // 打开筛选面板
    filterBtn.addEventListener('click', function() {
        filterPanel.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });

    // 关闭筛选面板
    function closeFilterPanel() {
        filterPanel.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }

    closeFilterBtn.addEventListener('click', closeFilterPanel);

    // 点击面板外部关闭
    filterPanel.addEventListener('click', function(e) {
        if (e.target === filterPanel) {
            closeFilterPanel();
        }
    });

    // 重置筛选条件
    resetBtn.addEventListener('click', function() {
        const checkboxes = filterPanel.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSelectedCount();
    });

    // 确认筛选
    confirmBtn.addEventListener('click', function() {
        const selectedFilters = {
            location: [],
            exam: [],
            status: []
        };

        // 收集选中的筛选条件
        const checkboxes = filterPanel.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const value = checkbox.value;
            if (['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'].includes(value)) {
                selectedFilters.location.push(value);
            } else if (['全部', '公务员', '事业单位', '教师', '招警', '选调', '遴选', '大学生村官', '三支一扶', '银行', '农信社', '国企', '医疗', '派遣/临时'].includes(value)) {
                selectedFilters.exam.push(value);
            } else if (['全部', '即将报名', '正在报名', '报名结束'].includes(value)) {
                selectedFilters.status.push(value);
            }
        });

        // 这里可以添加筛选逻辑
        console.log('选中的筛选条件：', selectedFilters);
        
        // 关闭面板
        closeFilterPanel();
    });
});

// 当前显示的卡片数量
let currentDisplayCount = 0;
const ITEMS_PER_PAGE = 5;

// 获取所有职位卡片
const jobItems = document.querySelectorAll('.job-item');
const jobList = document.querySelector('.job-list');

// 初始化显示
function initializeDisplay() {
    // 先隐藏所有卡片
    jobItems.forEach(item => item.style.display = 'none');
    // 显示前3个
    showNextItems();
}

// 显示下一批卡片
function showNextItems() {
    for (let i = currentDisplayCount; i < Math.min(currentDisplayCount + ITEMS_PER_PAGE, jobItems.length); i++) {
        jobItems[i].style.display = 'block';
    }
    currentDisplayCount = Math.min(currentDisplayCount + ITEMS_PER_PAGE, jobItems.length);
}

// 检查是否需要加载更多
function checkForMoreContent() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition + windowHeight >= documentHeight - 100 && currentDisplayCount < jobItems.length) {
        showNextItems();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', initializeDisplay);

// 监听滚动事件
let isScrolling;
window.addEventListener('scroll', () => {
    // 防抖处理
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        checkForMoreContent();
    }, 100);
});

// 专业列表数据（示例数据）
const majors = [
    "计算机科学与技术", "软件工程", "信息管理与信息系统", "工商管理", 
    "会计学", "金融学", "经济学", "法学", "汉语言文学", "英语", 
    "新闻学", "广告学", "行政管理", "人力资源管理", "数学", "物理学",
    "化学", "生物科学", "机械工程", "电气工程", "土木工程", "建筑学",
    "医学", "护理学", "药学", "心理学", "教育学", "社会学"
];

// 初始化专业搜索
function initMajorSearch() {
    const majorSearchInput = document.querySelector('.major-search-input');
    const majorList = document.querySelector('.major-list');
    const selectedMajorsContainer = document.querySelector('.selected-majors');
    let selectedMajors = new Set();

    // 搜索输入事件
    majorSearchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.trim().toLowerCase();
        if (searchText === '') {
            majorList.classList.remove('active');
            return;
        }

        const filteredMajors = majors.filter(major => 
            major.toLowerCase().includes(searchText)
        );

        if (filteredMajors.length > 0) {
            renderMajorList(filteredMajors);
            majorList.classList.add('active');
        } else {
            majorList.classList.remove('active');
        }
    });

    // 渲染专业列表
    function renderMajorList(majorsList) {
        majorList.innerHTML = majorsList.map(major => `
            <label class="${selectedMajors.has(major) ? 'selected' : ''}">
                <input type="checkbox" value="${major}" ${selectedMajors.has(major) ? 'checked' : ''}>
                <span>${major}</span>
            </label>
        `).join('');

        // 添加点击事件
        majorList.querySelectorAll('label').forEach(label => {
            label.addEventListener('click', (e) => {
                const major = label.querySelector('input').value;
                if (selectedMajors.has(major)) {
                    removeMajor(major);
                } else if (selectedMajors.size < 3) {
                    addMajor(major);
                } else {
                    e.preventDefault();
                    alert('最多只能选择3个专业');
                }
            });
        });
    }

    // 添加专业
    function addMajor(major) {
        selectedMajors.add(major);
        updateSelectedMajors();
        majorSearchInput.value = '';
        majorList.classList.remove('active');
    }

    // 移除专业
    function removeMajor(major) {
        selectedMajors.delete(major);
        updateSelectedMajors();
    }

    // 更新已选专业显示
    function updateSelectedMajors() {
        selectedMajorsContainer.innerHTML = Array.from(selectedMajors).map(major => `
            <span class="selected-major-tag">
                ${major}
                <span class="remove-tag" data-major="${major}">×</span>
            </span>
        `).join('');

        // 添加移除标签的点击事件
        selectedMajorsContainer.querySelectorAll('.remove-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                const major = e.target.dataset.major;
                removeMajor(major);
            });
        });
    }

    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.major-search') && !e.target.closest('.major-list')) {
            majorList.classList.remove('active');
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initMajorSearch();
    // ... 其他初始化代码 ...
});

// 添加搜索功能
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-btn');

// 更新搜索结果数量
function updateSearchCount() {
    const searchText = searchInput.value.trim().toLowerCase();
    const jobItems = document.querySelectorAll('.job-item');
    const announcementItems = document.querySelectorAll('.announcement-item');
    
    // 生成随机数（1-99之间）
    const getRandomCount = () => Math.floor(Math.random() * 99) + 1;
    
    let jobCount = getRandomCount();
    let announcementCount = getRandomCount();
    
    // 更新数量图标
    const jobCountBadge = document.querySelector('[data-tab="jobs"] .count-badge');
    const announcementCountBadge = document.querySelector('[data-tab="announcements"] .count-badge');
    
    if (searchText) {
        jobCountBadge.style.display = 'flex';
        announcementCountBadge.style.display = 'flex';
        jobCountBadge.textContent = jobCount;
        announcementCountBadge.textContent = announcementCount;
    } else {
        jobCountBadge.style.display = 'none';
        announcementCountBadge.style.display = 'none';
    }
}

// 添加搜索输入事件监听
searchInput.addEventListener('input', updateSearchCount);

// 添加搜索按钮点击事件
searchBtn.addEventListener('click', () => {
    updateSearchCount();
});

// 添加回车键搜索
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateSearchCount();
    }
}); 