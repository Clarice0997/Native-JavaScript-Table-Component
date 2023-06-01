// 网络请求-Jquery GET请求函数 请求表格数据
function tableSelectGet() {
  $.ajax({
    url: "http://localhost:8001/table-GET",
    type: "GET",
    timeout: 3000,
    // 发送请求前执行函数
    beforeSend: function () {
      // 显示loading
      $(".load").show();
      // 禁用所有按钮
      $(".leftContainer button").attr("disabled", true);
    },
    // 错误回调
    error: function (data) {
      console.log(data);
      // 显示表格为空
      $(".empty").show();
      // 隐藏loading
      $(".load").hide();
      alert("数据库连接超时");
    },
    // 成功回调
    success: function (data) {
      // https://www.jianshu.com/p/26aa307ef62c
      $(".empty").hide();
      // 调用执行函数
      loadData(data);
    },
    complete: function () {
      // 恢复按钮
      $(".leftContainer button").attr("disabled", false);
    },
  });
}

// 网络请求-Jquery Post请求函数 复制表格数据插入
function tableCopyPost(data) {
  $.ajax({
    url: "http://localhost:8001/tableCopyPost",
    type: "POST",
    timeout: 3000,
    data: data,
    // beforeSend: function () {
    //   // 禁用所有按钮
    //   $(".leftContainer button").attr("disabled", true);
    // },
    error: function (data) {
      console.log(data);
    },
    success: function (data) {
      console.log(data);
      // 清空表格和分页
      removeTable();
      // 向服务端请求表格数据 赋值给页面对象
      tableSelectGet();
    },
    // （冲突）
    // complete: function () {
    //   // 恢复按钮
    //   $(".leftContainer button").attr("disabled", false);
    // },
  });
}

// 网络请求-Jquery Post请求函数 复制表格数据插入
function tableDeletePost(data) {
  $.ajax({
    url: "http://localhost:8001/tableDeletePost",
    type: "POST",
    timeout: 3000,
    data: data,
    // beforeSend: function () {
    //   // 禁用所有按钮
    //   $(".leftContainer button").attr("disabled", true);
    // },
    error: function (data) {
      console.log(data);
    },
    success: function (data) {
      console.log(data);
      // 清空表格和分页
      removeTable();
      // 向服务端请求表格数据 赋值给页面对象
      tableSelectGet();
    },
    // （冲突）
    // complete: function () {
    //   // 恢复按钮
    //   $(".leftContainer button").attr("disabled", false);
    // },
  });
}
