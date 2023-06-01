// 加载异步数据 执行函数
function loadData(data) {
  // 赋值
  tableConfig.totalArr = data;
  tableConfig.totalNumber = tableConfig.totalArr.length;
  // 调用动态渲染表格函数
  addTable(tableConfig.totalArr, tableConfig.nowPage, tableConfig.pageCount);
  // 调用分页生成函数
  addPage(tableConfig.totalArr.length, tableConfig.pageCount);
}

// 删除表格函数
function removeTable() {
  // 清空表格
  $("tbody").empty();
  $(".empty").hide();
  $(".pageContainer").empty();
}

// 动态渲染表格函数
/**
 * @param {tableConfig.totalArr} arr 渲染数据
 * @param {tableConfig.nowPage} nowPage 当前页
 * @param {tableConfig.pageCount} pageCount 每页显示条数
 */
function addTable(arr, nowPage, pageCount) {
  // 清空表格内容
  $("tbody").html("");
  // 定义渲染字符串
  let temp = "";
  // 数据开始的位置和结束的位置
  // 规则：（当前页数-1）*每页显示几条数据<**当前页的数据**<当前页*每页显示几条数据
  tableConfig.start = (nowPage - 1) * pageCount;
  tableConfig.end = nowPage * pageCount;

  // 过滤数据得到当前页数据
  tableConfig.pageArr = arr.filter((item, index) => {
    // 返回符合条件的值作为pageArr数组的值
    return index >= tableConfig.start && index < tableConfig.end;
  });

  // 循环数据添加到渲染字符串中
  tableConfig.pageArr.forEach((item) => {
    // console.log(Object.values(item));
    temp += `<tr><td class='select'><input type='checkbox'></td><td>${
      item.id
    }</td><td>${item.title}</td><td><img src="${
      item.status ? "./img/成功.png" : "./img/失败.png"
    }"></td><td>${item.username}</td><td>${
      item.date.split("T")[0]
    }</td><td><div class='methods'><a href='javascript:void(0)' name='edit'>编辑</a><div></div><a href='javascript:void(0)' name='copy'>复制</a><div></div><a href='javascript:void(0)' name='del'>删除</a></div></td></tr>`;
  });

  // 渲染HTML
  $("tbody").append(temp);
  // 隐藏loading
  $(".load").hide();

  // console.log(tableConfig);
}

// 分页生成函数
/**
 * @param {tableConfig.totalArr.length} length 总条数
 * @param {tableConfig.pageCount} count 页面显示条数
 */
function addPage(length, count) {
  // 清空分页容器
  $(".pageContainer").empty();
  // 总页数计算 向上取整
  tableConfig.totalPage = Math.ceil(length / count);
  // 总条数计算
  tableConfig.totalNumber = length;
  // 定义分页数
  let pageEach = '<div class="pageSelect">1</div>';
  // 判断页面数量赋值分页数
  if (tableConfig.totalPage <= 6) {
    let i = "<div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>";
    pageEach += i;
  } else {
    let i = `<div>2</div><div>3</div><div>4</div><div>5</div><div class='pageMore'>...</div><div>${tableConfig.totalPage}</div>`;
    pageEach += i;
  }
  // 定义模板
  let temp = `<div class='pageCountC'><select id='pageCount'><option value='10'>10条/页</option><option value='15'>15条/页</option><option value='20'>20条/页</option><option value='25'>25条/页</option></select></div><div class='pageJump'><i class='fa fa-caret-square-o-left fa-lg'></i><div class='pageJumpC'>${pageEach}</div><i class='fa fa-caret-square-o-right fa-lg'></i><span>跳至</span><input type='text' class='pageInputJump' value='${tableConfig.nowPage}' maxlength='3'><span>页</span></div><div class='pageNum'><span>1-${tableConfig.totalPage}页 &nbsp;&nbsp;共${tableConfig.totalNumber}项</span></div>`;
  // 插入HTML
  $(".pageContainer").append(temp);
  // 删除所有option的选中属性
  $("option").removeAttr("selected");
  // 默认选中当前页面显示条数
  // console.log($(`[value=${tableConfig.pageCount}]`));
  $(`[value=${tableConfig.pageCount}]`).attr("selected", "selected");
}

/**
 * 功能描述：表格绑定拖拽宽度函数
 * 日期：2022.09.07
 */
// 表格绑定拖拽宽度函数
$("table").colResizAble();

/**
 * 功能描述：复选框全选和反选
 * 日期：2022.09.08
 */
// 全选复选框点击事件
$(".selectAll>input").click(function () {
  // 选中则所有复选框选中
  // 切换选中样式
  if (this.checked) {
    $.each($(".select>input"), function (index, value) {
      value.checked = true;
      $("tbody>tr").addClass("selectStyle");
    });
  } else {
    // 否则所有复选框补选中
    // 清除选中样式
    $.each($(".select>input"), function (index, value) {
      value.checked = false;
      $("tbody>tr").removeClass("selectStyle");
    });
  }
});

/**
 * 功能描述：普通复选框选择
 * 日期：2022.09.08
 */
$(document).on("click", ".select>input", function (e) {
  let inputs = $(".select>input");
  // 当前复选框索引
  let index = $(this).parent().parent().index();
  // 全选索引
  let i = 1;
  // 判断当前复选框是否选择 选中则选中全选复选框
  if (inputs[index].checked) {
    // 选中的列更改样式
    $("tbody>tr").eq(index).addClass("selectStyle");
    // 全选复选框选中
    $(".selectAll>input")[0].checked = true;
  } else {
    // 非选中的列清除样式
    $("tbody>tr").eq(index).removeClass("selectStyle");
    // 判断是否存在复选框选中 没有则取消全选复选框选中
    $.each(inputs, function (index, value) {
      if (value.checked) i = 0;
    });
    if (i) $(".selectAll>input")[0].checked = false;
  }
  // console.log(inputs[index].checked);
  // console.log($(this).parent().parent().index());
});

/**
 * 功能描述：表格复制按钮点击事件 向数据库传入数据 表格重新渲染
 * 日期：2022.09.08
 */
$(document).on("click", "[name='copy']", function (e) {
  // 当前索引
  let index = $(this).parent().parent().parent().index();
  // 当前表格对象
  let temp = tableConfig.pageArr[index];

  // 数据库操作插入复制
  tableCopyPost(temp);
});

/**
 * 功能描述：表格删除按钮点击事件 删除数据库中数据 表格重新渲染
 * 日期：2022.09.09
 */
$(document).on("click", "[name='del']", function (e) {
  // 当前索引
  let index = $(this).parent().parent().parent().index();
  // 当前表格对象
  let temp = tableConfig.pageArr[index];

  // 数据库删除操作
  tableDeletePost(temp);
});
