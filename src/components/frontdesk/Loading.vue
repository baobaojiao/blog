<template>
    <!-- 加载动画组件 -->
    <div id="zhong">
        <div id="main">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>
<script setup>
</script>
<style  scoped>
#zhong {
    width: 100%;
    display: flex;
    justify-content: center;
}

#main {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    width: 30px;
}

span {
    width: 0.3em;
    height: 1em;
    background-color: #3cefff;
}

span:nth-of-type(1) {
    animation: grow 1s -0.45s ease-in-out infinite;
}

span:nth-of-type(2) {
    animation: grow 1s -0.3s ease-in-out infinite;
}

span:nth-of-type(3) {
    animation: grow 1s -0.15s ease-in-out infinite;
}

span:nth-of-type(4) {
    animation: grow 1s ease-in-out infinite;
}

@keyframes grow {

    0%,
    100% {
        transform: scaleY(1);
    }

    50% {
        transform: scaleY(2);
    }
}
</style>