// 初始化
// 页面对象定义
let tableConfig = {
  // 当前页索引 默认第一页开始
  nowPage: 1,
  // 页面显示条数 默认10条
  pageCount: 10,
  // 总页数
  totalPage: 5,
  // 总条数
  totalNumber: 0,
  // 总内容
  totalArr: {},
  // 当前页内容
  pageArr: {},
  // 总数据过滤开始的位置
  start: 0,
  // 总数据过滤结束的位置
  end: 0,
};
// 隐藏loading
$(".load").hide();

/**
 * 功能描述：启动按钮点击事件 获取数据库数据渲染表格
 * 日期：2022.09.07
 */
$("[name='on']").click(function () {
  // $(".load").show();
  // 清空表格和分页
  removeTable();
  // 向服务端请求表格数据 赋值给页面对象
  // 同步问题https://wenku.baidu.com/view/f580d6015bfb770bf78a6529647d27284b7337a2.html
  tableSelectGet();
  // ？失效 (异步)
  // $(".load").hide();
});

/**
 * 功能描述：关机按钮点击事件 删除表格信息
 * 日期：2022.09.08
 */
$("[name='off']").click(function () {
  // 重置当前页
  tableConfig.nowPage = 1;
  // 清空表格和分页
  removeTable();
});

/**
 * 功能描述：重启按钮点击事件 删除表格后重新进行开机操作
 * 日期：2022.09.08
 */
$("[name='restart']").click(function () {
  // 重置当前页
  tableConfig.nowPage = 1;
  // 清空表格和分页
  removeTable();
  // 向服务端请求表格数据 赋值给页面对象
  tableSelectGet();
});

/**
 * 功能描述：分页事件
 * 日期：2022.09.08
 */
// 页码悬浮更改样式
// https://www.runoob.com/jquery/event-on.html
$(document).on("mouseover", ".pageJumpC>div", function () {
  // 获取元素
  let divs = $(".pageJumpC>div");
  let index = $(this).index();
  // 移除所有页码悬浮样式
  divs.removeClass("pageSelect");
  // 添加当前页码悬浮样式
  divs.eq(index).addClass("pageSelect");
});

// 跳转页码键盘绑定回车事件
$(document).on("keypress", ".pageInputJump", function (e) {
  // 正整数正则表达式
  let intRegExp = /^[1-9][0-9]*$/;
  // 判断输入框内数值是否为正整数
  if (intRegExp.test(e.currentTarget.value)) {
    // 判断输入框内数值是否大于总页数 是则赋值总页数
    if (e.currentTarget.value > tableConfig.totalPage) {
      this.value = tableConfig.totalPage;
      // 判断输入框内数值是否小于0 是则赋值1
    } else if (e.currentTarget.value <= 0) {
      this.value = 1;
    }
  } else {
    this.value = 1;
  }

  // keyCode==13是回车
  if (e.keyCode == 13) {
    // 当前页赋值为输入框值
    tableConfig.nowPage = e.currentTarget.value;
    // 清空表格和分页
    removeTable();
    // 向服务端请求表格数据 赋值给页面对象
    tableSelectGet();
  }
});

// 输入框页码数值改变事件
$(document).on("change", ".pageInputJump", function (e) {
  // 正整数正则表达式
  let intRegExp = /^[1-9][0-9]*$/;
  // 判断输入框内数值是否为正整数 否则赋值1
  if (intRegExp.test(e.currentTarget.value)) {
    // 判断输入框内数值是否大于总页数 是则赋值总页数
    if (e.currentTarget.value > tableConfig.totalPage) {
      this.value = tableConfig.totalPage;
      // 判断输入框内数值是否小于0 是则赋值1
    } else if (e.currentTarget.value <= 0) {
      this.value = 1;
    }
  } else {
    this.value = 1;
  }
});

// 页面跳转左按钮点击事件
$(document).on("click", ".fa-caret-square-o-left", function (e) {
  // 如果当前页为1 则赋值当前页为总页数 否则当前页-1
  if (tableConfig.nowPage == 1) {
    tableConfig.nowPage = tableConfig.totalPage;
    // 清空表格和分页
    removeTable();
    // 向服务端请求表格数据 赋值给页面对象
    tableSelectGet();
  } else {
    tableConfig.nowPage = tableConfig.nowPage - 1;
    // 清空表格和分页
    removeTable();
    // 向服务端请求表格数据 赋值给页面对象
    tableSelectGet();
  }
});

// 页面跳转右按钮点击事件
$(document).on("click", ".fa-caret-square-o-right", function (e) {
  // 如果当前页为总页数 则赋值当前页为1 否则当前页+1
  if (tableConfig.nowPage == tableConfig.totalPage) {
    tableConfig.nowPage = 1;
    // 清空表格和分页
    removeTable();
    // 向服务端请求表格数据 赋值给页面对象
    tableSelectGet();
  } else {
    tableConfig.nowPage = tableConfig.nowPage + 1;
    // 清空表格和分页
    removeTable();
    // 向服务端请求表格数据 赋值给页面对象
    tableSelectGet();
  }
});

// 页码点击事件
$(document).on("click", ".pageJumpC>div", function (e) {
  // 判断当前点击页码是否为... 是则页码输入框获得焦点 否则跳转当前点击页码所在页面
  if (e.currentTarget.innerHTML == "...") {
    $(".pageInputJump").focus();
  } else {
    tableConfig.nowPage = parseInt(e.currentTarget.innerHTML);
    // 清空表格和分页
    removeTable();
    // 向服务端请求表格数据 赋值给页面对象
    tableSelectGet();
  }
});

// // 更多按钮点击事件（弃置）
// $(document).on("click", ".pageMore", function (e) {
//   $(".pageInputJump").focus();
// });

// 表格显示条数改变事件 下拉框
$(document).on("change", "#pageCount", function (e) {
  // console.log(e.currentTarget.value);
  // 当前表格显示条数赋值下拉框条数值
  tableConfig.pageCount = e.currentTarget.value;
  // 改变总页数
  tableConfig.totalPage = Math.ceil(
    tableConfig.totalArr.length / tableConfig.pageCount
  );
  // 清空表格和分页
  removeTable();
  // 向服务端请求表格数据 赋值给页面对象
  tableSelectGet();
});
