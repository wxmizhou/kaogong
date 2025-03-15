document.addEventListener('DOMContentLoaded', function() {
    // 选项卡切换
    const tabItems = document.querySelectorAll('.tab-nav .tab-item');
    const tabLine = document.querySelector('.tab-line');
    let announcementsList = document.querySelector('.announcements-list');
    let positionsList = document.querySelector('.positions-list');
    let customizeContent = document.querySelector('.customize-content');
    let jobList = document.querySelector('.job-list');
    
    tabItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            
            // 更新选项卡状态
            tabItems.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            
            // 更新底部线条位置
            tabLine.classList.toggle('jobs', tab === 'jobs');
            
            // 更新列表显示
            if (tab === 'announcements') {
                announcementsList.style.display = 'block';
                positionsList.style.display = 'none';
                customizeContent.style.display = 'none';
            } else {
                announcementsList.style.display = 'none';
                positionsList.style.display = 'block';
                customizeContent.style.display = 'none';
            }
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

    // 收藏功能
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }

    // 添加公告卡片点击事件
    const jobItems = document.querySelectorAll('.job-item');
    jobItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 获取当前公告的ID（从data属性中获取）
            const announcementId = this.dataset.id;
            
            // 跳转到详情页并传递ID参数
            window.location.href = `announcement-detail.html?id=${announcementId}`;
        });
    });

    // 标签切换功能
    const tabs = document.querySelectorAll('.detail-tabs .tab-item');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有标签的激活状态
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');
            
            // 激活当前标签
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab') + '-content';
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // 初始化岗位列表点击事件
    const positionItems = document.querySelectorAll('.position-item');
    if (!positionItems || positionItems.length === 0) return;

    positionItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.position-title').textContent;
            const department = this.querySelector('.position-department').textContent;
            const positionId = this.dataset.id || '1'; // 使用数据属性获取岗位ID，如果没有则使用默认值
            
            // 跳转到岗位详情页
            window.location.href = `position-detail.html?id=${positionId}&title=${encodeURIComponent(title)}&department=${encodeURIComponent(department)}`;
        });
    });

    // 底部导航栏处理
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const mainContent = document.querySelector('.container > main');
    const header = document.querySelector('.header');

    navItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有导航项的激活状态
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 激活当前点击的导航项
            this.classList.add('active');
            
            // 根据点击的导航项显示相应内容
            const text = this.querySelector('span').textContent;
            console.log('点击的导航项：', text);

            if (text === '定制') {
                // 隐藏主内容和头部
                mainContent.style.display = 'none';
                header.style.display = 'none';
                // 显示定制表单
                customizeContent.style.display = 'block';
                console.log('显示定制表单');
                // 初始化定制表单
                initCustomizeForm();
            } else if (text === '岗位') {
                // 显示主内容和头部
                mainContent.style.display = 'block';
                header.style.display = 'block';
                // 隐藏定制表单
                customizeContent.style.display = 'none';
                console.log('显示岗位列表');
            }
        });
    });
});

// 当前显示的卡片数量
let currentDisplayCount = 0;
const ITEMS_PER_PAGE = 5;

// 获取所有职位卡片
const jobItems = document.querySelectorAll('.job-item');
let jobList = document.querySelector('.job-list');

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

// 省份和专业数据
const provinces = [
    '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省',
    '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省',
    '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省',
    '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省',
    '青海省', '宁夏回族自治区', '新疆维吾尔自治区'
];

const majors = [
    '计算机科学与技术', '软件工程', '信息工程', '电子信息工程', '通信工程',
    '机械工程', '自动化', '电气工程', '土木工程', '建筑学', '工商管理',
    '会计学', '金融学', '经济学', '法学', '中国语言文学', '英语', '日语',
    '数学', '物理学', '化学', '生物科学', '医学', '护理学', '药学',
    '教育学', '心理学', '新闻学', '广告学', '艺术设计'
];

// 初始化多选下拉菜单
function initMultiSelect(wrapper, options, maxSelect = 3) {
    const selectedOptions = wrapper.querySelector('.selected-options');
    const dropdown = wrapper.querySelector('.options-dropdown');
    const optionsList = wrapper.querySelector('.options-list');
    const searchInput = wrapper.querySelector('.search-input');
    const selectedValues = new Set();

    // 渲染选项
    function renderOptions(items) {
        optionsList.innerHTML = items.map(item => `
            <div class="option-item ${selectedValues.has(item) ? 'selected' : ''}" data-value="${item}">
                ${item}
            </div>
        `).join('');
    }

    // 更新已选项显示
    function updateSelectedDisplay() {
        if (selectedValues.size === 0) {
            selectedOptions.innerHTML = '<div class="placeholder">请选择</div>';
        } else {
            selectedOptions.innerHTML = Array.from(selectedValues).map(value => `
                <div class="selected-tag">
                    ${value}
                    <svg class="remove" viewBox="0 0 24 24" data-value="${value}">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </div>
            `).join('');
        }
    }

    // 初始化
    renderOptions(options);
    updateSelectedDisplay();

    // 点击显示/隐藏下拉框
    selectedOptions.addEventListener('click', () => {
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = options.filter(item => 
            item.toLowerCase().includes(value)
        );
        renderOptions(filtered);
    });

    // 选项点击事件
    optionsList.addEventListener('click', (e) => {
        const item = e.target.closest('.option-item');
        if (!item) return;

        const value = item.dataset.value;
        if (selectedValues.has(value)) {
            selectedValues.delete(value);
        } else {
            if (selectedValues.size >= maxSelect) {
                alert(`最多只能选择${maxSelect}项`);
                return;
            }
            selectedValues.add(value);
        }
        
        renderOptions(options);
        updateSelectedDisplay();
    });

    // 删除已选项
    selectedOptions.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove');
        if (!removeBtn) return;

        const value = removeBtn.dataset.value;
        selectedValues.delete(value);
        renderOptions(options);
        updateSelectedDisplay();
    });

    // 点击外部关闭下拉框
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    return {
        getSelected: () => Array.from(selectedValues)
    };
}

// 初始化定制表单
function initCustomizeForm() {
    const form = document.querySelector('.customize-form');
    if (!form) return;

    const provinceSelect = initMultiSelect(
        form.querySelector('.province-select'),
        provinces
    );

    const majorSelect = initMultiSelect(
        form.querySelector('.major-select'),
        majors
    );

    const submitBtn = form.querySelector('.customize-submit');
    submitBtn.addEventListener('click', () => {
        const examType = form.querySelector('[name="exam-type"]').value;
        const education = form.querySelector('[name="education"]').value;
        const selectedProvinces = provinceSelect.getSelected();
        const selectedMajors = majorSelect.getSelected();

        if (!examType) {
            alert('请选择考试类型');
            return;
        }
        if (!education) {
            alert('请选择学历要求');
            return;
        }
        if (selectedProvinces.length === 0) {
            alert('请选择意向省份');
            return;
        }
        if (selectedMajors.length === 0) {
            alert('请选择专业要求');
            return;
        }

        console.log('提交的数据:', {
            examType,
            education,
            provinces: selectedProvinces,
            majors: selectedMajors
        });

        alert('定制成功！我们会根据您的选择为您推送合适的职位。');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initCustomizeForm();
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

// 添加获取URL参数的工具函数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}

// 在详情页加载时获取并显示对应的公告内容
if (window.location.pathname.includes('announcement-detail.html')) {
    const params = getUrlParams();
    const announcementId = params.id;
    
    // 根据ID加载对应的公告内容
    function loadAnnouncementDetail(id) {
        // 这里模拟从后端获取数据
        // 实际项目中，这里应该调用后端API获取数据
        const mockData = {
            title: `公告标题 - ${id}`,
            meta: {
                location: '湖北',
                type: '教师',
                education: '本科',
                count: '23人'
            },
            signupTime: {
                start: '2025年3月15日',
                end: '2025年3月25日'
            },
            content: [
                '根据湖北省教育厅关于2025年度教师招聘工作的统一部署，现面向全国公开招聘教师岗位23名。本次招聘坚持公开、公平、公正的原则，按照规定的程序和办法组织实施。',
                '招聘对象为全日制普通高等院校本科及以上学历毕业生，年龄在35周岁以下（1990年3月15日后出生），具有教师资格证或承诺在入职前取得教师资格证。特别优秀的应届毕业生可适当放宽条件。',
                '本次招聘采取网上报名方式，考试分为笔试和面试两个环节。笔试内容包括教育理论基础知识、教育教学能力、综合素质等方面。面试采用试讲、答辩相结合的方式，重点考察应聘者的教学设计能力、课堂教学能力、语言表达能力等专业素质。',
                '工作地点主要分布在省内重点城市的优质学校，薪资待遇按照事业单位标准执行，享受五险一金等福利待遇。我们期待优秀的教育人才加入，共同为湖北省基础教育事业发展贡献力量。'
            ]
        };

        // 更新页面内容
        document.querySelector('.detail-title').textContent = mockData.title;
        
        // 更新元信息
        const metaHtml = Object.values(mockData.meta).map(value => `<span>${value}</span>`).join('');
        document.querySelector('.detail-meta').innerHTML = metaHtml;
        
        // 更新报名时间
        document.querySelector('.signup-info .time').textContent = 
            `${mockData.signupTime.start} ~ ${mockData.signupTime.end}`;
        
        // 更新正文内容
        document.querySelector('.detail-content').innerHTML = 
            mockData.content.map(paragraph => `<p>${paragraph}</p>`).join('');
    }

    // 加载公告详情
    if (announcementId) {
        loadAnnouncementDetail(announcementId);
    }
}

// 初始化公告详情页的标签切换
function initDetailTabs() {
    const detailTabs = document.querySelectorAll('.detail-tabs .tab-item');
    const detailContents = document.querySelectorAll('.tab-content');
    const positionsCount = document.querySelector('.positions-count');

    if (!detailTabs || detailTabs.length === 0) return;

    // 获取岗位列表中的实际数量并显示
    const positionItems = document.querySelectorAll('.position-item');
    if (positionsCount && positionItems) {
        const count = positionItems.length;
        positionsCount.textContent = count;
        positionsCount.style.display = count > 0 ? 'flex' : 'none';
    }

    detailTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 移除所有标签的激活状态
            detailTabs.forEach(t => t.classList.remove('active'));
            detailContents.forEach(c => c.style.display = 'none');
            
            // 激活当前标签
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab') + '-content';
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
}

// 初始化收藏按钮
function initFavoriteButton() {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
        });
    }
}

// 在详情页加载时获取并显示对应的岗位内容
if (window.location.pathname.includes('position-detail.html')) {
    const params = getUrlParams();
    const positionId = params.id;
    const title = params.title;
    const department = params.department;
    
    // 根据ID加载对应的岗位内容
    function loadPositionDetail(id, title, department) {
        // 这里模拟从后端获取数据
        // 实际项目中，这里应该调用后端API获取数据
        const mockData = {
            title: title || '小学语文教师',
            code: `2024${id.padStart(3, '0')}`,
            department: department || '武汉市洪山区教育局',
            count: '5人',
            time: {
                start: '2024年3月15日 09:00',
                end: '2024年3月25日 18:00'
            },
            requirements: {
                education: ['全日制本科及以上学历', '需具有教育部门认证的学历学位证书'],
                major: ['汉语言文学（必需）', '相近专业：中国语言文学、语文教育'],
                age: ['35周岁以下（1989年3月15日后出生）', '应届毕业生放宽至40周岁']
            },
            jobInfo: {
                unit: ['武汉市洪山区第一小学', '单位地址：武汉市洪山区珞瑜路123号'],
                responsibilities: [
                    '1. 承担小学语文学科教学工作',
                    '2. 参与学校教研活动，开展课程研究',
                    '3. 配合做好班主任工作',
                    '4. 完成学校交办的其他工作'
                ],
                contact: [
                    '联系人：张老师',
                    '联系电话：027-12345678',
                    '工作时间：周一至周五 9:00-17:00'
                ]
            }
        };

        // 更新页面内容
        document.querySelector('.position-title').textContent = mockData.title;
        document.querySelector('.position-code').textContent = `岗位代码：${mockData.code}`;
        
        // 更新核心信息
        document.querySelector('.meta-item:nth-child(1) .meta-value').textContent = mockData.count;
        document.querySelector('.meta-item:nth-child(2) .meta-value').textContent = mockData.department;
        document.querySelector('.meta-item.full-width .meta-value').textContent = 
            `${mockData.time.start} - ${mockData.time.end}`;
    }

    // 加载岗位详情
    if (positionId) {
        loadPositionDetail(positionId, title, department);
    }
} 