document.addEventListener('DOMContentLoaded', function() {
    // 初始化日期选择器为当前日期
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('applyDate').value = formattedDate;
    
    // 生成申请单编号
    generateRequisitionNumber();
    
    // 初始化表格数据
    initTableData();
    
    // 绑定全选复选框事件
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#requisitionItems tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // 绑定分页按钮事件
    const prevPageBtn = document.querySelector('.pagination .btn-page:first-child');
    const nextPageBtn = document.querySelector('.pagination .btn-page:last-child');
    
    prevPageBtn.addEventListener('click', function() {
        const currentPage = parseInt(document.getElementById('currentPage').textContent);
        if (currentPage > 1) {
            document.getElementById('currentPage').textContent = currentPage - 1;
            loadTableData(currentPage - 1);
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        const currentPage = parseInt(document.getElementById('currentPage').textContent);
        const totalPages = parseInt(document.getElementById('totalPages').textContent);
        if (currentPage < totalPages) {
            document.getElementById('currentPage').textContent = currentPage + 1;
            loadTableData(currentPage + 1);
        }
    });
    
    // 绑定提交按钮事件
    document.querySelector('.btn-close').addEventListener('click', function() {
        submitForm();
    });
    
    // 绑定上传按钮事件
    document.querySelector('.btn-upload').addEventListener('click', function() {
        // 模拟文件选择
        alert('选择文件');
    });
    
    document.querySelector('.btn-primary').addEventListener('click', function() {
        // 模拟文件上传
        alert('开始上传文件');
    });
    
    // 添加输入框焦点效果
    const inputFields = document.querySelectorAll('input[type="text"], input[type="date"], select');
    inputFields.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // 搜索图标点击事件
    const searchIcons = document.querySelectorAll('.search-icon');
    searchIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            // 这里可以添加搜索或选择逻辑
            alert(`搜索: ${input.placeholder}`);
        });
    });
    
    // 绑定添加行按钮事件
    document.getElementById('addRowBtn').addEventListener('click', function() {
        addNewRow();
    });
    
    // 绑定删除选中行按钮事件
    document.getElementById('deleteRowBtn').addEventListener('click', function() {
        deleteSelectedRows();
    });
});

// 生成申请单编号
function generateRequisitionNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(6, '0');
    
    const requisitionNumber = `CG${year}${month}${day}${random}`;
    document.getElementById('applyNumber').value = requisitionNumber;
}

// 初始化表格数据
function initTableData() {
    // 设置总页数
    const totalPages = Math.ceil(allTableData.length / 10);
    document.getElementById('totalPages').textContent = totalPages || 1;
    
    // 加载第一页数据
    loadTableData(1);
}

// 加载表格数据
// 全局数据存储
let allTableData = generateMockData(1).concat(generateMockData(2), generateMockData(3));

function loadTableData(page) {
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const data = allTableData.slice(startIndex, endIndex);
    
    const tbody = document.querySelector('#requisitionItems tbody');
    tbody.innerHTML = '';
    
    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${item.plannedQuantity}</td>
            <td>${item.actualQuantity}</td>
            <td>${item.purpose}</td>
            <td>${item.specification}</td>
            <td>${item.remark}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // 添加行悬停效果
    addRowHoverEffect();
}

// 生成模拟数据
function generateMockData(page) {
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage + 1;
    
    const mockData = [];
    
    for (let i = 0; i < itemsPerPage; i++) {
        const id = startIndex + i;
        mockData.push({
            id: id,
            name: `办公用品${id}`,
            unit: '个',
            plannedQuantity: Math.floor(Math.random() * 100) + 1,
            actualQuantity: Math.floor(Math.random() * 100) + 1,
            purpose: '日常办公',
            specification: `规格型号${id}`,
            remark: id % 3 === 0 ? '紧急' : ''
        });
    }
    
    return mockData;
}

// 表单验证函数
function validateForm() {
    const requiredFields = [
        'applicant',
        'applyDate',
        'department',
        'requisitionType'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value) {
            isValid = false;
            element.classList.add('error');
            element.parentElement.classList.add('error-field');
        } else {
            element.classList.remove('error');
            element.parentElement.classList.remove('error-field');
        }
    });
    
    return isValid;
}

// 提交表单函数
function submitForm() {
    if (validateForm()) {
        // 这里可以添加表单提交逻辑
        alert('表单提交成功！');
    } else {
        alert('请填写所有必填字段！');
    }
}

// 添加新行
function addNewRow() {
    const tbody = document.querySelector('#requisitionItems tbody');
    const rowCount = tbody.querySelectorAll('tr').length;
    const newId = rowCount + 1;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${newId}</td>
        <td><input type="text" class="table-input" placeholder="请输入物品名称"></td>
        <td><input type="text" class="table-input" placeholder="单位" value="个"></td>
        <td><input type="number" class="table-input" placeholder="计划数量" min="1" value="1"></td>
        <td><input type="number" class="table-input" placeholder="实际数量" min="1" value="1"></td>
        <td><input type="text" class="table-input" placeholder="用途" value="日常办公"></td>
        <td><input type="text" class="table-input" placeholder="规格型号"></td>
        <td><input type="text" class="table-input" placeholder="备注"></td>
    `;
    tbody.appendChild(tr);
    
    // 添加行悬停效果
    addRowHoverEffect();
    
    // 添加输入框焦点效果
    const inputFields = tr.querySelectorAll('input[type="text"], input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// 删除选中行
function deleteSelectedRows() {
    const tbody = document.querySelector('#requisitionItems tbody');
    const checkboxes = tbody.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        alert('请先选择要删除的行！');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${checkboxes.length} 行数据吗？`)) {
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });
        
        // 重新编号
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('td:nth-child(2)').textContent = index + 1;
        });
        
        // 取消全选
        document.getElementById('selectAll').checked = false;
    }
}

// 添加行悬停效果
function addRowHoverEffect() {
    const rows = document.querySelectorAll('#requisitionItems tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseover', function() {
            this.classList.add('highlight');
        });
        
        row.addEventListener('mouseout', function() {
            this.classList.remove('highlight');
        });
    });
}