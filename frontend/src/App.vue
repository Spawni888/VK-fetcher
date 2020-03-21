<template>
    <div id="app">
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        created() {
            window.scrollTo(0, 0);
        }
    }
</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
