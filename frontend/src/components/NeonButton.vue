<template>
    <div class="galaxy-button">
        <span />
        <span />
        <span />
        <span />
        <slot />
    </div>
</template>

<script>
export default {
    name: 'NeonButton',
};
</script>

<style scoped lang="scss">
    @import "@/assets/scss/main";

    .galaxy-button{
        cursor: pointer;
        color: #03E9F4;
        display: inline-block;
        font-size: 16px;
        letter-spacing: 4px;
        padding: 24px 30px;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        text-transform: uppercase;
        transition: 0.5s;
        -webkit-box-reflect: below 1px linear-gradient(transparent, #0005);
        @media (max-width: $smDesktopWidth) {
            font-size: 10px;
            padding: 22px 16px;
        }
        @media (max-width: $tableWidth) {
            font-size: 8px;
            padding: 16px 12px;
        }
    }

    .galaxy-button{
        filter: hue-rotate(45deg);
        opacity: 0.9;
    }

    .galaxy-button:hover{
        background: #03E9F4;
        box-shadow: 0 0 5px #03E9F4, 0 0 25px #03E9F4, 0 0 50px #03E9F4, 0 0 200px #03E9F4;
        color: #050801;
    }
    .galaxy-button:focus {
        box-shadow: 0 0 5px #03E9F4, 0 0 15px #03E9F4, 0 0 25px #03E9F4, 0 0 75px #03E9F4;
    }

    .galaxy-button span{
        display: block;
        position: absolute;
    }

    .galaxy-button span:nth-child(1){
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

    .galaxy-button span:nth-child(2){
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

    .galaxy-button span:nth-child(3){
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

    .galaxy-button span:nth-child(4){
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
