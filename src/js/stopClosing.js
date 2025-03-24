// 阻止内部的点击事件冒泡
// 配合closeMenu()可控制点击元素内部时元素不关闭
export function handleClickInsideMenu(e) {
    e.stopPropagation();
}