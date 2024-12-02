let level1Count = 0;
let level1Data = [];
let level2Data = [];
let level3Data = [];

// 默认佣金比例
let level1CommissionRate = 0.1; // 壹级分销商佣金比例
let level2CommissionRate = 0.05; // 贰级分销商佣金比例
let level3CommissionRate = 0.03; // 叁级分销商佣金比例

function addLevel1() {
  level1Count = parseInt(document.getElementById('level1Count').value);
  
  if (level1Count <= 0) {
    alert("请输入有效的壹级分销商数量！");
    return;
  }

  // 初始化数据
  level1Data = [];
  level2Data = [];
  level3Data = [];

  // 创建壹级分销商输入区域
  const level1Section = document.getElementById('level1Section');
  level1Section.innerHTML = '';  // 清空之前的输入框

  for (let i = 0; i < level1Count; i++) {
    const div = document.createElement('div');
    div.classList.add('level1');
    div.innerHTML = `
      <label>壹级分销商 ${i + 1} 贰级分销商数量：</label>
      <input type="number" class="level2CountInput" id="level2Count${i}" min="1" onchange="updateLevel2Inputs(${i})">
      <div id="level2Inputs${i}"></div>
    `;
    level1Section.appendChild(div);

    // 初始化壹级分销商的数据
    level1Data[i] = {
      level2: [],
      totalSales: 0,
      commission: 0,
    };
  }
}

// 更新贰级分销商输入框
function updateLevel2Inputs(level1Index) {
  const level2Count = parseInt(document.getElementById(`level2Count${level1Index}`).value);
  const level2InputsContainer = document.getElementById(`level2Inputs${level1Index}`);
  
  if (level2Count <= 0) {
    alert("请输入有效的贰级分销商数量！");
    return;
  }

  // 清空之前的贰级分销商输入框
  level2InputsContainer.innerHTML = '';

  for (let i = 0; i < level2Count; i++) {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('level2');
    inputDiv.innerHTML = `
      <label>贰级分销商 ${i + 1} 叁级分销商数量：</label>
      <input type="number" class="level3CountInput" id="level3Count${level1Index}_${i}" min="1" onchange="updateLevel3Inputs(${level1Index}, ${i})">
      <div id="level3Inputs${level1Index}_${i}"></div>
    `;
    level2InputsContainer.appendChild(inputDiv);

    // 初始化贰级分销商的数据
    level1Data[level1Index].level2[i] = {
      level3: [],
      totalSales: 0,
      commission: 0,
    };
  }

  // 更新树状图
  updateTreeDisplay();
}

// 更新叁级分销商输入框
function updateLevel3Inputs(level1Index, level2Index) {
  const level3Count = parseInt(document.getElementById(`level3Count${level1Index}_${level2Index}`).value);
  const level3InputsContainer = document.getElementById(`level3Inputs${level1Index}_${level2Index}`);
  
  if (level3Count <= 0) {
    alert("请输入有效的叁级分销商数量！");
    return;
  }

  // 清空之前的叁级分销商输入框
  level3InputsContainer.innerHTML = '';

  for (let i = 0; i < level3Count; i++) {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('level3');
    inputDiv.innerHTML = `
      <label>叁级分销商 ${i + 1} 销售额：</label>
      <input type="number" class="salesInput" id="salesInput${level1Index}_${level2Index}_${i}" onchange="updateSales(${level1Index}, ${level2Index}, ${i})">
    `;
    level3InputsContainer.appendChild(inputDiv);

    // 初始化叁级分销商的数据
    level1Data[level1Index].level2[level2Index].level3[i] = {
      sales: 0,
      commission: 0,
    };
  }

  // 更新树状图
  updateTreeDisplay();
}

// 更新销售额并重新计算佣金
function updateSales(level1Index, level2Index, level3Index) {
  const sales = parseFloat(document.getElementById(`salesInput${level1Index}_${level2Index}_${level3Index}`).value);
  if (isNaN(sales)) return;

  // 更新销售额
  level1Data[level1Index].level2[level2Index].level3[level3Index].sales = sales;

  // 计算叁级分销商的佣金
  const commission = sales * level3CommissionRate;
  level1Data[level1Index].level2[level2Index].level3[level3Index].commission = commission;

  // 更新贰级分销商的佣金
  updateLevel2Commission(level1Index, level2Index);

  // 更新树状图
  updateTreeDisplay();
}

// 更新贰级分销商的佣金
function updateLevel2Commission(level1Index, level2Index) {
  const totalSales = level1Data[level1Index].level2[level2Index].level3.reduce((sum, level3) => sum + level3.sales, 0);
  const level2Commission = totalSales * level2CommissionRate;
  level1Data[level1Index].level2[level2Index].commission = level2Commission;

  // 更新壹级分销商的佣金
  updateLevel1Commission(level1Index);
}

// 更新壹级分销商的佣金
function updateLevel1Commission(level1Index) {
  const totalSales = level1Data[level1Index].level2.reduce((sum, level2) => {
    return sum + level2.level3.reduce((subSum, level3) => subSum + level3.sales, 0);
  }, 0);

  const level1Commission = totalSales * level1CommissionRate;
  level1Data[level1Index].commission = level1Commission;
}

// 更新树状图显示
function updateTreeDisplay() {
  const treeDisplay = document.getElementById('treeDisplay');
  treeDisplay.innerHTML = '';  // 清空之前的树状图
  
  const tree = document.createElement('ul');
  
  // 创建壹级分销商节点
  for (let i = 0; i < level1Data.length; i++) {
    const level1Node = document.createElement('li');
    level1Node.textContent = `壹级分销商 ${i + 1} 佣金: ${level1Data[i].commission.toFixed(2)}`;
    const level2List = document.createElement('ul');

    // 创建贰级分销商节点
    for (let j = 0; j < level1Data[i].level2.length; j++) {
      const level2Node = document.createElement('li');
      level2Node.textContent = `贰级分销商 ${j + 1} 佣金: ${level1Data[i].level2[j].commission.toFixed(2)}`;
      const level3List = document.createElement('ul');

      // 创建叁级分销商节点
      for (let k = 0; k < level1Data[i].level2[j].level3.length; k++) {
        const level3Node = document.createElement('li');
        level3Node.textContent = `叁级分销商 ${k + 1} 佣金: ${level1Data[i].level2[j].level3[k].commission.toFixed(2)}`;
        level3List.appendChild(level3Node);
      }

      level2Node.appendChild(level3List);
      level2List.appendChild(level2Node);
    }

    level1Node.appendChild(level2List);
    tree.appendChild(level1Node);
  }

  // 将生成的树状图添加到页面
  treeDisplay.appendChild(tree);
}

