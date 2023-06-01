(function () {
  $.fn.extend({
    colResizAble: function (options) {
      // 参数对象
      let settings = {
        // 是否实时拖拽
        liveDrag: true,
        // 最小宽度限制
        minWidth: 36,
        // 是否只能拖拽表头
        headerOnly: true,
        // 拖拽是否可以改变表格
        changeTable: false,
      };

      // 获取HTML元素
      let $document = $(document) || $(document.body);
      let $table = $(this);
      // 预览线
      let $tableLine = $(".table-line");
      // 拖拽线
      let $resizeLine = $(".resize-line");
      let tableWidth = $table.outerWidth();
      // 最低宽度 最大宽度
      let minWidth = settings.minWidth;
      let maxWidth = 0;
      // 拖拽是否可以改变表格
      let changeTable = settings.changeTable;

      $("th").css("min-width", minWidth);
      // $("th").css("max-width", maxWidth);

      if (changeTable) {
        // 当表格可以改变时，最大宽度没有限制
        maxWidth = Infinity;
      }

      // 拖拽线鼠标按下事件
      $resizeLine.on("mousedown", function (event) {
        // 获取父元素th
        let $parentTh = $(this).parent("th");
        // 获取父元素下一个兄弟元素th
        let $thNext = $parentTh.next("th");

        // 如果不能改变表格
        if (!changeTable) {
          maxWidth = tableWidth - $parentTh.nextAll("th").length * minWidth;
        }

        // 当前列宽
        let thWidth = $parentTh.outerWidth();

        let startX = event.clientX; // 鼠标开始的水平距离
        let moveDis = 0; // 鼠标移动的水平距离
        let lineLeft = 0; // 示意线的定位距离
        let thRightToTableLeftDis = 0; // 鼠标拖拽的单元格的右侧到table的左边框的距离

        // thRightToTableLeftDis加上当前父元素th的宽度
        thRightToTableLeftDis += thWidth;
        // thRightToTableLeftDis加上当前父元素th前所有的th的宽度
        $parentTh.prevAll("th").each(function () {
          thRightToTableLeftDis += $(this).outerWidth();
        });

        // 示意线的定位距离等于当前单元格的右侧到table的左边框的距离
        lineLeft = thRightToTableLeftDis;

        // 设置预览线位置，和对应的拖拽线位置一致
        $tableLine.css("left", lineLeft);
        // 显示隐藏中的预览线
        $tableLine.show();

        // 鼠标移动时计算移动的距离事件
        $document.on("mousemove.colResizAble", function (event) {
          // 移动距离 正往右 负往左
          moveDis = event.clientX - startX;
          // console.log(moveDis);

          // 如果父元素宽度th加上移动距离小于最小宽度 防止越界
          if (thWidth + moveDis <= minWidth) {
            // 重新赋值移动距离等于最小距离-父元素宽度th
            moveDis = minWidth - thWidth;
            // 如果父元素宽度th加上移动距离大于最大宽度
          } else if (thWidth + moveDis >= maxWidth) {
            // 重新赋值移动距离等于最大距离-父元素宽度th
            moveDis = maxWidth - thWidth;
          }
          // 预览线位置
          $tableLine.css("left", lineLeft + moveDis);
        });
        // 鼠标松开事件
        $document.on("mouseup.colResizAble", function () {
          // 新宽度值=父元素th+移动距离
          let newWidth = $parentTh.outerWidth() + moveDis;
          // 设置父元素th的宽度为新宽度值
          $parentTh.outerWidth(newWidth);
          //  下一个th的宽度更改
          $thNext.outerWidth(function (index, value) {
            return value - moveDis;
          });
          if (newWidth < minWidth) {
            // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度
            $parentTh.outerWidth(minWidth);
          } else if (changeTable && newWidth > maxWidth) {
            $parentTh.outerWidth(maxWidth);
          }
          // if (newWidth < $parentTh.outerWidth() || newWidth > $parentTh.outerWidth()) {
          //   // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度   $parentTh.outerWidth(minWidth)
          // }
          if (changeTable) {
            $table.outerWidth(function (index, width) {
              let newTableWidth = width + moveDis;
              return newTableWidth < tableWidth ? tableWidth : newTableWidth;
            });
          }
          // 恢复预览线
          $tableLine.css("left", 0).hide();
          // 删除document上绑定的事件
          $document.off(".colResizAble");
        });
      });
    },
  });
})();
