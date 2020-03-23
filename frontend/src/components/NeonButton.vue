<template>
    <router-link tag="a" :to="route ? route : $route">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <slot/>
    </router-link>
</template>

<script>
    export default {
        name: "NeonButton",
        props: ['route']
    }
</script>

<style scoped lang="scss">
    a{
        color: #03E9F4;
        display: inline-block;
        font-size: 16px;
        letter-spacing: 4px;
        margin: 20px 40px;
        padding: 24px 30px;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        text-transform: uppercase;
        transition: 0.5s;
        -webkit-box-reflect: below 1px linear-gradient(transparent, #0005);

    }

    a{
        filter: hue-rotate(45deg);
        opacity: 0.9;
    }

    a:hover{
        background: #03E9F4;
        box-shadow: 0 0 5px #03E9F4, 0 0 25px #03E9F4, 0 0 50px #03E9F4, 0 0 200px #03E9F4;
        color: #050801;
    }
    a:focus {
        box-shadow: 0 0 5px #03E9F4, 0 0 15px #03E9F4, 0 0 25px #03E9F4, 0 0 75px #03E9F4;
    }

    a span{
        display: block;
        position: absolute;
    }

    a span:nth-child(1){
        animation: animate1 1.5s linear infinite;
        background: linear-gradient(90deg, transparent, #03E9F4);
        height: 2px;
        left: -100%;
        top: 0;
        width: 100%;
    }

    @keyframes animate1{
        0%{
            left: -100%;
        }
        50%, 100%{
            left: 100%;
        }
    }

    a span:nth-child(2){
        animation: animate2 1.5s linear infinite;
        animation-delay: 0.375s;
        background: linear-gradient(180deg, transparent, #03E9F4);
        height: 100%;
        top: -100%;
        right: 0;
        width: 2px;
    }

    @keyframes animate2{
        0%{
            top: -100%;
        }
        50%, 100%{
            top: 100%;
        }
    }

    a span:nth-child(3){
        animation: animate3 1.5s linear infinite;
        animation-delay: 0.75s;
        background: linear-gradient(270deg, transparent, #03E9F4);
        bottom: 0;
        height: 2px;
        right: -100%;
        width: 100%;
    }

    @keyframes animate3{
        0%{
            right: -100%;
        }
        50%, 100%{
            right: 100%;
        }
    }

    a span:nth-child(4){
        animation: animate4 1.5s linear infinite;
        animation-delay: 1.125s;
        background: linear-gradient(360deg, transparent, #03E9F4);
        bottom: -100%;
        height: 100%;
        left: 0;
        width: 2px;
    }

    @keyframes animate4{
        0%{
            bottom: -100%;
        }
        50%, 100%{
            bottom: 100%;
        }
    }
</style>
